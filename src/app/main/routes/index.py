from app.main import bp
from flask import request, render_template, send_file
from app.logger import set_logger
from datetime import datetime

logger = set_logger(__name__)


# Tuto cestu volá Fortigate pomocí HTTP 301 redirectu
# Fortigate request example
# https://srv-captive/?
# post=http://192.168.30.1:1000/fgtauth&
# magic=040d028c9aaae999&
# usermac=60:03:08:8f:5e:b6&
# apmac=08:5b:0e:08:d4:ee&
# apip=192.168.30.41&
# ssid=test&
# apname=FWF60D4613003326&
# bssid=00:00:00:00:00:00
@bp.route('/')
def index():
    post = request.args.get("post")
    magic = request.args.get("magic")
    usermac = request.args.get("usermac")
    ssid = request.args.get("ssid")

    data = {
        "post": post,
        "magic": magic,
        "usermac": usermac,
        "ssid": ssid
    }
    return render_template('index.html', data=data)


@bp.route("/tos-download")
def download_document():
    return send_file("static/document/TOS.pdf", as_attachment=True, download_name='podmínky-použití.pdf')
