from flask import Flask
from config import Config
from app.extensions import db
import os
from app.logger import set_logger

logger = set_logger(__name__)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # Register blueprints here
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)
    # Initialize Flask extensions here
    db.init_app(app)
    check_db(Config.DB_PATH, app)
    return app

def check_db(db_path, flask_app: Flask):
    if not os.path.exists(db_path):
        logger.error(f"Databáze nebyla nalezena na cestě:\t{db_path}")
        logger.info(f"Vytvářím databázi:\t{db_path}")
        f = open(f"{db_path}", "x")
        f.close()
    with flask_app.app_context():
            db.create_all()