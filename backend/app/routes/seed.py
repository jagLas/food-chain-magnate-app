from flask import Blueprint, jsonify, request
from ..models import db, Game, Player, Round, Sale


bp = Blueprint('seed', __name__)


@bp.route('/seed-db')
def seed_db():

    player1 = Player(name='Gloria', password='password')
    player2 = Player(name='Jean', password='password')

    db.session.add(player1)
    db.session.add(player2)

    game = Game(bank_start=100, bank_reserve=150, players=[player1, player2])
    db.session.add(game)

    round1 = Round(game=game, round=1, player=player1, first_waitress=True,
                   waitresses=2)
    round2 = Round(game=game, round=1, player=player2, first_burger=True,
                   unit_price=9, waitresses=1)
    round3 = Round(game=game, round=2, player=player1, first_waitress=True,
                   waitresses=1)
    round4 = Round(game=game, round=2, player=player2, first_burger=True,
                   first_pizza=True, unit_price=9, waitresses=1)

    db.session.add(round1)
    db.session.add(round2)

    sale1 = Sale(round=round1, house_number=6, burgers=1, pizzas=2,
                 garden=True)
    sale5 = Sale(round=round1, house_number=3, burgers=2, drinks=1)
    sale2 = Sale(round=round2, house_number=5, pizzas=2, drinks=2)
    sale3 = Sale(round=round3, house_number=5, drinks=1)
    sale4 = Sale(round=round4, house_number=1, burgers=1)
    db.session.add_all([sale1, sale2, sale3, sale4, sale5])

    db.session.commit()
    return jsonify('Database successfully seeded')
