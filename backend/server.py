from flask import Flask, request, jsonify
from utilities import *
from flask.ext.cors import CORS, cross_origin
from pprint import pprint
app = Flask(__name__)
CORS(app)

@app.route('/')
def landing():
	return "Welcome to the Travel hackathon team"

@app.route('/getCityInfo', methods=['POST'])
def cityInfo():
	lat = request.form['lat']
	lng = request.form['lng']
	temp = {"image" : "https://bonanzleimages.s3.amazonaws.com/afu/images/2037/1061/84/DM-0358.jpg", "weather" : "cloudy", "possible_moods" : ["relaxed", "playful", "comic"], "city": get_city_from_lat_lng(lat,lng)}
	return jsonify(temp)



if __name__ == '__main__':
	app.run(host='0.0.0.0', port=23001, debug=True)