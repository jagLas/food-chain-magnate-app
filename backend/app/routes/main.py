"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request, abort
from sqlalchemy import desc
from sqlalchemy.orm import joinedload
from ..models import db, Game, Player, Sale, Round
from ..queries import player_total_sales, round_total_sales, \
    house_sales_query, sale_with_calc, result_to_dict

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


# @bp.route('/games/<int:game_id>/rounds/<int:round_num>/total')
# def get_total_by_round(game_id, round_num):
#     """Retreive player totals per game_id and round number"""

#     rounds = Round.query.filter_by(game_id=game_id, round=round_num).all()
#     data = [record.get_totals() for record in rounds]
#     return data


# @bp.route('/games/<int:game_id>/rounds/<int:round_num>')
# def get_rounds_by_num(game_id, round_num):
#     """Route to retrieve records for each game_id and round number"""

#     rounds = Round.query.filter_by(game_id=game_id, round=round_num).all()
#     return [record.as_dict() for record in rounds]


@bp.route('/debug')
def debug():
    """Retrieves all round records for a given game_id"""

    sale = sale_with_calc(1)
    print(result_to_dict(sale))
    return 'test'


@bp.route('/games/<int:game_id>/rounds')
def get_rounds(game_id):
    """Retrieves all round records for a given game_id"""

    rounds = round_total_sales(game_id).all()
    return result_to_dict(rounds)


@bp.route('/games/<int:game_id>/rounds/add-round',  # methods=['POST']
          )
def add_round(game_id):
    # eager loads the game by id and joins with the players and rounds
    try:
        game = db.session.query(Game)\
            .filter_by(id=game_id)\
            .options(joinedload(Game.players))\
            .options(joinedload(Game.rounds))\
            .one()
    except Exception:
        abort(404,
              description='Game record not found. Try a different game id')

    # calculates the last round number using
    # player count and number of round records
    num_players = len(game.players)
    last_round = int(len(game.rounds) / num_players)

    # Queries the previous rounds for each player and turns to dict
    prev_rounds = Round.query.filter_by(game_id=game_id, round=last_round)\
        .all()
    prev_rounds = [round.as_dict() for round in prev_rounds]

    # Goes throuh each previous round and copies them to next round num
    new_records = []
    for prev_round in prev_rounds:
        prev_round.pop('id')
        prev_round['round'] = last_round + 1
        next_round = Round(**prev_round)
        new_records.append(next_round)

    db.session.add_all(new_records)
    db.session.commit()

    # if new records were added, returns the new records
    if len(new_records) != 0:
        return [round.as_dict() for round in new_records]

    # otherwise, create a record for each player
    # goes through each player and game and creates a record for them
    for player in game.players:
        new_round = Round(round=last_round + 1, player=player)

        # adds to the game record
        game.rounds.append(new_round)

    db.session.add_all(game.rounds)
    db.session.commit()

    # returns new round records as json
    return [round.as_dict() for round in game.rounds]


@bp.route('/games/<int:game_id>/sales')
def get_sales(game_id):
    """Retrieves all sale records for a given game_id"""

    sales = house_sales_query(game_id).all()
    return result_to_dict(sales)


@bp.route('/games/<int:game_id>/players')
def get_game_players(game_id):
    """Retrieves all sale records for a given game_id"""

    players = Game.query.get_or_404(game_id).players
    return [player.as_dict() for player in players]


@bp.route('/games/<int:game_id>/sales', methods=['POST'])
def add_sale(game_id):
    """adds a sale record to given game_id. JSON must be formated as per the
    following example:
    {
        "player_id": 1,
        "round": 2,
        "house_number": 3,
        "garden": true,
        "burgers": 1,
        "pizzas": 2,
        "drinks": 3
    }
    """

    data = request.json

    # finds the corresponding Round record given the
    # player_id, game_id, and round number
    game_round = Round.query.filter_by(game_id=game_id,
                                       player_id=data['player_id'],
                                       round=data['round']
                                       ).one()

    # removes unnecessary entries from data
    data.pop('round')
    data.pop('player_id')

    # creates and commits record
    sale = Sale(round=game_round, **data)
    db.session.add(sale)
    db.session.commit()
    return result_to_dict(sale_with_calc(sale.id))


@bp.route('/games/<int:game_id>/player_totals')
def get_player_totals(game_id):

    """Returns the game_id, player_id,
    and total income for each player"""

    player_totals_sub = player_total_sales(game_id).subquery()
    player_totals = db.session.query(player_totals_sub, Player.name)\
        .outerjoin(Player).all()
    player_totals = result_to_dict(player_totals)

    # processing in the event that no rounds have been created
    if len(player_totals) == 1:
        players = Game.query.get(game_id).players
        # sorting by reverse puts them in alphabetical order when appended to
        # front
        players.sort(key=lambda x: x.name, reverse=True)
        for player in players:
            player_totals.insert(0, {
                'player_id': player.id,
                'total_revenue': 0,
                'total_expenses': 0,
                'total_income': 0,
                'name': player.name
            })

        player_totals[-1]['total_revenue'] = 0
        player_totals[-1]['total_expenses'] = 0
        player_totals[-1]['total_income'] = 0

    return player_totals


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
