from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_apscheduler import APScheduler
from dotenv import load_dotenv

from config import Config


db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
scheduler = APScheduler()

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    scheduler.init_app(app)

    from . import tasks
    scheduler.start()

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')


    return app