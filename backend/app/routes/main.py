from flask import Blueprint, jsonify, request
from ..models import db, Game, Player, Round, Sale
from sqlalchemy.sql import functions as func
from sqlalchemy import case

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
    # rounds = Sale.query.join(Round).filter_by(game_id=id).all()
    # print(rounds)
    sales_case = case(
        (Sale.garden == True, Round.unit_price * 2 * (Sale.burgers +
                                                      Sale.pizzas +
                                                      Sale.drinks)),
        else_=Round.unit_price * (Sale.burgers + Sale.pizzas + Sale.drinks)
    )

    waitress_case = case(
        (Round.first_waitress == True, Round.waitresses * 5),
        else_= Round.waitresses * 3
    )

    sales_totals = db.session.query(
        (Round.game_id).label('game_id'),
        # (Sale.round_id).label('round_id'),
        # (Sale.garden).label('garden'),
        # func.sum(Sale.burgers).label('burger_total'),
        # func.sum(Sale.pizzas).label('pizza_total'),
        # func.sum(Sale.drinks).label('drink_total'),
        func.sum(sales_case.label('revenue')).label('revenue_total')
        ).select_from(Sale).join(Sale.round) \
        .group_by(Round.game_id).filter_by(game_id=id).all()

    waitress_totals = db.session.query(
        (Round.game_id).label('game_id'),
        func.sum(waitress_case.label('revenue')).label('revenue_total')
        ).group_by(Round.game_id).filter_by(game_id=id).all()

    print(sales_totals)
    print(waitress_totals)

    return 'bank route'


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
