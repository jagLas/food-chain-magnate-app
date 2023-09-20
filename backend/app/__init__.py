from flask import Flask, json
from flask_cors import CORS
from flask_migrate import Migrate
from app.models import db, User
from .config import Configuration
from .routes import main, seed, auth
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import JWTManager

# import logging

# initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object(Configuration)

# JWT Stuff
jwt = JWTManager(app)


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


# sorting causes errors in jsonify for /games/<game_id>/player_totals route
app.json.sort_keys = False

# configure app to use SQLAlchemy
db.init_app(app)

# configure Alembic
migrate = Migrate(app, db)

# register routes
app.register_blueprint(main.bp)
app.register_blueprint(seed.bp)
app.register_blueprint(auth.bp)


# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


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
