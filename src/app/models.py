from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from app import db
import json

class User(db.Model):
    __tablename__ = "User"
    Id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    Email: Mapped[str] = mapped_column(unique=True)
    MarketingApproved: Mapped[bool]
    Date: Mapped[datetime]
    MacAddress: Mapped[str]

    def __init__(self, id, email, marketing_approved, date, mac_address):
        self.Id = id
        self.Email = email
        self.MarketingApproved = marketing_approved
        self.Date = date
        self.MacAddress = mac_address

    def __str__(self) -> str:
        return json.dumps(self.__dict__)
    
    def __repr__(self):
        return json.dumps(self.__dict__)
    
class Session(db.Model):
    __tablename__ = "Session"
    Id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    UserId: Mapped[uuid.UUID]
    MacAddress: Mapped[str]
    Magic: Mapped[str]
    Date: Mapped[datetime]
    Ssid: Mapped[str]

    def __init__(self, id, user_id, mac_address, magic, date, ssid):
        self.Id = id
        self.UserId = user_id
        self.MacAddress = mac_address
        self.Magic = magic
        self.Date = date
        self.Ssid = ssid