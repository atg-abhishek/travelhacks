from flask.ext.script import Manager
from server import app

manager = Manager(app)

@manager.command
def hello():
	"Just saying hello"
	print ('Hello')

@manager.option('-n', '--name', help='Please enter your name')
def complex(name):
	print('hello ', name)

@manager.option('-n', '--name', dest='name', default='Abhishek', help="Enter your name")
@manager.option('-u', '--url', dest='url', default=None, help="Enter how did you get here")
def new_hello(name, url):
	if url is None:
		print("hello ", name)
	else:
		print('hello ', name ,"from " , url)

manager.add_option('-c', '--config', dest='config', required=False)

if __name__ == '__main__':
	manager.run()