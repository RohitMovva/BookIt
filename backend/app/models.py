from app import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
from flask import session
from uuid import uuid4
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)
    name = db.Column(db.String(120), nullable=False)
    picture = db.Column(db.String(255))
    listings = db.relationship('Listing', backref='owner', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'google_id': self.google_id,
            'email': self.email,
            'username': self.username,
            'name': self.name,
            'picture': self.picture
        }

    def __repr__(self):
        return f'<User {self.username}>'

# Association table for saved listings
saved_listings = db.Table('saved_listings',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('listing_id', UUID(as_uuid=True), db.ForeignKey('listing.id'), primary_key=True),
    db.Column('saved_at', db.DateTime, default=datetime.utcnow)
)

class Listing(db.Model):
    __tablename__ = 'listing'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(120), nullable=False)
    thumbnail_image = db.Column(db.String(255), nullable=False)
    other_images = db.Column(JSON)  # Changed from ARRAY to JSON
    condition = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    class_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Add relationship for users who saved this listing
    saved_by_users = db.relationship('User', 
                                   secondary=saved_listings,
                                   lazy='dynamic',
                                   backref=db.backref('saved_listings', lazy='dynamic'))
    
    @property
    def save_count(self):
        return self.saved_by_users.count()
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'phone_number': self.phone_number,
            'email_address': self.email_address,
            'thumbnail_image': self.thumbnail_image,
            'other_images': self.other_images,
            'condition': self.condition,
            'date': self.date.isoformat(),
            'class_type': self.class_type,
            'user_id': self.user_id,
            'save_count': self.save_count,
            'is_saved': self.is_saved_by_current_user()
        }
    
    def is_saved_by_current_user(self):
        if 'user_id' not in session:
            return False
        return self.saved_by_users.filter_by(id=session['user_id']).first() is not None
    
    def __repr__(self):
        return f'<Listing {self.title}>'
