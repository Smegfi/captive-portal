from flask import Request

def parse_form(request: Request):
    email = request.form.get("email")
    marketing = request.form.get("marketing")

    magic = request.form.get("magic")
    mac_address = request.form.get("usermac")
    ssid = request.form.get("ssid")

    data = {
        "magic":magic,
        "mac_address": mac_address,
        "ssid": ssid,
        "email": email,
        "marketing": marketing
    }
    return data

def parse_args(request: Request):
    email = request.args.get("email")
    marketing = request.args.get("marketing")

    magic = request.args.get("magic")
    mac_address = request.args.get("usermac")
    ssid = request.args.get("ssid")
    post = request.args.get("post")

    data = {
        "post": post,
        "magic":magic,
        "mac_address": mac_address,
        "ssid": ssid,
        "email": email,
        "marketing": marketing
    }
    return data