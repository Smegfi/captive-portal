# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy_utils import database_exists
# from sqlalchemy import func, exc

# db = SQLAlchemy()

# host="10.41.172.109"
# port="5432"
# database="captive-portal"
# user="postgres"
# password="123456Ab"


# def app_obj(app):
#     db_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"
#     app.config["SQLALCHEMY_DATABASE_URI"] = db_url
#     db.init_app(app)

#     if database_exists(db_url):
#         print(f"{database} already exists")
#     else:
#         print(f"{database} does not exist, will create {database}")
#         # this is needed in order for database session calls (e.g. db.session.commit)
#         with app.app_context():
#             try:
#                 db.create_all()
#             except exc.SQLAlchemyError as sqlalchemyerror:
#                 print(f"got the following SQLAlchemyError: {sqlalchemyerror}")
#             except Exception as exception:
#                 print(f"got the following Exception: {exception}")
#             finally:
#                 print(f"db.create_all() in __init__.py was successfull - no exceptions were raised")

#     return app

from flask import Flask

from app.extensions import db
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)

    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app