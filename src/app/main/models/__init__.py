from app.extensions import db

class User(db.Model):
    Id = db.Column(db.Text, primary_key=True, unique=True, nullable=False)
    Email = db.Column(db.Text)
    Password = db.Column(db.Text)
    MarketingApproved = db.Column(db.Boolean)
    LastLogin = db.Column(db.DateTime)
    CreatedAt = db.Column(db.DateTime)


class Session(db.Model):
    Id = db.Column(db.Text, primary_key=True, unique=True, nullable=False)
    UserId = db.Column(db.Text, unique=False, nullable=True)
    Magic = db.Column(db.Text)
    CratedAt = db.Column(db.DateTime)

class Device(db.Model):
    Id = db.Column(db.Text, primary_key=True, unique=True, nullable=False)
    UserId = db.Column(db.Text, unique=False, nullable=True)
    MacAddress = db.Column(db.Text, unique=False, nullable=False)
    ConnectedNetwork = db.Column(db.Text, unique=False, nullable=True)
    LastConnection = db.Column(db.DateTime)