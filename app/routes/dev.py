from flask import Blueprint, jsonify
from ..models import db, Game, Player, Round, Sale, User


bp = Blueprint('seed', __name__, url_prefix='/dev')


@bp.route('/seed-db')
def seed_db():

    user1 = User(name='Bill', password='password', email='bill@demo.com')
    user2 = User(name='Mona', password='password', email='mona@demo.com')

    db.session.add_all([user1, user2])

    player1 = Player(name='Gloria', user=user1)
    player2 = Player(name='Jean', user=user1)
    player3 = Player(name='Stefan', user=user2)
    player4 = Player(name='Greg', user=user2)

    db.session.add_all([player1, player2, player3, player4])

    game = Game(bank_start=200, bank_reserve=100, players=[player1, player2], user=user1)
    game2 = Game(bank_start=200, players=[player3, player4], user=user2)
    db.session.add_all([game, game2])

    round1 = Round(game=game, round=1, player=player1, first_waitress=True,
                   waitresses=2, first_drink=True, cfo=True, salaries_paid=2)

    round2 = Round(game=game, round=1, player=player2, first_burger=True,
                   unit_price=9, waitresses=1, salaries_paid=1)

    round3 = Round(game=game, round=2, player=player1, first_waitress=True,
                   waitresses=1, first_drink=True, cfo=True)

    round4 = Round(game=game, round=2, player=player2, first_burger=True,
                   first_pizza=True, unit_price=9, waitresses=1, cfo=True,
                   salaries_paid=3)

    db.session.add(round1)
    db.session.add(round2)

    sale1 = Sale(round=round1, house_number=6, burgers=1, pizzas=2,
                 garden=True)
    sale5 = Sale(round=round1, house_number=3, burgers=2, drinks=1)
    sale2 = Sale(round=round2, house_number=5, pizzas=2, drinks=2)
    sale3 = Sale(round=round3, house_number=5, drinks=2)
    sale4 = Sale(round=round4, house_number=1, burgers=1, drinks=1, pizzas=3)
    db.session.add_all([sale1, sale2, sale3, sale4, sale5])

    db.session.commit()
    return jsonify('Database successfully seeded')
