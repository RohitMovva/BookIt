from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_session import Session
# from app.routes import bp as routes_bp

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    # Configuration for local development
    # app.config.update(
    #     SECRET_KEY='your_secret_key_here',  # Replace with a random secret key
    #     # SESSION_COOKIE_SECURE=False,  # Allow sessions without HTTPS
    #     SESSION_COOKIE_HTTPONLY=False,  # Prevent JavaScript access to session cookie
    #     # SESSION_COOKIE_SAMESITE='Lax',  # Prevents CSRF, less strict than 'Strict'
    #     SESSION_TYPE='filesystem',  # Store session data in the filesystem
    #     SQLALCHEMY_DATABASE_URI='sqlite:///site.db',  # Use SQLite for the database
    #     DEBUG=True  # Enable debug mode for development
    # )

    # app.config['SESSION_COOKIE_SECURE'] = False  # for HTTPS
    # app.config['SESSION_COOKIE_HTTPONLY'] = True
    # app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    # app.config["SESSION_TYPE"] = "filesystem"
    # app.config["SECRET_KEY"] = "super_secret_key"
    # app.config[""] = "filesystem"
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:5000'], supports_credentials=True, allow_headers=['Content-Type', 'Authorization'])
    Session(app)

    db.init_app(app)
    with app.app_context():
        # This will create all tables
        db.create_all()
    # db.create_all()
    migrate.init_app(app, db)

    from app import routes
    app.register_blueprint(routes.bp)

    # app.register_blueprint(routes_bp, url_prefix='/api')

    return app
