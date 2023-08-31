
from .models import db, Player, Round, Game, Sale
from sqlalchemy.sql import functions as func
from sqlalchemy import case

# Case to calculate revenue from sales accounting for gardens
sales_case = case(
    (Sale.garden == True, Round.unit_price * 2 * (Sale.burgers +
                                                    Sale.pizzas +
                                                    Sale.drinks)),
    else_=Round.unit_price * (Sale.burgers + Sale.pizzas + Sale.drinks)
)

# Case to calculate waitress income accounting for first waitress milestone
waitress_case = case(
    (Round.first_waitress == True, Round.waitresses * 5),
    else_=Round.waitresses * 3
)

burger_bonus = case(
    (Round.first_burger == True, Sale.burgers * 5),
    else_=0
)

pizza_bonus = case(
    (Round.first_pizza == True, Sale.pizzas * 5),
    else_=0
)

drink_bonus = case(
    (Round.first_drink == True, Sale.drinks * 5),
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
    ).select_from(Round).filter_by(game_id=game_id).join(Sale).group_by(
        Round.game_id,
        Sale.round_id,
        Round.player_id
    )

    return sales_query


# Query for waitress income and cfo bonus (needs to be added)
def round_info_query(game_id):
    round_query = db.session.query(
            (Round.game_id).label('game_id'),
            Round.id.label('round_id'),
            (Round.player_id).label('player_id'),
            (Player.name).label('player_name'),
            Round.cfo.label('cfo'),
            func.sum(waitress_case).label('waitress_income'),
        ) \
        .filter_by(game_id=game_id).join(Player)\
        .group_by(
            Round.game_id,
            Round.id,
            Round.player_id,
            Player.name,
            Round.cfo
        )

    return round_query


def round_total_sales(game_id):
    waitresses_subquery = round_info_query(game_id).subquery()
    sales_subquery = house_sales_sum_query(game_id).subquery()
    round_sales = db.session.query(
        waitresses_subquery.c.game_id,
        waitresses_subquery.c.round_id,
        waitresses_subquery.c.player_id,
        waitresses_subquery.c.player_name,
        waitresses_subquery.c.cfo,
        waitresses_subquery.c.waitress_income,
        sales_subquery.c.revenue,
        sales_subquery.c.burger_bonus,
        sales_subquery.c.pizza_bonus,
        sales_subquery.c.drink_bonus,
        (
            waitresses_subquery.c.waitress_income +
            sales_subquery.c.revenue +
            sales_subquery.c.burger_bonus +
            sales_subquery.c.pizza_bonus +
            sales_subquery.c.drink_bonus
        ).label('sub_total'),
        (
            (waitresses_subquery.c.waitress_income +
             sales_subquery.c.revenue +
             sales_subquery.c.burger_bonus +
             sales_subquery.c.pizza_bonus +
             sales_subquery.c.drink_bonus
             ) * 1.5
        ).label('round_total')
        ).join(sales_subquery)

    return round_sales


def player_total_sales(game_id):
    round_subquery = round_total_sales(game_id).subquery()
    player_totals = db.session.query(
        round_subquery.c.game_id,
        round_subquery.c.player_id,
        round_subquery.c.player_name,
        func.sum(round_subquery.c.round_total).label('total_income')
    ).group_by(
        round_subquery.c.game_id,
        round_subquery.c.player_id,
        round_subquery.c.player_name,
    )

    return player_totals