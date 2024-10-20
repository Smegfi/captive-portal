import os
from dotenv import load_dotenv
from app.logger import set_logger

basedir = os.path.abspath(os.path.dirname(__file__))
logger = set_logger(__name__)
loaded = load_dotenv()

if loaded:
    logger.info(".env loaded")
else:
    logger.warning(".env not found")


class Config:
    ENV = os.getenv("CAPTIVEP10_ENVIRONMENT")
    PORT = os.getenv("CAPTIVEP10_PORT")
    HOST = os.getenv("CAPTIVEP10_HOST")

    API_TOKEN = os.getenv("CAPTIVEP10_API_TOKEN")
    API_URL = os.getenv("CAPTIVEP10_API_URL")
    DB_PATH = os.getenv("CAPTIVEP10_DB_PATH")

    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False