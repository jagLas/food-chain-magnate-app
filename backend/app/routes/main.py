from flask import Blueprint, jsonify, request
from ..models import db, Game, Player, Round, Sale
from sqlalchemy.sql import functions as func
from sqlalchemy import case, and_, select

bp = Blueprint('main', __name__)


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


@bp.route('/games/<int:id>/bank')
def get_bank(id):

    # Case to calculate revenue from sales accounting for gardens
    sales_case = case(
        (Sale.garden == True, Round.unit_price * 2 * (Sale.burgers +
                                                      Sale.pizzas +
                                                      Sale.drinks)),
        else_=Round.unit_price * (Sale.burgers + Sale.pizzas + Sale.drinks)
    )

    # Case to calculate waitress income accounting for first waitress milestone
    waitress_case = case(
        (Round.first_waitress == True, Round.waitresses * 5),
        else_=Round.waitresses * 3
    )

    # Subquery to that will be used to combine waitress income with sales
    waitresses_subquery = db.session.query(
            (Round.game_id).label('game_id'),
            (Round.id).label('round_id'),
            func.sum(waitress_case).label('waitresses')
        ).filter_by(game_id=id).group_by(Round.game_id, Round.id).subquery()

    # Query for necessary info to make calculations
    rounds = db.session.query(
            (Round.game_id).label('game_id'),
            (Sale.round_id).label('round_id'),
            Round.first_burger,
            Round.first_pizza,
            Round.first_drink,
            func.sum(Sale.burgers).label('burgers'),
            func.sum(Sale.pizzas).label('pizzas'),
            func.sum(Sale.drinks).label('drinks'),
            func.sum(sales_case).label('sales'),
            waitresses_subquery.c.waitresses
        ).select_from(Sale).join(Round).group_by(
            Round.game_id,
            Sale.round_id,
            Round.first_burger,
            Round.first_pizza,
            Round.first_drink,
            waitresses_subquery.c.waitresses
        ).filter_by(game_id=id)\
        .join(
            waitresses_subquery,
            Sale.round_id == waitresses_subquery.c.round_id
        ).all()

    # helper function to calculate "first" milestone bonuses
    def calc_milestone_bonus(obj):
        total = 0
        if obj.first_burger is True:
            total += obj.burgers * 5
        if obj.first_pizza is True:
            total += obj.pizzas * 5
        if obj.first_drink is True:
            total += obj.drinks * 5
        return total

    # turn into dict to return as json
    round_info = [{
        'game_id': round.game_id,
        'round_id': round.round_id,
        'first_burger': round.first_burger,
        'first_pizza': round.first_pizza,
        'first_drink': round.first_drink,
        'sales': round.sales,
        'burgers': round.burgers,
        'pizzas': round.pizzas,
        'drinks': round.drinks,
        'waitresses': round.waitresses,
        'milestone_bonus': calc_milestone_bonus(round)
    } for round in rounds]

    return round_info


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
