from app.main import bp
from flask import render_template, jsonify
from healthcheck import HealthCheck, EnvironmentDump

@bp.route("/health")
def health():
    health = HealthCheck()
    env = EnvironmentDump()

    data = { "health": health.run(), "env": env.run()}
    return jsonify(data)