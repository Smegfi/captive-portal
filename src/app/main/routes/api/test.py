from app.main import bp
from flask import render_template, request
from app.main.models import User,Device

@bp.route("/api-test")
def apiTest():
    email = request.args.get("email")
    marketing = request.args.get("marketing")

    magic = request.args.get("magic")
    usermac = request.args.get("usermac")
    ssid = request.args.get("ssid")
    post = request.args.get("post")

    data = {
        "post": post,
        "magic":magic,
        "usermac": usermac,
        "ssid": ssid,
        "email": email,
        "marketing": marketing
    }

    return render_template("api-test.html", data=data)