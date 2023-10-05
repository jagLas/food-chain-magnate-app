"""Blueprint for game api routes"""

from flask import Blueprint, request, abort, jsonify
from sqlalchemy import desc
from sqlalchemy.orm import joinedload
from ..models import db, Game, Player, Sale, Round
from flask_jwt_extended import jwt_required, current_user


bp = Blueprint('games', __name__, url_prefix='/games')


# bug was occuring using @jwt_required() in a before_request route when using methods other than
# 'GET'.
# function needs to be called within in each route passing in the current_user, game_id
# and other variables that need to be checked
def checkCredentials(current_user, game_id):
    """Checks that the requested records are in a game that the player is a user of"""

    game = Game.query.get_or_404(game_id)

    if game.user_id is not current_user.id:
        abort(401, 'You do not have access to these records')


@bp.route('/')
@jwt_required()
def get_games():
    """Retrieves all games in db"""
    # eager loads with players
    games = Game.query.filter_by(user_id=current_user.id)\
        .options(joinedload(Game.players)).order_by(desc(Game.id)).all()

    return [game.as_dict(players=True) for game in games]


@bp.route('/', methods=['POST'])
@jwt_required()
def create_game():

    """create a new game. Use JSON Encoded data"""

    data = request.json
    data['players'] = Player.query.filter(Player.id.in_(data['player_ids'])).all()

    if len(data['players']) <= 1:
        abort(400, 'A new game must contain at least 2 players')

    # checks that all players being added belong to current user
    [abort(401) for player in data['players'] if player.user != current_user]

    data.pop('player_ids')
    game = Game(**data)
    game.user = current_user
    db.session.add(game)

    for player in data['players']:
        new_round = Round(round=1, player=player, game=game)
        db.session.add(new_round)

    db.session.commit()
    return game.as_dict()


@bp.route('/<int:game_id>')
@jwt_required()
def load_game(game_id):
    game = Game.query.filter_by(user_id=current_user.id, id=game_id)\
        .options(joinedload(Game.players)).one_or_404()

    response = {
        'players': [player.as_dict() for player in game.players],
        'bank': {
            'start': game.bank_start,
            'reserve': 0 if game.bank_reserve is None else game.bank_reserve
        }
    }

    response['bank']['total'] = response['bank']['start'] + response['bank']['reserve']

    rounds = Round.query.filter_by(game_id=game_id).order_by(Round.id).all()
    response['rounds'] = [round.as_dict() for round in rounds]
    sales = Sale.query.join(Round).filter_by(game_id=game_id).all()
    response['sales'] = [sale.as_dict() for sale in sales]

    return response


@bp.route('/<int:game_id>', methods=['DELETE'])
@jwt_required()
def delete_game(game_id):
    game = Game.query.options(joinedload(Game.rounds))\
        .options(joinedload(Game.players)).options(joinedload(Game.sales)).get_or_404(game_id)

    if game.user_id != current_user.id:
        abort(401)

    status = {
        'deleted': False,
        'has_sales': True if len(game.sales) > 0 else False,
        'has_multiple_rounds': True if len(game.rounds) / len(game.players) > 1 else False,
        'game': game.as_dict()
    }

    # if query string contains confirm=true, then game and all associated rounds and sales
    # data will be deleted.
    if 'confirm' in request.args and request.args['confirm'] == 'true':
        db.session.delete(game)
        db.session.commit()
        status['deleted'] = True
        status['msg'] = 'Game has been deleted'
        return jsonify(status), 200

    require_confirm = True if True in [value for value in status.values()] else False

    if require_confirm:
        status['ready'] = False
        status['msg'] = (
            'This game has multiple rounds or sales data. Deleting this game would delete '
            + 'all of those records. This cannot be undone. '
            + 'Resend request with query string confirm=true '
            + 'if you are certain you want to proceed')

    else:
        status['ready'] = True
        status['msg'] = 'Game is ready for deletion. Resend with query string confirm=true'

    return jsonify(status), 202


