from app.main import bp
from flask import render_template, request
from config import Config
import requests as req

@bp.route("/api-get")
def apiGet():
    result = req.get(Config.API_URL, headers={"Authorization": f"Bearer {Config.API_TOKEN}"}, verify=False)
    return result.json()

@bp.route("/api-post")
def apiPost():
    return ""
