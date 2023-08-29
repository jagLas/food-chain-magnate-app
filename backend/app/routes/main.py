from flask import Blueprint, jsonify, request
from ..models import db, Game

bp = Blueprint('test', __name__)


@bp.route('/')
def index():
    return jsonify('The api server is running')


@bp.route('/games')
def get_games():
    games = Game.query.all()
    data = [game.as_dict() for game in games]
    return data


@bp.route('/games', methods=['POST'])
def create_game():
    data = request.json
    game = Game(**data)
    db.session.add(game)
    db.session.commit()

    return game.as_dict()
