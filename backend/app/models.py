from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import functions as func
from sqlalchemy.sql.expression import true
from sqlalchemy import case

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

    rounds = db.relationship('Round', back_populates='game')

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
    game = db.relationship('Game', back_populates='rounds')

    def as_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'round': self.round,
            'player_id': self.player_id,
            'first_burger': self.first_burger,
            'first_pizza': self.first_pizza,
            'first_drink': self.first_drink,
            'first_waitress': self.first_waitress,
            'cfo': self.cfo,
            'unit_price': self.unit_price,
            'waitresses': self.waitresses,
            'salaries_paid': self.salaries_paid,
            'sales': [sale.as_dict() for sale in self.sales]
        }

    def get_totals(self):

        """Returns itself as_dict but appends total sales"""

        base_data = self.as_dict()

        query_case = case(
            (Sale.garden == true(), self.unit_price * 2 *
             (Sale.burgers + Sale.pizzas + Sale.drinks)),
            else_=self.unit_price * (Sale.burgers + Sale.pizzas + Sale.drinks)
        )

        totals = db.session.query(
            (Round.game_id).label('game_id'),
            (Sale.round_id).label('round_id'),
            (Sale.garden).label('garden'),
            func.sum(Sale.burgers).label('burger_total'),
            func.sum(Sale.pizzas).label('pizza_total'),
            func.sum(Sale.drinks).label('drink_total'),
            func.sum(query_case.label('revenue')).label('revenue_total')
            ) \
            .group_by(Sale.round_id, Round.game_id, Sale.garden).join(Round).\
            filter_by(id=self.id).all()

        base_data['totals'] = {
            'total': {
                'burgers': 0,
                'pizzas': 0,
                'drinks': 0,
                'revenue': 0
            }
        }

        # Separates totals into those with and those without gardens
        for total in totals:
            if total.garden is True:
                base_data['totals']['garden'] = {
                    'burgers': total.burger_total,
                    'pizzas': total.pizza_total,
                    'drinks': total.drink_total,
                    'revenue': total.revenue_total
                }
            else:
                base_data['totals']['plain'] = {
                    'burgers': total.burger_total,
                    'pizzas': total.pizza_total,
                    'drinks': total.drink_total,
                    'revenue': total.revenue_total
                }
            # creates combined total for garden and non-garden sales
            base_data['totals']['total']['burgers'] += total.burger_total
            base_data['totals']['total']['pizzas'] += total.pizza_total
            base_data['totals']['total']['drinks'] += total.drink_total
            base_data['totals']['total']['revenue'] += total.revenue_total

        return base_data


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

    def as_dict(self):
        return {
            'sale_id': self.id,
            'house_number': self.house_number,
            'garden': self.garden,
            'burgers': self.burgers,
            'pizzas': self.pizzas,
            'drinks': self.drinks,
        }
