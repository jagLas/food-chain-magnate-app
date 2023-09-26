"""Blueprint for game api routes"""

from flask import Blueprint, jsonify
from ..routes import players, games, auth


bp = Blueprint('main', __name__)

bp.register_blueprint(players.bp)
bp.register_blueprint(games.bp)
bp.register_blueprint(auth.bp)


@bp.route('/')
def index():
    """Route to test that server is running"""

    return jsonify('The api server is running')
