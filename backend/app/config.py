import os


class Configuration:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_COOKIE_SECURE = os.environ.get('ENV') == 'Production'
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
