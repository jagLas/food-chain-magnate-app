from flask import Flask
from flask_migrate import Migrate
from app.models import db
from .config import Configuration
from .routes.main import bp

# initialize Flask app
app = Flask(__name__)
app.config.from_object(Configuration)

# configure app to use SQLAlchemy
db.init_app(app)

# configure Alembic
migrate = Migrate(app, db)

# register routes
app.register_blueprint(bp)
