from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import case, select, cast, Integer
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy.sql import functions as func
from sqlalchemy.sql.expression import true
from werkzeug.security import generate_password_hash, check_password_hash
import math

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    players = db.relationship('Player', back_populates='user')
    games = db.relationship('Game', back_populates='user')

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError('Not a valid email')
        return email

    @validates('name')
    def validate_name(self, key, name):
        if len(name) < 1:
            raise ValueError('Name cannot be blank')
        return name

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }


game_player = db.Table(
    'GamePlayer',
    db.Column('game_id', db.ForeignKey("games.id"), primary_key=True),
    db.Column('player_id', db.ForeignKey("players.id"), primary_key=True)
)


class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    @validates('name')
    def validate_name(self, key, name):
        if len(name) < 1:
            raise ValueError('Name cannot be blank')
        return name

    db.UniqueConstraint(name, user_id, name='unique_player')

    rounds = db.relationship('Round', back_populates='player')
    games = db.relationship("Game",
                            secondary=game_player,
                            back_populates="players")
    user = db.relationship('User', back_populates='players')

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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    players = db.relationship("Player",
                              secondary=game_player,
                              back_populates="games")

    rounds = db.relationship('Round', back_populates='game', cascade="all")
    user = db.relationship('User', back_populates='games')
    sales = db.relationship('Sale', secondary='rounds', viewonly=True)

    def as_dict(self, **kwargs):
        dictionary = {
            'id': self.id,
            'bank_start': self.bank_start,
            'bank_reserve': self.bank_reserve,
        }

        # option to add player information to the returned dictionary
        if 'players' in kwargs and kwargs['players']:
            dictionary['players'] = [player.as_dict() for player in self.players]

        # option to add rounds information to the returned dictionary
        if 'rounds' in kwargs and kwargs['rounds']:
            dictionary['rounds'] = [round.as_dict() for round in self.rounds]

        # option to add number of rounds to dictionary
        if 'rounds' in dictionary and 'players' in dictionary:
            dictionary['number_rounds'] = int(len(dictionary['rounds']) /
                                              len(dictionary['players']))

        return dictionary


class Round(db.Model):
    __tablename__ = 'rounds'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    round = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    first_burger = db.Column(db.Boolean, default=False)
    first_pizza = db.Column(db.Boolean, default=False)
    first_drink = db.Column(db.Boolean, default=False)
    first_waitress = db.Column(db.Boolean, default=False)
    cfo = db.Column(db.Boolean, default=False)
    unit_price = db.Column(db.Integer, default=10, nullable=False)
    waitresses = db.Column(db.Integer, default=0, nullable=False)
    salaries_paid = db.Column(db.Integer, default=0, nullable=False)

    player = db.relationship('Player', back_populates='rounds', lazy='joined')
    sales = db.relationship('Sale', back_populates='round', cascade="all", lazy='joined')
    game = db.relationship('Game', back_populates='rounds')

    @hybrid_property
    def waitress_income(self):
        return self.waitresses * 5 if self.first_waitress else self.waitresses * 3

    @waitress_income.inplace.expression
    def _waitress_income_expression(cls):
        return case(
                (cls.first_waitress == true(), cls.waitresses * 5),
                else_=cls.waitresses * 3
                )

    @hybrid_property
    def total_sales(self):
        return sum([sale.sale_total for sale in self.sales])

    @total_sales.inplace.expression
    def _total_sales_expression(cls):
        return func.coalesce(select(func.sum(Sale.sale_total)).where(Sale.round_id == cls.id), 0)

    @hybrid_property
    def pre_cfo_total(self):
        return self.waitress_income + self.total_sales

    @hybrid_property
    def cfo_bonus(self):
        return math.ceil(self.pre_cfo_total * .5) if self.cfo else 0

    @cfo_bonus.inplace.expression
    def _cfo_bonus_expression(cls):
        return cast(
            case(
                (cls.cfo == true(),
                 (cls.pre_cfo_total * .5)),
                else_=0
            ), Integer)

    @hybrid_property
    def total_revenue(self):
        return self.pre_cfo_total + self.cfo_bonus

    @hybrid_property
    def salaries_expense(self):
        return self.salaries_paid * 5

    @hybrid_property
    def income(self):
        return self.total_revenue - self.salaries_expense

    # TODO player_name. salaries_expense, burger, pizza, and drink bonus
    def as_dict(self, **kwargs):
        if 'prev_round' in kwargs and kwargs['prev_round']:
            return {
                'game_id': self.game_id,
                'player_id': self.player_id,
                'round': self.round,
                'first_burger': self.first_burger,
                'first_pizza': self.first_pizza,
                'first_drink': self.first_drink,
                'first_waitress': self.first_waitress,
                'cfo': self.cfo,
            }

        return {
            'game_id': self.game_id,
            'round_id': self.id,
            'player_id': self.player_id,
            'player_name': self.player.name,
            'round': self.round,
            'first_burger': self.first_burger,
            'first_pizza': self.first_pizza,
            'first_drink': self.first_drink,
            'first_waitress': self.first_waitress,
            'cfo': self.cfo,
            'unit_price': self.unit_price,
            'waitresses': self.waitresses,
            'salaries_paid': self.salaries_paid,
            'waitress_income': self.waitress_income,
            'sale_total': self.total_sales,
            'pre_cfo_total': self.pre_cfo_total,
            'cfo_bonus': self.cfo_bonus,
            'round_total': self.total_revenue,
            'salaries_expense': self.salaries_expense,
            'round_income': self.income,
            # 'sales': [sale.as_dict() for sale in self.sales],
        }


