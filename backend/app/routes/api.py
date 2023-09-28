"""Blueprint for game api routes"""

from flask import Blueprint
from . import dev
from ..routes import players, games, auth
import os


bp = Blueprint('main', __name__, url_prefix='/api')

bp.register_blueprint(players.bp)
bp.register_blueprint(games.bp)
bp.register_blueprint(auth.bp)

if os.environ.get('ENV') != 'production':
    bp.register_blueprint(dev.bp)


@bp.route('/')
def api_index():
    return 'API server is running'
