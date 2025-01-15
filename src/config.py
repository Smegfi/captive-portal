import os
from dotenv import load_dotenv
# from app.logger import set_logger

basedir = os.path.abspath(os.path.dirname(__file__))
# logger = set_logger(__name__)
loaded = load_dotenv()


class Config:
    ENV = os.getenv("CAPTIVEP10_ENVIRONMENT")
    PORT = os.getenv("CAPTIVEP10_PORT")
    HOST = os.getenv("CAPTIVEP10_HOST")
    API_TOKEN = os.getenv("CAPTIVEP10_API_TOKEN")
    API_URL = os.getenv("CAPTIVEP10_API_URL")
    DB_PATH = os.getenv("CAPTIVEP10_DB_PATH")
    LOG_PATH = os.getenv("CAPTIVEP10_LOG_PATH")
    LOGIN_PASS = str(os.getenv("CAPTIVEP10_LOGIN_PASS")).lower() == "true"

    # FLASK CONFIGURATION
    if not ENV:
        ENV = "dev"
    if not PORT:
        PORT = "5000"
    if not HOST:
        HOST = "0.0.0.0"
    if not DB_PATH:
        raise EnvironmentError(
            "Systémová proměnná CAPTIVEP10_DB_PATH nebyla nalezena.")
    if not API_URL:
        raise EnvironmentError(
            "Systémová proměnná CAPTIVEP10_API_URL nebyla nalezena.")
    if not API_TOKEN:
        raise EnvironmentError(
            "Systémová proměnná CAPTIVEP10_API_TOKEN nebyla nalezena.")

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
