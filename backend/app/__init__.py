from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.models import db
from .config import Configuration
from .routes import main, seed

# initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object(Configuration)

# sorting causes errors in jsonify for /games/<game_id>/player_totals route
app.json.sort_keys = False

# configure app to use SQLAlchemy
db.init_app(app)

# configure Alembic
migrate = Migrate(app, db)

# register routes
app.register_blueprint(main.bp)
app.register_blueprint(seed.bp)
