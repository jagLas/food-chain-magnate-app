from flask import Flask, jsonify
from .config import Configuration

app = Flask(__name__)
app.config.from_object(Configuration)

@app.route('/')
def index():
    return jsonify('The server is up and running')
