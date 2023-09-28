import os
import datetime

conn_str = os.environ.get('AZURE_POSTGRESQL_CONNECTIONSTRING')
DATABASE_URI = None

if conn_str:
    conn_str_params = {pair.split('=')[0]: pair.split('=')[1] for pair in conn_str.split(' ')}

    DATABASE_URI = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}/{dbname}'.format(
        dbuser=conn_str_params['user'],
        dbpass=conn_str_params['password'],
        dbhost=conn_str_params['host'],
        dbname=conn_str_params['dbname']
    )


class Configuration:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = DATABASE_URI if DATABASE_URI else os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY')
    # JWT_COOKIE_SECURE = os.environ.get('ENV') == 'Production'
    JWT_COOKIE_SECURE = True  # might cause issues in development. We'll find out.
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_ERROR_MESSAGE_KEY = 'description'
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(weeks=1)
    JWT_SESSION_COOKIE = False
