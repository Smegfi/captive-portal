from flask import Blueprint

bp = Blueprint('main', __name__)

from app.main.routes import health
from app.main.routes import index

from app.main.routes.api import test
from app.main.routes.api import user