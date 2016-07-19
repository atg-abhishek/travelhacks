import simplejson as json
import rauth
from pprint import pprint
import requests
import operator
import sys
from weather import *
import re
import random

def key_fetcher(name):
        with open('keys.json') as infile:
                res = json.load(infile)
        return res[name]

def get_yelp_results(params):

    consumer_key = key_fetcher('yelp_consumer_key')
    consumer_secret = key_fetcher('yelp_consumer_secret')
    token = key_fetcher('yelp_token')
    token_secret = key_fetcher('yelp_token_secret')

    session = rauth.OAuth1Session(
            consumer_key = consumer_key
            ,consumer_secret = consumer_secret
            ,access_token = token
            ,access_token_secret = token_secret)

    # the params in the following request come from get_yelp_search_parameters
    request = session.get("http://api.yelp.com/v2/search",params=params)

    #Transforms the JSON API response into a Python dictionary
    data = request.json()
    session.close()

    return data

def get_yelp_search_parameters(lat, longi, mealType):
    #See the Yelp API for more details
    params = {}
    params["term"] = mealType
    params["ll"] = "{},{}".format(str(lat),str(longi))
    params["radius_filter"] = "1000"
    params["limit"] = "10"

    return params

def check_cached_city(city):
    temp = {}
    with open('./datafiles/cached_cities.json') as infile:
        temp = json.load(infile)
    cities = temp['data']
    if city in cities:
        return True
    else:
        cities.append(city)
        with open('./datafiles/cached_cities.json','w') as outfile:
            json.dump({"data" : cities}, outfile)
        return False

def get_list_of_activities(city, categories, min_hours=2, max_hours=6):  #TODO: provide default categories so when categories param is not given, all activities are returned
    # if check_cached_city(city):
    #     temp = {}
    #     with open('./datafiles/'+city+'_activities.json') as infile:
    #         temp = json.load(infile)
    #     activities = temp['data']
    #     return activities

    
        expedia_consumer_key = key_fetcher('expedia_consumer_key')
        url = "http://terminal2.expedia.com/x/activities/search?location={}&apikey={}".format(city, expedia_consumer_key)

        all_categories = ["Nightlife", "Air, Balloon & Helicopter Tours", "Cruises & Water Tours", "Attractions",
                          "Hop-on Hop-off", "Water Activities", "Disney", "Adventures", "Show & Sport Tickets",
                          "Tours & Sightseeing", "Spa", "Private Tours", "Theme Parks", "Sightseeing Passes",
                          "Walking & Bike Tours"]

        categories = all_categories  #TODO: REPLACE WITH CUSTOM CATEGORIES FROM MOOD

        try:
            r = requests.post(url)
            activities = r.json()['activities']

            def has_one_of_categories(activity, categories):
                return any(cat in activity['categories'] for cat in categories)

            def is_within_duration_bounds(activity, min_hours, max_hours):
                duration_json = activity['duration']
                if not duration_json:
                    return False

                duration_match = re.match("(.)h", activity['duration'])
                if not duration_match:
                    return False

                duration_str = duration_match.group(1)
                if not duration_str:
                    return False
                else:
                    return min_hours <= int(duration_str) <= max_hours

            def create_keywords_field(act):
                title = act['title']
                cats = act['categories']
                text = ""
                for c in cats:
                    text = text + " " + c
                text = text + " " + title
                act_kw = get_keywords(text)
                return act_kw

            # filtered_by_categories = [act for act in activities if has_one_of_categories(act, categories)] TODO: GO DIRECTLY FROM MOOD TO ACTIVITY

            final_activities = []
            for act in activities:
                if is_within_duration_bounds(act, min_hours, max_hours):
                    keywords = create_keywords_field(act)
                    cleaned_activity = {'id': act['id'],
                                        'name': act['title'],
                                        'image': act['largeImageURL'],
                                        'latlng': [float(coord) for coord in act['latLng'].split(',')],
                                        'price': act['fromPrice'],
                                        'type': "activity",
                                        'keywords': keywords,
                                        'moods': mood_keywords_mapper(act,keywords)
                                        }
                    final_activities.append(cleaned_activity)

            with open('./datafiles/'+city+"_activities.json", 'w') as outfile:
                json.dump({"data":final_activities}, outfile)
            return final_activities
        except:
            return "null"

