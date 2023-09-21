"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request
from ..models import db, Player


bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    """Route to test that server is running"""

    return jsonify('The api server is running')


@bp.route('/players',)
def get_players():
    """Returns a list of players and their ids"""

    players = Player.query.all()
    return [player.as_dict() for player in players]


@bp.route('/players', methods=['POST'])
def create_player():
    """Creates a new player"""

    data = request.json
    player = Player(**data)
    db.session.add(player)
    db.session.commit()
    return player.as_dict()
