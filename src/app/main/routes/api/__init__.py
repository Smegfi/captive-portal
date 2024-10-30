from app.main import bp
from flask import render_template
from config import Config
import requests as req
from app.main.models import User, Device

@bp.route("/api-get")
def apiGet():
    result = req.get(Config.API_URL, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
    return result.json()

@bp.route("/api-post")
def apiPost():
    result = req.post(Config.API_URL, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
    return result.json()

@bp.route("/db-dump")
def dbDump():
    users = User.query.all()
    devices = Device.query.all()

    data = Model(users=users, devices=devices)
    print(data)
    return render_template("db-dump.html", data=data)

class Model():
    users = list()
    devices = list()

    def __init__(self, users, devices) -> None:
        self.users = users
        self.devices = devices