def get_list_of_restaurants(lat, lng, meal_type):
    params = get_yelp_search_parameters(lat, lng, meal_type)
    restaurants = get_yelp_results(params)['businesses']
    while not restaurants:
        params["radius_filter"] = 2*params["radius_filter"]
        restaurants = get_yelp_results(params)['businesses']

    removed_unused_fields = [{'id': restaurant['id'],
                              'name': restaurant['name'],
                              'image': restaurant['image_url'],
                              'latlng': [restaurant['location']['coordinate']['latitude'],
                                         restaurant['location']['coordinate']['longitude']],
                              'url': restaurant['mobile_url'],
                              'rating_img_url': restaurant['rating_img_url'],
                              'price': 0,  #TODO: try to get it from yelp website
                              'type': "restaurant"
                              } for restaurant in restaurants if not restaurant['is_closed'] and float(restaurant['rating']) >= 3.9]
    return removed_unused_fields

def get_keywords(sentence=""):
    api_key = key_fetcher('indico_api_key')
    url = "https://apiv2.indico.io/keywords?key="+api_key+"&version=2"
    try:
        r = requests.post(url, data={"data" : sentence})
        val = r.json()['results']
        sorted_val = sorted(val.items(), key=operator.itemgetter(1), reverse=True)
        res = []
        if (len(sorted_val) > 5):
            res = [sorted_val[0], sorted_val[1], sorted_val[2], sorted_val[3], sorted_val[4]]
        else:
            for sv in sorted_val:
                res.append(sv)
        return res
    except:
        return "null"

def get_sentiments(sentence=""):
    api_key = key_fetcher('indico_api_key')
    url = "https://apiv2.indico.io/sentimenthq?key="+api_key
    try:
        r = requests.post(url, data={"data" : sentence})
        val = r.json()['results']
        return val
    except:
        return "null"

def get_emotions(sentence=""):
    api_key = key_fetcher('indico_api_key')
    url = "https://apiv2.indico.io/emotion?key="+api_key
    try:
        r = requests.post(url, data={"data" : sentence})
        # pprint(r.text)
        val = r.json()['results']
        # pprint(type(val))
        sorted_val = sorted(val.items(), key=operator.itemgetter(1), reverse=True)
        res = [sorted_val[0], sorted_val[1]]
        return res
    except:
        return "null"

def google_places(radius, lat=45.5268224, lng=-73.5799845):
    api_key = key_fetcher('google_places_api_key')
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+str(lat)+','+str(lng)
    payload = {'radius' : radius, 'key' : api_key}
    
    r = requests.get(url, params=payload)
    res = r.json()
    return res

def google_city_photos(lat,lng):
    return "null"

def get_unique_items_for_list(li):
    # takes in a list and returns a list with unique items
    myset = set(li)
    return list(myset)

def get_expedia_compliant_categories_from_moods_list():
    temp = {}
    with open('./datafiles/moods_list.json') as infile:
        temp = json.load(infile)
    moods = temp['data']
    temp1 = {}
    with open('./datafiles/unique_categories_master_list.json') as infile:
        temp1 = json.load(infile)
    expedia_categories = temp1['data']
    
def get_city_from_lat_lng(lat=45.5268224, lng=-73.5799845):
    url="http://nominatim.openstreetmap.org/reverse?format=json&lat="+str(lat)+"&lon="+str(lng)+"&zoom=18&addressdetails=1"
    r = requests.get(url)
    return r.json()['address']['city']

