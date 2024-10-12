from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
# from app.routes import bp as routes_bp

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.config.from_object(Config)

    db.init_app(app)
    # with app.app_context():
    #     # This will create all tables
    #     db.create_all()
    migrate.init_app(app, db)

    from app import routes
    app.register_blueprint(routes.bp)

    # app.register_blueprint(routes_bp, url_prefix='/api')

    return app
