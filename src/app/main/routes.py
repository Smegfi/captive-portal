import uuid
from flask import render_template, request
from app.main import bp
from app.logger import set_logger
from app.main.api.user import post_user
from datetime import datetime
from app.main.repositories.modal import parse_form, parse_args
import requests as req
from config import Config


logger = set_logger(__name__)

@bp.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        data = parse_form(request=request)

        result = post_user(data["email"], data["mac_address"], datetime.now())
        print(result.json())

        logger.info(data)
        return f"data {data}"
    
    else:
        # Fortigate request example
        # https://192.168.30.47/portal/?post=http://192.168.30.1:1000/fgtauth&magic=040d028c9aaae999&usermac=60:03:08:8f:5e:b6&apmac=08:5b:0e:08:d4:ee&apip=192.168.30.41&ssid=test&apname=FWF60D4613003326&bssid=00:00:00:00:00:00
        data = parse_args(request=request)

        return render_template('index.html', data=data)

@bp.route('/create-user')
def users():
    email = request.args.get("email")
    password = uuid.uuid4()

    result = req.get(Config.API_URL, headers={"Authorization": f"Bearer {Config.API_TOKEN}"})
    
    return result