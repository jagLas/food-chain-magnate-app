from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..models import User



bp = Blueprint('session', __name__, url_prefix='/auth')


@bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email).one_or_none()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Wrong email or password"}), 401

    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)
