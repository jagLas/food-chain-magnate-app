from flask import Blueprint, jsonify, request
from ..models import db, Game, Player, Round, Sale
from sqlalchemy.sql import functions as func

bp = Blueprint('test', __name__)


@bp.route('/')
def index():
    return jsonify('The api server is running')


@bp.route('/games')
def get_games():
    games = Game.query.all()
    return [game.as_dict() for game in games]


@bp.route('/games', methods=['POST'])
def create_game():
    data = request.json
    data['players'] = Player.query.filter(Player.id.in_(data['player_ids'])) \
        .all()
    data.pop('player_ids')
    game = Game(**data)
    db.session.add(game)
    db.session.commit()
    return game.as_dict()


@bp.route('/games/<int:game_id>/rounds/<int:round>/total')
def get_total_by_round(game_id, round):
    rounds = Round.query.filter_by(game_id=game_id, round=round).all()
    data = [round.get_totals() for round in rounds]
    return data


@bp.route('/games/<int:game_id>/rounds/<int:round>')
def get_rounds_by_num(game_id, round):
    rounds = Round.query.filter_by(game_id=game_id, round=round).all()
    return [round.as_dict() for round in rounds]


@bp.route('/games/<int:id>/rounds')
def get_rounds(id):
    rounds = Round.query.filter_by(game_id=id).all()
    return [round.as_dict() for round in rounds]


@bp.route('/players',)
def get_players():
    players = Player.query.all()
    return [player.as_dict() for player in players]


@bp.route('/players', methods=['POST'])
def create_player():
    data = request.json
    player = Player(**data)
    db.session.add(player)
    db.session.commit()
    return player.as_dict()
