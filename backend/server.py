from flask import Flask 
from utilities import *

app = Flask(__name__)

@app.route('/')
def landing():
	return "Welcome to the Travel hackathon team"

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8888, debug=True)