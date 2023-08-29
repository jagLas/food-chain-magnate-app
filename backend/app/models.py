from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


game_player = db.Table(
    'GamePlayer',
    db.Column('game_id', db.ForeignKey("games.id"), primary_key=True),
    db.Column('player_id', db.ForeignKey("players.id"), primary_key=True)
)


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
    games = db.relationship("Game",
                            secondary=game_player,
                            back_populates="players")

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }


class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    bank_start = db.Column(db.Integer, nullable=False)
    bank_reserve = db.Column(db.Integer)

    players = db.relationship("Player",
                              secondary=game_player,
                              back_populates="games")

    def as_dict(self):
        return {
            'id': self.id,
            'bank_start': self.bank_start,
            'bank_reserve': self.bank_reserve,
            'players': [player.as_dict() for player in self.players]
        }


class Round(db.Model):
    __tablename__ = 'rounds'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    round = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
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
    sales = db.relationship('Sale', back_populates='round')


class Sale(db.Model):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    round_id = db.Column(db.Integer, db.ForeignKey('rounds.id'))
    house_number = db.Column(db.Integer)
    garden = db.Column(db.Boolean)
    burgers = db.Column(db.Integer, default=0, nullable=False)
    pizzas = db.Column(db.Integer, default=0, nullable=False)
    drinks = db.Column(db.Integer, default=0, nullable=False)

    round = db.relationship('Round', back_populates='sales')
