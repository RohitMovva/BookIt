from flask import Blueprint, request, jsonify, session
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db
from app.models import User

bp = Blueprint('api', __name__)

# You'll need to install google-auth: pip install google-auth
CLIENT_ID = "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"

@bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    try:
        idinfo = id_token.verify_oauth2_token(data['credential'], requests.Request(), CLIENT_ID)
        if idinfo['email_verified']:
            user = User.query.filter_by(google_id=idinfo['sub']).first()
            if user:
                session['user_id'] = user.id  # Set session
                return jsonify({"message": "Sign-in successful", "user": user.to_dict()}), 200
            else:
                return jsonify({"error": "User not found"}), 404
        else:
            return jsonify({"error": "Email not verified"}), 400
    except ValueError:
        return jsonify({"error": "Invalid token"}), 400

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        idinfo = id_token.verify_oauth2_token(data['credential'], requests.Request(), CLIENT_ID)
        if idinfo['email_verified']:
            existing_user = User.query.filter_by(google_id=idinfo['sub']).first()
            if existing_user:
                return jsonify({"error": "User already exists"}), 400
            new_user = User(
                google_id=idinfo['sub'],
                email=idinfo['email'],
                name=idinfo['name'],
                picture=idinfo.get('picture')
            )
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id  # Set session
            return jsonify({"message": "Google authentication successful", "user": new_user.to_dict()}), 200
        else:
            return jsonify({"error": "Email not verified"}), 400
    except ValueError:
        return jsonify({"error": "Invalid token"}), 400

@bp.route('/complete-signup', methods=['POST'])
def complete_signup():
    data = request.json
    user = User.query.filter_by(google_id=data['google_id']).first()
    if user:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already taken"}), 400
        user.username = data['username']
        db.session.commit()
        return jsonify({"message": "Signup completed", "user": user.to_dict()}), 200
    else:
        return jsonify({"error": "User not found"}), 404

@bp.route('/signout', methods=['POST'])
def signout():
    session.pop('user_id', None)
    return jsonify({"message": "Successfully signed out"}), 200

@bp.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({"authenticated": True, "user": user.to_dict()}), 200
    return jsonify({"authenticated": False}), 200

@bp.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello, World!"}), 200