class Sale(db.Model):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    round_id = db.Column(db.Integer, db.ForeignKey('rounds.id'), nullable=False)
    house_number = db.Column(db.Integer)
    garden = db.Column(db.Boolean, default=False)
    burgers = db.Column(db.Integer, default=0, nullable=False)
    pizzas = db.Column(db.Integer, default=0, nullable=False)
    drinks = db.Column(db.Integer, default=0, nullable=False)

    @hybrid_property
    def total_product(self):
        return self.burgers + self.pizzas + self.drinks

    @hybrid_property
    def base_revenue(self):
        return self.total_product * self.round.unit_price

    @base_revenue.inplace.expression
    def _base_revenue_expression(cls):
        return (cls.total_product * select(Round.unit_price).where(cls.round_id == Round.id))

    @hybrid_property
    def garden_bonus(self):
        return self.base_revenue if self.garden else 0

    @garden_bonus.inplace.expression
    def _garden_bonus_expression(cls):
        # print(cls)
        return case(
                (cls.garden == true(),
                 select(Round.unit_price).where(cls.round_id == Round.id) * cls.total_product),
                else_=0)

    @hybrid_property
    def burger_bonus(self):
        return self.burgers * 5 if self.round.first_burger else 0

    @burger_bonus.inplace.expression
    def _burger_bonus_expression(cls):
        return case(
                (select(Round.first_burger).where(cls.round_id == Round.id) == true(),
                 cls.burgers * 5),
                else_=0
                )

    @hybrid_property
    def pizza_bonus(self):
        return self.pizzas * 5 if self.round.first_pizza else 0

    @pizza_bonus.inplace.expression
    def _pizza_bonus_expression(cls):
        return case(
                (select(Round.first_pizza).where(cls.round_id == Round.id) == true(),
                 cls.pizzas * 5),
                else_=0
                )

    @hybrid_property
    def drink_bonus(self):
        return self.drinks * 5 if self.round.first_drink else 0

    @drink_bonus.inplace.expression
    def _drink_bonus_expression(cls):
        return case(
                (select(Round.first_drink).where(cls.round_id == Round.id) == true(),
                 cls.drinks * 5),
                else_=0
                )

    @hybrid_property
    def sale_total(self):
        return self.base_revenue + self.garden_bonus + self.burger_bonus + self.pizza_bonus \
            + self.drink_bonus

    round = db.relationship('Round', back_populates='sales', lazy='joined')
    game = db.relationship('Game', secondary='rounds', viewonly=True)

    def as_dict(self):
        return {
            'sale_id': self.id,
            'player_id': self.round.player_id,
            'round_id': self.round_id,
            'round': self.round.round,
            'house_number': self.house_number,
            'garden': self.garden,
            'burgers': self.burgers,
            'pizzas': self.pizzas,
            'drinks': self.drinks,
            'total_product': self.total_product,
            'unit_price': self.round.unit_price,
            'base_revenue': self.base_revenue,
            'garden_bonus': self.garden_bonus,
            'burger_bonus': self.burger_bonus,
            'pizza_bonus': self.pizza_bonus,
            'drink_bonus': self.drink_bonus,
            'sale_total': self.sale_total
        }
