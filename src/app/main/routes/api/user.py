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

    date = datetime.now() + timedelta(days=30)
    expire = str(date).removesuffix(f".{date.microsecond}")

    usr = User(Id=password, Email=email, Password=password, MarketingApproved=True if marketing ==
               "true" else False, LastLogin=datetime.now(), CreatedAt=datetime.now())
    session = Device(Id=str(uuid.uuid4()), UserId=password, MacAddress=usermac,
                     ConnectedNetwork=ssid, LastConnection=datetime.now())

    staticUserEmail = "central-guest@fortigate-p10.cz"
    staticUserPassword = "ccKZ52B5HXAh"

    try:
        # Najdeme uživatele v DB pokud neexisutje vyhodí se Error
        filteredUser = db.session.execute(
            db.select(User).filter_by(Email=email)).scalar_one()

        # Pokud uživatel existuje tak zkontrolujeme zda není nastavený login pass, případně zašleme staticky nastavený účet
        if Config.LOGIN_PASS:
            return return_value(200, "LOGIN_PASS Zapnutý - používám statické hodnoty", username=staticUserEmail, password=staticUserPassword)

        print(f"{filteredUser.Id} {filteredUser.Email}")

        return return_value(200, "Uživatel byl úspěšně načtený s databáze.", username=filteredUser.Email, password=filteredUser.Password)

    except:
        # Pokud uživatel v DB neexistuje program pokračuje zde
        # Vytvoříme nejdříve uživatele a k němu poté session
        db.session.add(usr)
        db.session.add(session)
        db.session.commit()

        # Pokud je nastavený login pass tak vracíme staticky uložené údaje
        if Config.LOGIN_PASS:
            return return_value(200, "LOGIN_PASS Zapnutý - používám statické hodnoty", username=staticUserEmail, password=staticUserPassword)

        # JSON body
        data = {
            "user-id": email,
            "email": email,
            "password": password,
            "expiration": expire,
            "comment": usermac
        }
        try:
            ## POST request to Forti (create guest user) ##
            result = req.post(Config.API_URL, json=data, headers={
                "Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False, timeout=3)

            logger.info(result.json())

            if result.status_code == 200:
                return return_value(200, "Uživatel úšpěšně vytvořený ve FG", username=email, password=password)

            else:
                return return_value(500, "Nebylo možné vytvořit uživatele na síti, prosíme opakujte akci později.")
        except:
            return return_value(500, "Nebylo možné se spojit s FG, prosíme opakujte akci později.")


def return_value(statusCode: int, message: str, **user) -> dict:
    result = {
        "status": statusCode,
        "message": message,
        "data": {
            "username": user["username"],
            "password": user["password"]
        }
    }
    return result
