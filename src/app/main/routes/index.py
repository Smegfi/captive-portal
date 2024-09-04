from app.main import bp
from flask import request, render_template
from app.main.repositories.modal import parse_form, parse_args
from app.main.api.user import post_user
from app.logger import set_logger
from datetime import datetime

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