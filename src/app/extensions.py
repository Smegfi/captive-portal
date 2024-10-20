from flask_sqlalchemy import SQLAlchemy

connection_string = "postgresql+psycopg2://captiveUser:@10.41.171.10:5432/captive-portal"

db = SQLAlchemy()