from app.extensions import db
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
import uuid

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

    def __str__(self):
        return f"Email:\t\t{self.Email}\nMac address:\t{self.MacAddress}\nID:\t\t{self.Id}\n---"