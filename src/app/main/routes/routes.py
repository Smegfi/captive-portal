import uuid
from flask import render_template, request
from app.main import bp
from app.logger import set_logger
from app.main.api.user import post_user
from datetime import datetime, timedelta
from app.main.repositories.modal import parse_form, parse_args
import requests as req
from config import Config

logger = set_logger(__name__)

@bp.route('/create-user')
def users():
    email = request.args.get("email")
    mac = request.args.get("mac")
    password = str(uuid.uuid4())

    date =  datetime.now() + timedelta(days=30)
    expire = str(date).removesuffix(f".{date.microsecond}")

    data={
        "user-id": email,
        "email": email,
        "password": password,
        "expiration": expire,
        "comment": mac
    }
    result = req.post(Config.API_URL, json=data, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
    logger.info(result.json())
    return result.json()