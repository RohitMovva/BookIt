from app import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
import uuid

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

class Listing(db.Model):
    __tablename__ = 'listing'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email_address = db.Column(db.String(120), nullable=False)
    thumbnail_image = db.Column(db.String(255), nullable=False)
    other_images = db.Column(JSON)  # Changed from ARRAY to JSON
    condition = db.Column(db.String(20), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    saved = db.Column(db.Boolean, default=False)
    class_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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
            'date': self.date,
            'saved': self.saved,
            'class_type': self.class_type,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Listing {self.title}>'