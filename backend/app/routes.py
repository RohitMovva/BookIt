from flask import Blueprint, request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db
from app.models import User


bp = Blueprint('api', __name__)

# You'll need to install google-auth: pip install google-auth
CLIENT_ID = "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"

# @bp.route('/items', methods=['POST'])
# def add_item():
#     data = request.json
#     name = data.get('name')
#     print("Adding item: ", name)
#     if not name:
#         return jsonify({"error": "Name is required"}), 400
    
#     item = Item(name=name)
#     db.session.add(item)
#     db.session.commit()
#     return jsonify({"message": "Item added", "item": {"id": item.id, "name": item.name}}), 201

# @bp.route('/items/<int:item_id>', methods=['DELETE'])
# def delete_item(item_id):
#     item = Item.query.get_or_404(item_id)
#     print("Deleting item: ", item)
#     db.session.delete(item)
#     db.session.commit()
#     return jsonify({"message": "Item deleted"}), 200

# @bp.route('/items', methods=['GET'])
# def get_items():
#     items = Item.query.all()
#     print("Querying items")
#     items_list = [{"id": item.id, "name": item.name} for item in items]
#     return jsonify({"items": items_list}), 200  # Return data in a consistent structure



@bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    try:
        idinfo = id_token.verify_oauth2_token(data['credential'], requests.Request(), CLIENT_ID)
        
        if idinfo['email_verified']:
            user = User.query.filter_by(google_id=idinfo['sub']).first()
            if user:
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

@bp.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello, World!"}), 200
