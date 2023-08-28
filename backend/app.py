from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'The server is up and running'
