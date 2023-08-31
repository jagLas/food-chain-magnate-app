"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request
from sqlalchemy import desc
from ..models import db, Game, Player, Round
from ..queries import player_total_sales, result_to_dict

bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    """Route to test that server is running"""

    return jsonify('The api server is running')


@bp.route('/games')
def get_games():
    """Retrieves all games in db"""

    games = Game.query.all()
    return [game.as_dict() for game in games]


@bp.route('/games', methods=['POST'])
def create_game():
    """create a new game. Use JSON Encoded data"""

    data = request.json
    data['players'] = Player.query.filter(Player.id.in_(data['player_ids'])) \
        .all()
    data.pop('player_ids')
    game = Game(**data)
    db.session.add(game)
    db.session.commit()
    return game.as_dict()


@bp.route('/games/<int:game_id>/rounds/<int:round_num>/total')
def get_total_by_round(game_id, round_num):
    """Retreive player totals per game_id and round number"""

    rounds = Round.query.filter_by(game_id=game_id, round=round_num).all()
    data = [record.get_totals() for record in rounds]
    return data


@bp.route('/games/<int:game_id>/rounds/<int:round_num>')
def get_rounds_by_num(game_id, round_num):
    """Route to retrieve records for each game_id and round number"""

    rounds = Round.query.filter_by(game_id=game_id, round=round_num).all()
    return [record.as_dict() for record in rounds]


@bp.route('/games/<int:id>/rounds')
def get_rounds(game_id):
    """Retrieves all round records for a given game_id"""

    rounds = Round.query.filter_by(game_id=game_id).all()
    return [round.as_dict() for round in rounds]


@bp.route('/games/<int:game_id>/player_totals')
def get_player_totals(game_id):

    """Returns the game_id, player_id,
    and total income for each player"""

    player_totals = player_total_sales(game_id).all()
    return result_to_dict(player_totals)


@bp.route('/games/<int:game_id>/bank')
def get_bank(game_id):
    """Returns how much money is left in the bank for a supplied game"""

    # Retrives bank funds
    bank = Game.query.get_or_404(game_id)
    bank_total = bank.bank_start + bank.bank_reserve

    # Calculates how much income players have generated
    player_totals = player_total_sales(game_id).order_by(desc('player_id'))\
        .first()
    bank_result = bank_total - player_totals.total_income

    return jsonify(bank_result)


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
