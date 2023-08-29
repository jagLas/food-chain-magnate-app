from flask import Blueprint, jsonify, request
from ..models import db, Game, Player

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
    game = Game(**data)
    db.session.add(game)
    db.session.commit()
    return game.as_dict()


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
