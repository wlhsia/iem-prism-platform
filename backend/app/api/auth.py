from flask import request, jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
import bcrypt
from datetime import datetime, timedelta, timezone

from . import api
from ..models import Users
from ..schemas import user_schema

@api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

@api.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    password = password.encode('utf-8')
    user = Users.query.filter(Users.Username == username).first()
    if not bcrypt.checkpw(password, user.HashedPassword):
        return jsonify({"msg": "Bad username or password"}), 401

    response = jsonify({"msg": "login successful"})
    access_token = create_access_token(identity=username)
    set_access_cookies(response, access_token)
    return response

@api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@api.route("/user", methods=["GET"])
@jwt_required()
def user():
    username = get_jwt_identity()
    user = Users.query.filter(Users.Username==username).first()
    user = user_schema.dump(user)
    return user

