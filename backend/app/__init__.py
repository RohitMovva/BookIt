from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_session import Session

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, 
         origins=['http://localhost:3000', 'http://127.0.0.1:5000'], 
         supports_credentials=True, 
         allow_headers=['Content-Type', 'Authorization'])
    
    Session(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Don't automatically create tables on app startup
    # Instead, use Flask-Migrate to handle database migrations
    # with app.app_context():
    #     db.create_all()

    from app import routes
    app.register_blueprint(routes.bp)

    return app
