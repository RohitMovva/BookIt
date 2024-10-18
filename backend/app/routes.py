from flask import Blueprint, request, jsonify, session, make_response
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db
from app.models import User, Listing
from datetime import datetime
from flask_cors import cross_origin
import logging

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
bp = Blueprint('/api', __name__)

# You'll need to install google-auth: pip install google-auth
CLIENT_ID = "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"

# @app.after_request
# def after_request(response):
#     print("Session after request:", session)
#     return response

@bp.route('/signin', methods=['POST'])
@cross_origin(supports_credentials=True)
def signin():
    print("SIGNING IN CALLED")
    # logger.debug(f"Signin request data: {request.json}")
    # logger.debug(f"Request headers: {request.headers}")

    data = request.json
    try:
        idinfo = id_token.verify_oauth2_token(data['credential'], requests.Request(), CLIENT_ID)
        if idinfo['email_verified']:
            user = User.query.filter_by(google_id=idinfo['sub']).first()
            if user:
                session['user_id'] = user.id  # Set session
                session.modified = True
                print("session: ", session)

                response = make_response(jsonify({"message": "Sign-in successful", "user": user.to_dict()}))
                # response.set_cookie('auth_user', str(user.id), expires=0)

                return response, 200
            else:
                return jsonify({"error": "User not found"}), 404
        else:
            return jsonify({"error": "Email not verified"}), 400
    except ValueError:
        return jsonify({"error": "Invalid token"}), 400

@bp.route('/signup', methods=['POST'])
@cross_origin(supports_credentials=True)
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
@cross_origin(supports_credentials=True)
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

@bp.route('/signout', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def signout():
    if request.method == "OPTIONS":
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    print("Previous session in signout:", session)
    session.pop('user_id', None)
    
    response = make_response(jsonify({"message": "Successfully signed out"}))
    response.set_cookie('auth_token', '', expires=0)
    
    return response, 200



@bp.route('/check-auth', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_auth():
    print("REQUEST CALLED: ", request.cookies)
    print(request.cookies.keys())
    # logger.debug(f"Check-auth request headers: {request.headers}")
    # logger.debug(f"Session in check_auth: {session}")
    print("Session in check_auth:", session)
    # if request.cookies.get('auth_user'):
    #     user = User.query.get(request.cookies.get('auth_user'))
    #     if user:
    #         return jsonify({"authenticated": True, "user": user.to_dict()}), 200
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        print("Session id in check_auth:", session['user_id'])
        if user:
            return jsonify({"authenticated": True, "user": user.to_dict()}), 200
    return jsonify({"authenticated": False}), 200

@bp.route('/user-info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"error": "User not found"}), 404

# You can also add an endpoint to get the current user's info
@bp.route('/current-user', methods=['GET'])
def get_current_user_info():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({"error": "Not authenticated"}), 401


@bp.route('/create-listing', methods=['POST'])
def create_listing():
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.json
    user = User.query.get(session['user_id'])

    if not user:
        return jsonify({"error": "User not found"}), 404

    new_listing = Listing(
        title=data['title'],
        description=data['description'],
        price=data['price'],
        phone_number=data['phone_number'],
        email_address=data['email_address'],
        thumbnail_image=data['thumbnail_image'],
        other_images=data.get('other_images', []),
        condition=data['condition'],
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        class_type=data['class_type'],
        user_id=user.id
    )

    db.session.add(new_listing)
    db.session.commit()

    return jsonify({"message": "Listing created successfully", "listing": new_listing.to_dict()}), 201

@bp.route('/get-listings', methods=['GET'])
def get_listings():
    listings = Listing.query.all()
    return jsonify({"listings": [listing.to_dict() for listing in listings]}), 200

@bp.route('/get-user-listings', methods=['GET'])
def get_user_listings():
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    listings = user.listings.all()
    return jsonify({"listings": [listing.to_dict() for listing in listings]}), 200

@bp.route('/update-listing/<uuid:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != session['user_id']:
        return jsonify({"error": "Unauthorized to update this listing"}), 403

    data = request.json
    for key, value in data.items():
        setattr(listing, key, value)

    db.session.commit()
    return jsonify({"message": "Listing updated successfully", "listing": listing.to_dict()}), 200

@bp.route('/delete-listing/<uuid:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != session['user_id']:
        return jsonify({"error": "Unauthorized to delete this listing"}), 403

    db.session.delete(listing)
    db.session.commit()
    return jsonify({"message": "Listing deleted successfully"}), 200
