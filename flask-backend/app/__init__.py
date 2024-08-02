from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.routes import bp as routes_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    app.register_blueprint(routes_bp, url_prefix='/api')

    return app
