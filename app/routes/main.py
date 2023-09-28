"""Blueprint for game api routes"""

from flask import Blueprint, render_template
from ..routes import api


bp = Blueprint('main', __name__)
bp.register_blueprint(api.bp)


@bp.route('/')
def index():
    """Index route to serve react app"""

    return render_template('index.html')