@bp.route('/<int:game_id>/rounds')
@jwt_required()
def get_rounds(game_id):
    """Retrieves all round records for a given game_id"""
    checkCredentials(current_user, game_id)  # check that game_id belongs to user
    rounds = Round.query.filter_by(game_id=game_id).order_by(Round.id).all()
    return [round.as_dict() for round in rounds]


@bp.route('/<int:game_id>/rounds', methods=['POST'])
@jwt_required()
def add_round(game_id):
    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    # eager loads the game by id and joins with the players and rounds
    try:
        game = Game.query\
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
    prev_rounds = [round.as_dict(prev_round=True) for round in prev_rounds]

    # Goes throuh each previous round and copies them to next round num
    new_records = []
    for prev_round in prev_rounds:
        print(prev_round)
        prev_round['round'] = last_round + 1
        next_round = Round(**prev_round)
        new_records.append(next_round)

    db.session.add_all(new_records)
    db.session.commit()

    # if rounds were created return results
    if len(new_records) != 0:
        return [record.as_dict() for record in new_records]

    # otherwise, create a record for each player. This should not be needed as
    # starting rounds are created automatically

    # goes through each player and game and creates a record for them
    for player in game.players:
        new_round = Round(round=last_round + 1, player=player)

        # adds to the game record
        game.rounds.append(new_round)

    db.session.add_all(game.rounds)
    db.session.commit()

    # returns new round records as json
    records = [record.as_dict() for record in game.rounds]

    return records


@bp.route('/<int:game_id>/rounds/<int:round_id>', methods=['PATCH'])
@jwt_required()
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
    checkCredentials(current_user, game_id)  # check that game_id belongs to user

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
        'round': game_round.as_dict()
    }

    return_data['sales'] = [sale.as_dict() for sale in game_round.sales] \
        if sales_affected else False

    return return_data


@bp.route('/<int:game_id>/sales')
@jwt_required()
def get_sales(game_id):
    """Retrieves all sale records for a given game_id"""

    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    sales = Sale.query.join(Round).filter_by(game_id=game_id).all()
    return [sale.as_dict() for sale in sales]


@bp.route('/<int:game_id>/sales', methods=['POST'])
@jwt_required()
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

    checkCredentials(current_user, game_id)  # check that game_id belongs to user

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
    result['sale'] = sale.as_dict()
    result['round'] = game_round.as_dict()

    return result


@bp.route('/<int:game_id>/sales/<int:sale_id>', methods=['DELETE'])
@jwt_required()
def delete_sale(game_id, sale_id):
    """Deletes a sale by sale_id and returns the recalculated round record"""

    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    sale = Sale.query.get_or_404(
        sale_id,
        description=f'Sale could not be found with id {sale_id}'
    )  # check that the sale exists with the given id

    round_record = sale.round  # retrieves the round record associated with sale

    # aborts if game_id from params does not match game_id on round record
    if round_record.game_id != game_id:
        abort(400, 'Game id does not match')

    db.session.delete(sale)
    db.session.commit()

    return_record = round_record.as_dict()

    return return_record


@bp.route('/<int:game_id>/players')
@jwt_required()
def get_game_players(game_id):
    """Retrieves all sale records for a given game_id"""
    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    players = Game.query.get_or_404(game_id).players
    return [player.as_dict() for player in players]


@bp.route('/<int:game_id>/bank')
@jwt_required()
def get_bank(game_id):
    """Returns how much money is left in the bank for a supplied game"""

    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    # Retrives bank funds
    bank = Game.query.get_or_404(game_id)

    bank_info = {
        'start': bank.bank_start,
    }

    bank_info['reserve'] = 0 if bank.bank_reserve is None else bank.bank_reserve
    bank_info['total'] = bank_info['start'] + bank_info['reserve']

    return bank_info


@bp.route('/<int:game_id>/bank', methods=['PATCH'])
@jwt_required()
def edit_game(game_id):
    """create a new game. Use JSON Encoded data"""

    checkCredentials(current_user, game_id)  # check that game_id belongs to user

    data = request.json
    game = Game.query.get_or_404(game_id)
    game.bank_reserve = data['reserve']
    db.session.commit()
    return {
        'reserve': game.bank_reserve
    }
