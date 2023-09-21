from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from ..models import User


bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email).one_or_none()
    if not user or not user.check_password(password):
        return jsonify({"code": 401, "msg": "Wrong email or password"}), 401

    access_token = create_access_token(identity=user)
    response = jsonify({"msg": "login successful"})
    set_access_cookies(response, access_token)

    return response


@bp.route("/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response
