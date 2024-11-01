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

    if not check_if_exists(email):
        usr = User(Id=password, Email=email, Password=password, MarketingApproved=True if marketing == "true" else False, LastLogin=datetime.now(), CreatedAt=datetime.now())
        session = Device(Id=str(uuid.uuid4()), UserId=password, MacAddress=usermac, ConnectedNetwork=ssid, LastConnection=datetime.now())
        db.session.add(usr)
        db.session.add(session)
        db.session.commit()
    else:
        user = User.query.filter_by(Email=email).first()
        print(f"Users password set {user.Password}")
        password = user.Password
    ## JSON body 
    data={
        "user-id": email,
        "email": email,
        "password": password,
        "expiration": expire,
        "comment": usermac
    }
    try:
        result = req.post(Config.API_URL, json=data, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
        if result.status_code == 200:
            return {
                "username": email,
                "password": password,
                "statusCode": 200
            }
        else:
            return {
                "username": "failed",
                "password": "failed",
                "statusCode": 500
            }
    except:
        logger.error("Chyba při voláni FORTIGATE")
        return {
                "username": "failed",
                "password": "failed",
                "statusCode": 500
            }

def check_if_exists(email: str):
    users = User.query.filter_by(Email=email).all()
    for user in users:
        if user.Email == email:
            print("User found in DB")
            return True
    return False