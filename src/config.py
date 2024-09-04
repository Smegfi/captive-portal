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

    USERNAME = os.getenv("CAPTIVEP10_USERNAME")
    PASSWORD = os.getenv("CAPTIVEP10_PASSWORD")

    SECRET_KEY = os.getenv('CAPTIVEP10_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('CAPTIVEP10_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
