from app import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
from sqlalchemy.orm import validates
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
    phone_number = db.Column(db.String(20), nullable=True)  # New field
    listings = db.relationship('Listing', backref='owner', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'google_id': self.google_id,
            'email': self.email,
            'username': self.username,
            'name': self.name,
            'picture': self.picture,
            'phone_number': self.phone_number  # Added to dictionary
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
    # Increased size for base64 thumbnail (50KB)
    thumbnail_image = db.Column(db.String(2*655360), nullable=False)  # 64KB
    # Using JSON type for array of base64 images
    other_images = db.Column(JSON, nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    class_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Add relationship for users who saved this listing
    saved_by_users = db.relationship(
        'User',
        secondary=saved_listings,
        lazy='dynamic',
        backref=db.backref('saved_listings', lazy='dynamic')
    )
    
    # Add validation for image sizes
    @validates('thumbnail_image')
    def validate_thumbnail(self, key, value):
        max_size = 2*3932160  # 384KB not 64KB
        if len(value) > max_size:
            raise ValueError(f'Thumbnail image exceeds maximum size of {max_size/1024:.0f}KB')
        return value
    
    @validates('other_images')
    def validate_other_images(self, key, value):
        max_size_per_image = 2*3932160  # 384KB
        max_images = 5  # Limit number of additional images
        
        if not isinstance(value, list):
            raise ValueError('other_images must be a list')
        
        if len(value) > max_images:
            raise ValueError(f'Maximum of {max_images} additional images allowed')
            
        for img in value:
            if len(img) > max_size_per_image:
                raise ValueError(f'Each image must be less than {max_size_per_image/1024:.0f}KB')
        
        return value

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
            'saved': self.is_saved_by_current_user()
        }

    def is_saved_by_current_user(self):
        if 'user_id' not in session:
            return False
        return self.saved_by_users.filter_by(id=session['user_id']).first() is not None

    def __repr__(self):
        return f'<Listing {self.title}>'