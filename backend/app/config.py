import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://rohit:MangoEater12@localhost:5432/test'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY=False
    SESSION_COOKIE_SECURE=True
    SESSION_COOKIE_SAMESITE='None'
    SESSION_TYPE='filesystem'
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static/uploads')
    