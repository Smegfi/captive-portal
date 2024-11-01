import uuid
from flask import request
from app.main import bp
from app.logger import set_logger
from datetime import datetime, timedelta
import requests as req
from config import Config
from app.main.models import User, Session, Device
from app.extensions import db

logger = set_logger(__name__)

@bp.route('/api/create-user')
def create_user():
    email = request.args.get("email")
    usermac = request.args.get("usermac")
    marketing = request.args.get("marketing")
    ssid = request.args.get("ssid")
    password = str(uuid.uuid4())

    date =  datetime.now() + timedelta(days=30)
    expire = str(date).removesuffix(f".{date.microsecond}")

    usr = User(Id=password, Email=email, Password=password, MarketingApproved=True if marketing == "true" else False, LastLogin=datetime.now(), CreatedAt=datetime.now())
    session = Device(Id=str(uuid.uuid4()), UserId=password, MacAddress=usermac, ConnectedNetwork=ssid, LastConnection=datetime.now())
    db.session.add(usr)
    db.session.add(session)
    db.session.commit()
    ## JSON body 
    data={
        "user-id": email,
        "email": email,
        "password": password,
        "expiration": expire,
        "comment": usermac
    }

    ## POST request to Forti (create guest user) ##
    result = req.post(Config.API_URL, json=data, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
    logger.info(result.json())

    if result.status_code == 200:
        returner = {
            "username": email,
            "password": password,
            "statusCode": 200
        }

        return returner
    else:
        returner = {
            "username": "failed",
            "password": "failed",
            "statusCode": 500
        }
        return returner
