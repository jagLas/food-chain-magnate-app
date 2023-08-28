from flask import Flask, jsonify
from flask_migrate import Migrate
from app.models import db
from .config import Configuration

app = Flask(__name__)
app.config.from_object(Configuration)
db.init_app(app)
migrate = Migrate(app, db)


@app.route('/')
def index():
    return jsonify('The server is up and running')
