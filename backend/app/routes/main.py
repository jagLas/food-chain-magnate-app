"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request, abort
from sqlalchemy.orm import joinedload
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

    players = Player.query.filter_by(user_id=current_user.id).order_by(Player.name).all()
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


@bp.route('/players/<int:player_id>', methods=['DELETE'])
@jwt_required()
def delete_player(player_id):
    """Creates a new player"""

    player = Player.query.options(joinedload(Player.games)).get_or_404(player_id)

    if player.user_id != current_user.id:
        abort(401, 'You do not have access to this record')

    if len(player.games):
        response = {
            'msg': 'This player has Games associated with it and cannot be deleted until the'
            + ' following games have been removed',
            'games': [game.as_dict() for game in player.games]
        }
        abort(400, response)

    db.session.delete(player)
    db.session.commit()

    return jsonify({'player_record': player.as_dict(), 'msg': 'User deleted'})
