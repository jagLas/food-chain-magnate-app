"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request, abort
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from ..models import db, Player
from flask_jwt_extended import jwt_required, current_user


bp = Blueprint('main', __name__, url_prefix='/players')


@bp.route('',)
@jwt_required()
def get_players():
    """Returns a list of players and their ids"""

    players = Player.query.filter_by(user_id=current_user.id).order_by(Player.name).all()
    return [player.as_dict() for player in players]


@bp.route('', methods=['POST'])
@jwt_required()
def create_player():
    """Creates a new player"""

    data = request.json
    player = Player(**data)
    player.user = current_user
    try:
        db.session.add(player)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        name = data['name']
        abort(400, f'Player names must be unique. {name} already exists')

    return player.as_dict()


@bp.route('/<int:player_id>', methods=['PATCH'])
@jwt_required()
def modify_player(player_id):
    name = request.json['name']
    player = Player.query.filter_by(user_id=current_user.id, id=player_id).one_or_404()
    try:
        player.name = name
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, f'Player names must be unique. {name} already exists')

    return player.as_dict(), 200


@bp.route('/<int:player_id>', methods=['DELETE'])
@jwt_required()
def delete_player(player_id):
    """Creates a new player"""

    player = Player.query.options(joinedload(Player.games)).get_or_404(player_id)

    if player.user_id != current_user.id:
        abort(401, 'You do not have access to this record')

    status = {
        'deleted': False,
        'has_games': True if len(player.games) > 0 else False
    }

    status['ready'] = True if status['has_games'] is False else False

    if not status['ready']:
        status['msg'] = (
            'This player has Games associated with it and cannot be deleted until the'
            + ' following games have been removed')
        status['games'] = [game.as_dict() for game in player.games]
        return status, 202
    else:
        status['msg'] = 'No Games Associated. Ready for deletion'

    # if query string contains confirm=true, then game and all associated rounds and sales
    # data will be deleted.
    if 'confirm' in request.args and request.args['confirm'] == 'true':
        db.session.delete(player)
        db.session.commit()
        status['deleted'] = True
        status['msg'] = 'Player has been deleted'
        return jsonify(status), 200

    return status, 202
