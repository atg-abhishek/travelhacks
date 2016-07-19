import requests, re
import simplejson as json

with open('keys.json') as infile: 
	keys = json.load(infile)

api_key = keys['weather_key']

def get_weather(lat=45.5268224, lng=-73.5799845):
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
	return {'temp' : temp, 'type_of_activities' : wdecstr}

# print (get_weather())