def get_indoor_outdoor_temp_weather(query_type,lat=45.5268224, lng=-73.5799845):
    # query type is used to select weather you want indoor outdoor or the actual weather description
    city = get_city_from_lat_lng(lat,lng)
    # with open('./datafiles/weather_cache.json') as infile:

    api_key = key_fetcher('weather_key')
    url1 = "http://api.openweathermap.org/data/2.5/weather?lat="+str(lat)+"&lon="+str(lng)+"&APPID="+api_key
    r = requests.get(url1)
    print(r.text)
    r = r.json()
    weather_type = r['weather'][0]['main']
    supp_weather_info = r['weather'][0]['description']
    w_info = weather_type + " " + supp_weather_info
    w_dec = False
    if re.search('rain', w_info, re.IGNORECASE) or re.search('cloud', w_info, re.IGNORECASE) or re.search('snow', w_info, re.IGNORECASE):
        w_dec = True
    humidity = r['main']['humidity']
    hum_dec = False
    if humidity >=70:
        hum_dec = True
    max_temp = r['main']['temp_max']
    min_temp = r['main']['temp_min']
    temp = r['main']['temp'] - 273.15
    weather_decision = hum_dec and w_dec
    wdecstr = ""
    if weather_decision:
        wdecstr="inside"
    else:
        wdecstr="outside"
    if query_type=='activities':
        return {'temp' : temp, 'type_of_activities' : wdecstr}
    else:
        return {'temp' : temp, 'weather' : supp_weather_info}


# pprint(get_city_from_lat_lng())
def generate_itinerary(city, moods):
    activities = []

    if not check_cached_city(city):
        activities = get_list_of_activities(city, ["", ""])
        if len(activities) < 3:
            return "null"
        generate_mood_indexed_files_for_city(city)
    else:
        temp = {}
        with open('./datafiles/'+city+'_activities.json') as infile:
            temp = json.load(infile)
        activities = temp['data']

    temp = {}
    with open('./datafiles/' + city + '_moods.json') as infile:
        temp = json.load(infile)
    mood_arrs = temp['data']

    morning_activity = {}
    afternoon_activity = {}
    nightlife = {}

    moods = moods.split(',')
    pprint("The moods are " )
    pprint(moods)

    if len(moods) == 0:
        return 'null'
    elif len(moods) == 1:
        if len(mood_arrs[moods[0]]) < 3:
            return 'null'
        morning_activity, afternoon_activity, nightlife = random.sample(mood_arrs[moods[0]], 3)
    elif len(moods) >= 2:
        mood_0_acts = mood_arrs[moods[0]]
        if not mood_0_acts:
            morning_activity = random.choice(activities)
        else:
            morning_activity = random.choice(mood_0_acts)

        mood_1_acts = mood_arrs[moods[1]]
        if not mood_1_acts:
            afternoon_activity = random.choice(activities)
            nightlife = random.choice(activities)
        else:
            afternoon_activity = random.choice(mood_1_acts)
            nightlife = random.choice(mood_1_acts)

    breakfast_restaurant = random.choice(get_list_of_restaurants(morning_activity['latlng'][0], morning_activity['latlng'][1], 'breakfast'))
    lunch_restaurant = random.choice(get_list_of_restaurants(afternoon_activity['latlng'][0], afternoon_activity['latlng'][1], 'lunch'))
    dinner_restaurant = random.choice(get_list_of_restaurants(nightlife['latlng'][0], nightlife['latlng'][1], 'dinner'))
    return {'breakfast_restaurant': breakfast_restaurant,
            'morning_activity': morning_activity,
            'lunch_restaurant': lunch_restaurant,
            'afternoon_activity': afternoon_activity,
            'dinner_restaurant': dinner_restaurant,
            'nightlife': nightlife}

