from uuid import uuid4
from flask import render_template, request
from app.main import bp
from app.extensions import db
from app.models.user import User
from datetime import datetime


@bp.route('/test', methods=["GET", "POST"])
def index():
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

@bp.route("/")
def test():
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