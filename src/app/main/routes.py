from crypt import methods
from uuid import uuid4
from flask import render_template, request, redirect
from app.main import bp
from app.extensions import db
from app.models import user
from app.models.user import User
from datetime import datetime
import requests


@bp.route('/test', methods=["GET", "POST"])
def test():
    if request.method == "POST":
        email = request.form.get("email")
        mac = request.form.get("mac-address")
        if request.form.get("marketing"): marketing = True
        else: marketing = False
        user = User(str(uuid4()), email, marketing, str(datetime.now()), mac)

        db.session.add(user)
        db.session.commit()

    if request.method == "GET":
        magic = request.args.get("magic")
        usermac = request.args.get("usermac")
        ssid = request.args.get("ssid")
        userip = request.args.get("userip")
        post = request.args.get("post")
        

    data={
        "email": "test",
        "marketing": "on"
        
    }
    
    return render_template('index.html', data=data)

@bp.route("/", methods=["GET"])
def index():

    magic = request.args.get("magic")
    usermac = request.args.get("usermac")
    ssid = request.args.get("ssid")
    userip = request.args.get("userip")
    post = request.args.get("post")
    
    options = {
        "magic": magic,
        "usermac": usermac,
        "ssid": ssid,
        "userip": userip,
        "post": post
    }
    return render_template("test.html", data=options)

@bp.route("/auth", methods=["POST"])
def authenticate():
    magic = request.form.get("magic")
    usermac = request.form.get("usermac")
    ssid = request.form.get("ssid")
    userip = request.form.get("userip")
    post = request.form.get("post")
    email = request.form.get("email")

    u = User(str(uuid4()), email, True, str(datetime.now()), usermac)
    db.session.add(u)
    db.session.commit()

    data = {
        "magic": magic,
        "username": usermac,
        "password": usermac
    }

    x = requests.post(f"{post}", data = data)

    if x.ok:
        return "OK"
    else:
        return "Bad"