def generate_mood_indexed_files():
    cities = ['montreal', 'sanfrancisco', 'chicago', 'boston', 'tokyo', 'paris', 'delhi', 'beijing', 'berlin', 'london', 'losangeles', 'bangkok', 'taipei','saopaolo', 'buenosaires','capetown']
    # cities = ['newyork']
    for city in cities:
        pprint("Running for " + city)
        temp = {}
        with open('./datafiles/' + city + '_activities.json') as infile:
            temp = json.load(infile)
        activities = temp['data']

        moods = {"adventurous": [],
                 "relaxed": [],
                 "comical": [],
                 "nerdy": [],
                 "romantic": [],
                 "artsy": []}

        for act in activities:
            for mood in act['moods']:  # Assuming only relevant moods here
                moods[mood['mood']].append(act)

        with open('./datafiles/' + city + '_moods.json', 'w') as outfile:
            json.dump({"data": moods}, outfile)

def generate_mood_indexed_files_for_city(city):
    pprint("Generating mood file for " + city)
    temp = {}
    with open('./datafiles/' + city + '_activities.json') as infile:
        temp = json.load(infile)
    activities = temp['data']

    moods = {"adventurous": [],
             "relaxed": [],
             "comical": [],
             "nerdy": [],
             "romantic": [],
             "artsy": []}

    for act in activities:
        for mood in act['moods']:  # Assuming only relevant moods here
            moods[mood['mood']].append(act)

    with open('./datafiles/' + city + '_moods.json', 'w') as outfile:
        json.dump({"data": moods}, outfile)

def mood_keywords_mapper(act, keywords):
    moodlist = ["relaxed", "comical", "adventurous", "artsy", "romantic", "nerdy"]
    mood_scores = []
    for m in moodlist:
        m_score = 0
        for k in keywords:
            url = "http://swoogle.umbc.edu/SimService/GetSimilarity?operation=api&phrase1="+k[0]+"_NN&phrase2="+m+"_JJ"
            r = requests.get(url)
            res = r.json()*k[1]
            m_score+=res
        if (m_score<0.0001):
            continue
        mood_scores.append({"mood" : m, "score" : m_score})
    if len(mood_scores)==0:
        return []
    def extract_score(json):
        return json['score']
    mood_scores.sort(key=extract_score,reverse=True)
    return mood_scores

# pprint(mood_keywords_mapper({
#         "name": "NYC TV & Movie Tour",
#         "id": "183365",
#         "price": "$43",
#         "latlng": [40.764654, -73.9795217],
#         "image": "//a.travel-assets.com/lxweb/media-vault/183365_l.jpeg?v=101827",
#         "type": "activity",
#         "keywords": [
#             ["Tours", 0.6815710872],
#             ["NYC", 0.270949264],
#             ["Sightseeing", 0.270949264],
#             ["Movie", 0.22532258060000002],
#             ["TV", 0.22532258060000002]
#         ]
#     })) 
# pprint(get_list_of_activities("newyork", categories=["placeholder1", "placeholder"]))

#google_places(-33.8670,151.1957, 500, 'food', 'cruise' )
# x = get_emotions("well this is such an interesting thing, let's talk more about this tomorrow")
# pprint(x)
# pprint(str(x[0][1]) + " " + str(x[1][1]))

# y = get_keywords("Yes, but it's not as good as it was back in the day")
# x = get_keywords("The National Aeronautics and Space Administration (NASA) is an independent agency of the executive branch of the United States Federal Government responsible for the civilian space program as well as aeronautics and aerospace research")
# pprint(y)

# pprint(get_list_of_restaurants(45.5017, -73.5673, 'lunch'))

# pprint(generate_itinerary("newyork", categories=["Adventures", "Spa", "Attractions"]))

# temp = ['montreal', 'sanfrancisco', 'chicago', 'boston', 'tokyo', 'paris', 'delhi', 'beijing', 'berlin', 'london', 'losangeles', 'bangkok', 'taipei','saopaolo', 'buenosaires','capetown']
# for t in temp:
#     pprint("Running for " + t)
#     get_list_of_activities(t, categories=["placeholder1", "placeholder"])

# generate_mood_indexed_files()
# print(get_list_of_activities('vienna', ['romantic', 'relaxed']))

# google_places(2000)