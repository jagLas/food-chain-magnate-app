from flask import Blueprint, jsonify, request
from ..models import db, Game, Player, Round, Sale
from sqlalchemy.sql import functions as func
from sqlalchemy import case
from math import ceil

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

    burger_bonus = case(
        (Round.first_burger == True, Sale.burgers * 5),
        else_=0
    )

    pizza_bonus = case(
        (Round.first_pizza == True, Sale.pizzas * 5),
        else_=0
    )

    drink_bonus = case(
        (Round.first_drink == True, Sale.drinks * 5),
        else_=0
    )

    # Subquery to that will be used to combine waitress income with sales
    waitresses_subquery = db.session.query(
            (Round.game_id).label('game_id'),
            (Round.id).label('round_id'),
            func.sum(waitress_case).label('waitress_income')
        ).filter_by(game_id=id).group_by(Round.game_id, Round.id).subquery()

    # Query for necessary info to make calculations
    rounds = db.session.query(
            (Round.game_id).label('game_id'),
            (Sale.round_id).label('round_id'),
            Round.first_burger,
            Round.first_pizza,
            Round.first_drink,
            Round.first_waitress,
            Round.waitresses,
            Round.salaries_paid,
            func.sum(Sale.burgers).label('burgers'),
            func.sum(Sale.pizzas).label('pizzas'),
            func.sum(Sale.drinks).label('drinks'),
            func.sum(sales_case).label('sales'),
            func.sum(burger_bonus).label('burger_bonus'),
            func.sum(pizza_bonus).label('pizza_bonus'),
            func.sum(drink_bonus).label('drink_bonus'),
            waitresses_subquery.c.waitress_income,
            (
                func.sum(sales_case).label('sales') +
                func.sum(burger_bonus) +
                func.sum(pizza_bonus) +
                func.sum(drink_bonus) +
                waitresses_subquery.c.waitress_income
            ).label('revenue')
        ).select_from(Sale).join(Round).group_by(
            Round.game_id,
            Sale.round_id,
            Round.first_burger,
            Round.first_pizza,
            Round.first_drink,
            Round.first_waitress,
            Round.waitresses,
            Round.salaries_paid,
            waitresses_subquery.c.waitress_income
        ).filter_by(game_id=id)\
        .join(
            waitresses_subquery,
            Sale.round_id == waitresses_subquery.c.round_id
        ).all()

    def calculate_cfo_bonus(revenue):
        revenue = ceil(revenue * .5)
        return revenue

    # turn into dict to return as json
    round_info = [{
        'milestones': {
            'first_burger': round.first_burger,
            'first_pizza': round.first_pizza,
            'first_drink': round.first_drink,
            'first_waitress': round.first_waitress
        },
        'income_details': {
            'base_sales': round.sales,
            'burger_bonus': round.burger_bonus,
            'pizza_bonus': round.pizza_bonus,
            'drink_bonus': round.drink_bonus,
            'waitress_income': round.waitress_income,
            'cfo_bonus': calculate_cfo_bonus(round.revenue),
            'pre_cfo_total': round.revenue,
            'revenue': calculate_cfo_bonus(round.revenue) + round.revenue,
            'salary_expense': round.salaries_paid * -5
        },
        'Qty': {
            'burgers': round.burgers,
            'pizzas': round.pizzas,
            'drinks': round.drinks,
            'waitresses': round.waitresses,
            'salaries_paid': round.salaries_paid
        },
        'income': (calculate_cfo_bonus(round.revenue) + round.revenue +
                   round.salaries_paid * -5),
        'game_id': round.game_id,
        'round_id': round.round_id,

    } for round in rounds]

    bank_total = db.session.query(Game.bank_reserve + Game.bank_start)\
        .first()[0]
    for info in round_info:
        bank_total -= info['income']

    return jsonify(bank_total)


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
