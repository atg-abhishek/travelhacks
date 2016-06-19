import simplejson as json

def create_cat_mood_mapping(city):
	temp = {}
	with open('./datafiles/moodlist.json') as infile:
		temp = json.load(infile)
	moodlist = temp['data']
	