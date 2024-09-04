from app.main import bp
from flask import render_template, request
from app.main.repositories.modal import parse_args

@bp.route("/api-test")
def apiTest():
    data = parse_args(request=request)
    return render_template("api-test.html", data=data)