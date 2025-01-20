from app import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
from sqlalchemy.orm import validates
from flask import session, current_app
from uuid import uuid4
from datetime import datetime
import os
from werkzeug.utils import secure_filename


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=True)
    name = db.Column(db.String(120), nullable=False)
    picture = db.Column(db.String(255))
    phone_number = db.Column(db.String(20), nullable=True)
    listings = db.relationship('Listing', backref='owner', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'google_id': self.google_id,
            'email': self.email,
            'username': self.username,
            'name': self.name,
            'picture': self.picture,
            'phone_number': self.phone_number
        }

    def __repr__(self):
        return f'<User {self.username}>'

saved_listings = db.Table('saved_listings',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    db.Column('listing_id', UUID(as_uuid=True), db.ForeignKey('listing.id', ondelete='CASCADE'), primary_key=True),
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
    # Store file paths instead of base64 strings
    thumbnail_path = db.Column(db.String(255), nullable=False)
    # Store array of file paths
    other_image_paths = db.Column(JSON, nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    class_type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    saved_by_users = db.relationship(
        'User',
        secondary=saved_listings,
        lazy='dynamic',
        backref=db.backref('saved_listings', lazy='dynamic')
    )

    def save_uploaded_file(self, file, is_thumbnail=False):
        """Helper method to save an uploaded file and return the path"""
        # Get absolute path of upload folder
        base_path = os.path.abspath(current_app.config['UPLOAD_FOLDER'])
        print(f"Absolute base path: {base_path}")
        
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid4()}_{filename}"
        
        # Use absolute paths
        subdir = 'thumbnails' if is_thumbnail else 'images'
        upload_dir = os.path.abspath(os.path.join(base_path, subdir))
        file_path = os.path.abspath(os.path.join(upload_dir, unique_filename))
        
        print(f"Using absolute paths:")
        print(f"Upload dir: {upload_dir}")
        print(f"File path: {file_path}")
        
        try:
            # Instead of using file.save(), let's read and write the file manually
            file.seek(0)
            file_content = file.read()
            print(f"Read {len(file_content)} bytes from uploaded file")
            
            with open(file_path, 'wb') as f:
                f.write(file_content)
                f.flush()  # Force write to disk
                os.fsync(f.fileno())  # Force filesystem sync
            
            # Verify file was written
            if os.path.exists(file_path):
                actual_size = os.path.getsize(file_path)
                print(f"File exists on disk with size: {actual_size}")
            else:
                print(f"File does not exist after writing: {file_path}")
                
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            raise
            
        return os.path.join(subdir, unique_filename)

    def delete_file(self, file_path):
        """Helper method to delete a file"""
        full_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file_path)
        if os.path.exists(full_path):
            os.remove(full_path)

    def __del__(self):
        """Clean up files when listing is deleted"""
        try:
            self.delete_file(self.thumbnail_path)
            for path in self.other_image_paths:
                self.delete_file(path)
        except:
            # Log error but don't prevent deletion
            pass

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
            'thumbnail_url': f"/api/images/{self.thumbnail_path}",
            'other_image_urls': [f"/api/images/{path}" for path in self.other_image_paths],
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