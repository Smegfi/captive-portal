import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv()

USERNAME=os.getenv("USERNAME")
PASSWORD=os.getenv("PASSWORD")

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or "postgresql://postgres:123456Ab@10.41.172.109:5432/captive-portal"
    SQLALCHEMY_TRACK_MODIFICATIONS = False