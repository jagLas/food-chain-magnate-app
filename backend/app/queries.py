"""Contains queries and helper functions to help processes routes"""

from sqlalchemy.sql import functions as func
from sqlalchemy.sql.expression import true
from sqlalchemy import case, cast, Integer
from .models import db, Player, Round, Sale


# Case to calculate revenue from sales accounting for gardens
sales_case = case(
    (Sale.garden == true(), Round.unit_price * 2 * (Sale.burgers +
                                                    Sale.pizzas +
                                                    Sale.drinks)),
    else_=Round.unit_price * (Sale.burgers + Sale.pizzas + Sale.drinks)
)

# Case to calculate waitress income accounting for first waitress milestone
waitress_case = case(
    (Round.first_waitress == true(), Round.waitresses * 5),
    else_=Round.waitresses * 3
)

burger_bonus = case(
    (Round.first_burger == true(), Sale.burgers * 5),
    else_=0
)

pizza_bonus = case(
    (Round.first_pizza == true(), Sale.pizzas * 5),
    else_=0
)

drink_bonus = case(
    (Round.first_drink == true(), Sale.drinks * 5),
    else_=0
)


def result_to_dict(data):

    """Takes each key in a query result and returns it as a dictionary
    to send as JSON"""

    results = []
    if isinstance(data, list):
        for row in data:
            dictionary = {}
            for field in row._fields:
                dictionary[field] = row.__getattr__(field)
            results.append(dictionary)
    else:
        dictionary = {}
        for field in data._fields:
            dictionary[field] = data.__getattr__(field)
        results = dictionary

    return results


def house_sales_query(game_id):
    query = db.session.query(
        Round.game_id.label('game_id'),
        Sale.round_id.label('round_id'),
        Round.player_id.label('player_id'),
        sales_case.label('revenue'),
        burger_bonus.label('burger_bonus'),
        pizza_bonus.label('pizza_bonus'),
        drink_bonus.label('drink_bonus'),
    ).join(Round).filter(Round.game_id == game_id)

    return query
    pass


# Query for sum of sales for each round
def house_sales_sum_query(game_id):

    """Creates a query that returns the aggregate sum of sales to houses
       grouping by each round_id in a given game_id"""

    sales_query = db.session.query(
        Round.game_id.label('game_id'),
        Sale.round_id.label('round_id'),
        Round.player_id.label('player_id'),
        func.sum(sales_case).label('revenue'),
        func.sum(burger_bonus).label('burger_bonus'),
        func.sum(pizza_bonus).label('pizza_bonus'),
        func.sum(drink_bonus).label('drink_bonus'),
        (func.sum(sales_case).label('revenue') +
         func.sum(burger_bonus).label('burger_bonus') +
         func.sum(pizza_bonus).label('pizza_bonus') +
         func.sum(drink_bonus).label('drink_bonus')).label('sale_total')
    ).select_from(Round).filter_by(game_id=game_id).join(Sale).group_by(
        Round.game_id,
        Sale.round_id,
        Round.player_id
    )

    return sales_query


def round_info_query(game_id):

    """Creates a query that returns the rounds with waitress income and salary
     expenses for a given game_id"""

    round_query = db.session.query(
            Round.id.label('round_id'),
            Round.round.label('round'),
            Round.first_burger,
            Round.first_pizza,
            Round.first_drink,
            Round.first_waitress,
            Round.cfo,
            Round.player_id,
            Player.name.label('player_name'),
            Round.unit_price,
            Round.waitresses,
            waitress_case.label('waitress_income'),
            Round.salaries_paid,
            (Round.salaries_paid * 5).label('salaries_expense')
        ).filter_by(game_id=game_id).join(Player)

    return round_query


def round_total_sales(game_id):

    """Combines the round income queries and house sales queries"""

    round_subquery = round_info_query(game_id).subquery()
    sales_subquery = house_sales_sum_query(game_id).subquery()

    cfo_bonus_case = case(
        (round_subquery.c.cfo == true(), (sales_subquery.c.sale_total
         + round_subquery.c.waitress_income) * .5),
        else_=0
    )

    round_total_case = case(
        (round_subquery.c.cfo == true(), (sales_subquery.c.sale_total
         + round_subquery.c.waitress_income) * 1.5),
        else_=(sales_subquery.c.sale_total + round_subquery.c.waitress_income)
    )

    round_sales = db.session.query(
        round_subquery,
        sales_subquery.c.revenue,
        sales_subquery.c.burger_bonus,
        sales_subquery.c.pizza_bonus,
        sales_subquery.c.drink_bonus,
        (sales_subquery.c.sale_total
         + round_subquery.c.waitress_income).label('pre_cfo_total'),
        # cast used to round the cfo bonus to nearest whole
        cast(cfo_bonus_case, Integer).label('cfo_bonus'),
        # cast used to round the game round's total up to nearest whole
        cast(round_total_case, Integer).label('round_total')
        ).join(sales_subquery)

    return round_sales


def player_total_sales(game_id):

    """Query to sum each players sales together and provide
    a total between players"""

    round_subquery = round_total_sales(game_id).subquery()
    player_totals = db.session.query(
        # round_subquery.c.game_id,
        round_subquery.c.player_id,
        # round_subquery.c.player_name,
        func.sum(round_subquery.c.round_total).label('total_revenue'),
        func.sum(round_subquery.c.salaries_expense).label('total_expenses'),
        (func.sum(round_subquery.c.round_total) -
         func.sum(round_subquery.c.salaries_expense)).label('total_income'),
    ).group_by(func.rollup(
        # round_subquery.c.game_id,
        round_subquery.c.player_id,
        # round_subquery.c.player_name,
        )
    )

    return player_totals
