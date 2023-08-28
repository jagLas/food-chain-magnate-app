from dotenv import load_dotenv
load_dotenv()

from app import app, db
from app.models import Game


with app.app_context():
    game = Game(bank_start=100, bank_reserve=150)
    db.session.add(game)
    db.session.commit()
