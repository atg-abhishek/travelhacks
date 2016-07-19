from pprint import pprint
import simplejson as json
import requests
from utilities import key_fetcher, get_unique_items_for_list

def getCats(filename):
	temp = {}
	with open('./datafiles/'+filename+'_expedia.json') as infile:
		temp = json.load(infile)

	temp_cats = temp['filterCategories']
	cats = []
	for k in temp_cats:
		cats.append(k)
	# return cats
	with open('./datafiles/'+filename+'_categories.json','w') as outfile:
		json.dump({"data":cats}, outfile)

def getActivities(city):
	expedia_consumer_key = key_fetcher('expedia_consumer_key')
	url = "http://terminal2.expedia.com/x/activities/search?location={}&apikey={}".format(city, expedia_consumer_key)
	try:
		r = requests.post(url)
		temp = r.json()
		with open('./datafiles/'+city+'_expedia.json','w') as outfile:
			json.dump(temp, outfile)
		return "success"
	except:
		pprint("Failed " + city)
		return "failed"
    
def process_cities(li):
	master_list = []
	for l in li:
		pprint("Now processing " + l)
		y = getActivities(l)
		if y=='failed':
			continue
		pprint("getActivities done")
		x = getCats(l)
		pprint("getCats done")
		master_list.extend(x)
	with open('./datafiles/expedia_categories_master_list.json','w') as outfile:
			json.dump(master_list, outfile)
	return "Success"

# process_cities(['montreal', 'sanfrancisco', 'chicago', 'boston', 'tokyo', 'paris', 'delhi', 'beijing', 'berlin', 'london', 'losangeles', 'bangkok', 'taipei','saopaolo', 'buenosaires','capetown'])

def generate_master_list():
	temp = {}
	with open('./datafiles/expedia_categories_master_list.json') as infile:
		temp = json.load(infile)
	li = get_unique_items_for_list(temp['data'])
	res = {'data' : li}
	with open('./datafiles/unique_categories_master_list.json','w') as outfile:
		json.dump(res, outfile)
	return "success"

# temp = ['montreal', 'sanfrancisco', 'chicago', 'boston', 'tokyo', 'paris', 'delhi', 'beijing', 'berlin', 'london', 'losangeles', 'bangkok', 'taipei','saopaolo', 'buenosaires','capetown']
# for t in temp:
# 	getCats(t)