from flask import Flask 
from utilities import *

app = Flask(__name__)

@app.route('/')
def landing():
	return "Welcome to the Travel hackathon team"

if __name__ == '__main__':
	app.run(host='127.0.0.1', port=8888, debug=True)