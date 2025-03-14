import uuid
from app.models import User
from app.logger import set_logger
from app import db

logger = set_logger(__name__)

def get_users(id = None):
    if id is not None:
        user = User.query.filter_by(id=id).first()
        logger.info(user)
        return user
    else:    
        users = User.query.all()
        logger.info(users)
        return users
    

def create_user(user: User):
    user = user
    db.session.add(user)
    db.session.commit()

def update_user(id: uuid.UUID, model: User):
    user: User = User.query.filter_by(id=id).first()
    user.Email = model.Email
    user.MarketingApproved = model.MarketingApproved
    db.session.commit()

def delete_user(id: uuid.UUID):
    user = User.query.filter_by(id=id).first()
    db.session.delete(user)
    db.session.commit()