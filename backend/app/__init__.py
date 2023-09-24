from flask import Flask, json, jsonify, make_response
from flask_cors import CORS
from flask_migrate import Migrate
from app.models import db, User
from .config import Configuration
from .routes import main, seed, auth, games
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import JWTManager
import traceback

# import logging

# initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)  # supports credentials needed to send cookies
app.config.from_object(Configuration)

# JWT Stuff
jwt = JWTManager(app)


# JWT Setup for auto user loading
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    response = make_response(jsonify(
        code=401, signout=True,
        description="Your session has expired, and you have been signed out"), 401)
    response.set_cookie('access_token_cookie', '', expires=0)
    response.set_cookie('csrf_access_token', '', expires=0)
    return response


# sorting causes errors in jsonify for /games/<game_id>/player_totals route
app.json.sort_keys = False

# configure app to use SQLAlchemy
db.init_app(app)

# configure Alembic
migrate = Migrate(app, db)

# register routes
app.register_blueprint(main.bp)
app.register_blueprint(games.bp)
app.register_blueprint(seed.bp)
app.register_blueprint(auth.bp)


# # Uncomment to turn on printing of SQL statements
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


@app.errorhandler(Exception)
def generic_error(error):
    traceback.print_exc()

    response = make_response()
    response.data = json.dumps({
        'code': 500,
        'name': 'Internal Server Error',
        'description': 'The server has encountered a situation it does not know how to '
                       + 'handle. Please check the server logs'
    })

    response.content_type = 'application/json'
    return response, 500


# turns errors into json responses
@app.errorhandler(HTTPException)
def not_found(error):
    response = error.get_response()
    response.data = json.dumps({
        'code': error.code,
        'name': error.name,
        'description': error.description
    })

    response.content_type = 'application/json'

    return response
