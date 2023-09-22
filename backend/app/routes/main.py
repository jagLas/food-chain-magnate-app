"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request
from ..models import db, Player
from flask_jwt_extended import jwt_required, current_user


bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    """Route to test that server is running"""

    return jsonify('The api server is running')


@bp.route('/players',)
@jwt_required()
def get_players():
    """Returns a list of players and their ids"""

    players = current_user.players
    return [player.as_dict() for player in players]


@bp.route('/players', methods=['POST'])
@jwt_required()
def create_player():
    """Creates a new player"""

    data = request.json
    player = Player(**data)
    player.user = current_user
    db.session.add(player)
    db.session.commit()
    return player.as_dict()
