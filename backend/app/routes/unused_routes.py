from flask import Blueprint
from ..models import db, Game, Player
from ..queries import player_total_sales, result_to_dict


bp = Blueprint('unused', __name__)


@bp.route('/games/<int:game_id>/player_totals')
def get_player_totals(game_id):

    """Returns the game_id, player_id,
    and total income for each player"""

    player_totals_sub = player_total_sales(game_id=game_id).subquery()
    player_totals = db.session.query(player_totals_sub, Player.name)\
        .outerjoin(Player).all()
    player_totals = result_to_dict(player_totals)

    # processing in the event that no rounds have been created
    if len(player_totals) == 1:
        players = Game.query.get(game_id).players
        # sorting by reverse puts them in alphabetical order when appended to
        # front
        players.sort(key=lambda x: x.name, reverse=True)
        for player in players:
            player_totals.insert(0, {
                'player_id': player.id,
                'total_revenue': 0,
                'total_expenses': 0,
                'total_income': 0,
                'name': player.name
            })

        player_totals[-1]['total_revenue'] = 0
        player_totals[-1]['total_expenses'] = 0
        player_totals[-1]['total_income'] = 0

    return player_totals
