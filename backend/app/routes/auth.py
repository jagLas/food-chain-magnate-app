from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from sqlalchemy.exc import IntegrityError
from ..models import User
from ..models import db


bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user = User(**data)
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(409, 'This email is already associated with an account')
    access_token = create_access_token(identity=user)
    response = jsonify({'code': 201, "description": 'User Created'})
    set_access_cookies(response, access_token)
    return response


@bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    user = User.query.filter_by(email=email).one_or_none()
    if not user or not user.check_password(password):
        return jsonify({"code": 401, "description": "Wrong email or password"}), 401

    access_token = create_access_token(identity=user)
    response = jsonify({"code": 200, "description": "login successful"})
    set_access_cookies(response, access_token)
    return response


@bp.route("/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify({"description": "logout successful"})
    unset_jwt_cookies(response)
    return response
