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
    ENV=os.getenv("ENVIRONMENT")
    PORT=os.getenv("PORT")

    USERNAME=os.getenv("USERNAME")
    PASSWORD=os.getenv("PASSWORD")
    
    API_TOKEN=os.getenv("API_TOKEN")
    API_URL=os.getenv("API_URL")
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False