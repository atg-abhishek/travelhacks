import simplejson as json

def create_cat_mood_mapping(city):
	temp = {}
	with open("./datafiles/"+city+"_categories.json") as infile:
		temp = json.load(infile)
	categorieslist = temp['data']
	
