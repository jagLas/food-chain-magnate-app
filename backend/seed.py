from dotenv import load_dotenv
load_dotenv()

from app import app, db
from app.models import Game, Player, Round


with app.app_context():

    game = Game(bank_start=100, bank_reserve=150)
    db.session.add(game)

    player1 = Player(name='Gloria', password='password')
    player2 = Player(name='Jean', password='password')

    db.session.add(player1)
    db.session.add(player2)

    round1 = Round(game=game, round=1, player=player1)
    round2 = Round(game=game, round=1, player=player2, first_burger=True,
                   unit_price=9)

    db.session.add(round1)
    db.session.add(round2)
    db.session.commit()
