"""Blueprint for game api routes"""

from flask import Blueprint, jsonify, request, abort
from sqlalchemy.orm import joinedload
from ..models import db, Game, Player, Sale, Round
from ..queries import round_total_sales, house_sales_query, sale_with_calc, result_to_dict

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
    data['players'] = Player.query.filter(Player.id.in_(data['player_ids'])).all()
    data.pop('player_ids')
    game = Game(**data)
    db.session.add(game)
    db.session.commit()
    return game.as_dict()


@bp.route('/games/<int:game_id>/rounds')
def get_rounds(game_id):
    """Retrieves all round records for a given game_id"""

    rounds = round_total_sales(game_id=game_id).all()
    return result_to_dict(rounds)


@bp.route('/games/<int:game_id>/rounds', methods=['POST'])
def add_round(game_id):
    # eager loads the game by id and joins with the players and rounds
    try:
        game = db.session.query(Game)\
            .filter_by(id=game_id)\
            .options(joinedload(Game.players))\
            .options(joinedload(Game.rounds))\
            .one()
    except Exception:
        abort(404, description='Game record not found. Try a different game id')

    # calculates the last round number using
    # player count and number of round records
    num_players = len(game.players)
    last_round = int(len(game.rounds) / num_players)

    # Queries the previous rounds for each player and turns to dict
    prev_rounds = Round.query.filter_by(game_id=game_id, round=last_round).all()
    prev_rounds = [round.as_dict() for round in prev_rounds]

    # Goes throuh each previous round and copies them to next round num
    new_records = []
    for prev_round in prev_rounds:
        [prev_round.pop(key) for key in ['round_id', 'unit_price', 'waitresses', 'salaries_paid']]
        prev_round['round'] = last_round + 1
        next_round = Round(**prev_round)
        new_records.append(next_round)

    db.session.add_all(new_records)
    db.session.commit()

    # if rounds were created return results
    if len(new_records) != 0:
        records = [result_to_dict((round_total_sales(id=round.id)).one()) for round in new_records]
        return records

    # otherwise, create a record for each player
    # goes through each player and game and creates a record for them
    for player in game.players:
        new_round = Round(round=last_round + 1, player=player)

        # adds to the game record
        game.rounds.append(new_round)

    db.session.add_all(game.rounds)
    db.session.commit()

    # returns new round records as json
    records = [result_to_dict((round_total_sales(id=round.id)).one()) for round in game.rounds]

    return records


@bp.route('/games/<int:game_id>/rounds/<int:round_id>', methods=['PATCH'])
def update_round(game_id, round_id):
    """Takes a json request in the following form
    {
        "first_burger": false,
        "first_pizza": true,
        "first_drink": true,
        "first_waitress": true,
        "cfo": false,
        "unit_price": 5,
        "waitresses": 1,
        "salaries_paid": 2
    }

    all keys are optional. Returns the modified round record with totals.
    If the sales for the round would be affected, those are returned too
    under a "sales" key. Otherwise, "sales" is set to False
    """
    game_round = Round.query.get_or_404(round_id)

    # checks verifies integreity of game_id and round_id combination
    if game_id != game_round.game_id:
        abort(400, description=f'Round Id {round_id} not a record of game id {game_id}')

    data = request.json

    # copies the round record so it can be compared for changes
    game_round_copy = game_round.as_dict()

    # remove columns we don't want to update, like round and id
    unchangeable_columns = ['id', 'game_id', 'round', 'player_id']
    for key in unchangeable_columns:
        if key in data:
            data.pop(key)

    # sets the record values to the new ones
    for key in data:
        game_round.__setattr__(key, data[key])

    db.session.add(game_round)
    db.session.commit()

    # checks if any keys that affect sale calculations have been changed
    sale_affecting_keys = ['first_burger', 'first_pizza', 'first_drink',
                           'first_waitress', 'unit_price']
    sales_affected = False
    for key in sale_affecting_keys:
        if game_round.__getattribute__(key) != game_round_copy[key]:
            sales_affected = True

    return_data = {
        'round': result_to_dict(round_total_sales(game_id=game_id, id=round_id).one())
    }

    return_data['sales'] = result_to_dict(
        house_sales_query(game_id, id=round_id).all()
        ) if sales_affected else False

    return return_data


@bp.route('/games/<int:game_id>/sales')
def get_sales(game_id):
    """Retrieves all sale records for a given game_id"""

    sales = house_sales_query(game_id=game_id).all()
    return result_to_dict(sales)


@bp.route('/games/<int:game_id>/sales', methods=['POST'])
def add_sale(game_id):
    """adds a sale record to given game_id. JSON must be formated as per the following example:
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

    # finds the corresponding Round record given the player_id, game_id, and round number
    game_round = Round.query.filter_by(game_id=game_id,
                                       player_id=data['player_id'],
                                       round=data['round']).one()

    # removes unnecessary entries from data
    data.pop('round')
    data.pop('player_id')

    # creates and commits record
    sale = Sale(round=game_round, **data)
    db.session.add(sale)
    db.session.commit()
    result = {}
    result['sale'] = result_to_dict(sale_with_calc(sale.id))
    result['round'] = result_to_dict(round_total_sales(game_id=game_id, id=sale.round.id).one())

    return result


@bp.route('/games/<int:game_id>/sales/<int:sale_id>', methods=['DELETE'])
def delete_sale(game_id, sale_id):
    """Deletes a sale by sale_id and returns the recalculated round record"""
    sale = Sale.query.get_or_404(
        sale_id,
        description=f'Sale could not be found with id {sale_id}'
    )

    round_record = sale.round

    db.session.delete(sale)
    db.session.commit()

    return_record = result_to_dict(
        round_total_sales(id=round_record.id).one()
    )

    return return_record


@bp.route('/games/<int:game_id>/players')
def get_game_players(game_id):
    """Retrieves all sale records for a given game_id"""

    players = Game.query.get_or_404(game_id).players
    return [player.as_dict() for player in players]


@bp.route('/games/<int:game_id>/bank')
def get_bank(game_id):
    """Returns how much money is left in the bank for a supplied game"""

    # Retrives bank funds
    bank = Game.query.get_or_404(game_id)

    bank_info = {
        'start': bank.bank_start,
    }

    bank_info['reserve'] = 0 if bank.bank_reserve is None else bank.bank_reserve
    bank_info['total'] = bank_info['start'] + bank_info['reserve']

    return bank_info


@bp.route('/games/<int:game_id>/bank', methods=['PATCH'])
def edit_game(game_id):
    """create a new game. Use JSON Encoded data"""

    data = request.json
    game = Game.query.get_or_404(game_id)
    game.bank_reserve = data['reserve']
    db.session.commit()
    return {
        'reserve': game.bank_reserve
    }


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
