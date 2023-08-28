from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    rounds = db.relationship('Round', back_populates='player')


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    bank_start = db.Column(db.Integer, nullable=False)
    bank_reserve = db.Column(db.Integer)


class Round(db.Model):
    __tablename__ = 'rounds'

    id = db.Column(db.Integer, primary_key=True)
    round = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.String(50), db.ForeignKey('players.id'))
    first_burger = db.Column(db.Boolean)
    first_pizza = db.Column(db.Boolean)
    first_drink = db.Column(db.Boolean)
    first_waitress = db.Column(db.Boolean)
    cfo = db.Column(db.Boolean)
    unit_price = db.Column(db.Integer, default=10, nullable=False)
    waitresses = db.Column(db.Integer, default=0, nullable=False)
    salaries_paid = db.Column(db.Integer, default=0, nullable=False)

    # # for future development. Columns to auto calculate salary discount
    # first_to_train = db.Column(db.Boolean)
    # first_billboard = db.Column(db.Boolean)
    # unused_hr = db.Column(db.Integer, default=0, nullable=False)
    # marketers = db.Column(db.Integer, default=0, nullable=False)

    player = db.relationship('Player', back_populates='rounds')
