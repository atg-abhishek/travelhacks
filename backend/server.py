from flask import Flask, request
from utilities import *

app = Flask(__name__)

@app.route('/')
def landing():
	return "Welcome to the Travel hackathon team"

@app.route('/getCityInfo', methods=['POST'])
def cityInfo():
	cityName = request.form['cityName']
	lat = request.form['lat']
	lng = request.form['lng']

	return "You sent in " + cityName + " ," + str(lat) + " ," + str(lng)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=23001, debug=True)