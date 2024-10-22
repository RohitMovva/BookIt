from flask import Blueprint, request, jsonify, session, make_response
from sqlalchemy import or_
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db
from app.models import User, Listing
from datetime import datetime
from flask_cors import cross_origin
# from datetime import datetime

import logging

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
bp = Blueprint('/api', __name__)

# You'll need to install google-auth: pip install google-auth
CLIENT_ID = "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"

# @app.after_request
# def after_request(response):
#     return response

@bp.route('/signin', methods=['POST'])
@cross_origin(supports_credentials=True)
def signin():
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

    session.pop('user_id', None)
    
    response = make_response(jsonify({"message": "Successfully signed out"}))
    response.set_cookie('auth_token', '', expires=0)
    
    return response, 200



@bp.route('/check-auth', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_auth():
    # logger.debug(f"Check-auth request headers: {request.headers}")
    # logger.debug(f"Session in check_auth: {session}")
    # if request.cookies.get('auth_user'):
    #     user = User.query.get(request.cookies.get('auth_user'))
    #     if user:
    #         return jsonify({"authenticated": True, "user": user.to_dict()}), 200
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
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


# @bp.route('/create-listing', methods=['POST'])
# def create_listing():
#     if 'user_id' not in session:
#         return jsonify({"error": "User not authenticated"}), 401

#     data = request.json
#     user = User.query.get(session['user_id'])

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     new_listing = Listing(
#         title=data['title'],
#         description=data['description'],
#         price=data['price'],
#         phone_number=data['phone_number'],
#         email_address=data['email_address'],
#         thumbnail_image=data['thumbnail_image'],
#         other_images=data.get('other_images', []),
#         condition=data['condition'],
#         date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
#         class_type=data['class_type'],
#         user_id=user.id
#     )

#     db.session.add(new_listing)
#     db.session.commit()

#     return jsonify({"message": "Listing created successfully", "listing": new_listing.to_dict()}), 201

@bp.route('/create-listing', methods=['POST'])
def create_listing():
    data = request.json
    user = User.query.get(data.get('user_id'))
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
        date=datetime.utcnow(),  # Now storing as DateTime object
        class_type=data['class_type'],
        user_id=user.id
    )
    
    db.session.add(new_listing)
    db.session.commit()
    
    return jsonify({"message": "Listing created successfully", "listing": new_listing.to_dict()}), 201



@bp.route('/get-listings', methods=['GET'])
def get_listings():
    # Get basic pagination parameters
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    # Get sort parameters
    sort_by = request.args.get('sort_by', 'date')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Get price range parameters
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    # Get date range parameters and convert to datetime objects
    start_date = request.args.get('start_date')  # Format: YYYY-MM-DD
    end_date = request.args.get('end_date')      # Format: YYYY-MM-DD
    
    # Initialize the query
    listings_query = Listing.query
    
    # Apply search filter if query parameter exists
    if query:
        listings_query = listings_query.filter(
            or_(
                Listing.title.ilike(f'%{query}%'),
                Listing.description.ilike(f'%{query}%'),
                Listing.class_type.ilike(f'%{query}%')
            )
        )
    
    # Apply price range filter
    if min_price is not None:
        listings_query = listings_query.filter(Listing.price >= min_price)
    if max_price is not None:
        listings_query = listings_query.filter(Listing.price <= max_price)
    
    # Apply date range filter with DateTime objects
    if start_date:
        try:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            start_datetime = start_datetime.replace(hour=0, minute=0, second=0)
            listings_query = listings_query.filter(Listing.date >= start_datetime)
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400
            
    if end_date:
        try:
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            listings_query = listings_query.filter(Listing.date <= end_datetime)
        except ValueError:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400
    
    # Apply sorting
    sort_options = {
        'price_asc': Listing.price.asc(),
        'price_desc': Listing.price.desc(),
        'date_desc': Listing.date.desc(),
        'date_asc': Listing.date.asc(),
        # Add more sorting options here in the future
    }
    
    # Combine sort_by and sort_order to get the sort key
    sort_key = f"{sort_by}_{sort_order}"
    if sort_key in sort_options:
        listings_query = listings_query.order_by(sort_options[sort_key])
    
    # Apply pagination
    paginated_listings = listings_query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    # Get the current filter state
    active_filters = {
        "price_range": {
            "min": min_price,
            "max": max_price
        },
        "date_range": {
            "start": start_date,
            "end": end_date
        }
    }
    
    # Prepare response
    response = {
        "listings": [listing.to_dict() for listing in paginated_listings.items],
        "total_pages": paginated_listings.pages,
        "current_page": page,
        "total_items": paginated_listings.total,
        "sort_by": sort_by,
        "sort_order": sort_order,
        "available_sorts": list(sort_options.keys()),
        "active_filters": active_filters
    }
    
    return jsonify(response), 200

# @bp.route('/get-user-listings', methods=['GET'])
# def get_user_listings():
#     if 'user_id' not in session:
#         return jsonify({"error": "User not authenticated"}), 401

#     user = User.query.get(session['user_id'])
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     listings = user.listings.all()
#     return jsonify({"listings": [listing.to_dict() for listing in listings]}), 200

# @bp.route('/update-listing/<uuid:listing_id>', methods=['PUT'])
# def update_listing(listing_id):
#     if 'user_id' not in session:
#         return jsonify({"error": "User not authenticated"}), 401

#     listing = Listing.query.get(listing_id)
#     if not listing:
#         return jsonify({"error": "Listing not found"}), 404

#     if listing.user_id != session['user_id']:
#         return jsonify({"error": "Unauthorized to update this listing"}), 403

#     data = request.json
#     for key, value in data.items():
#         setattr(listing, key, value)

#     db.session.commit()
#     return jsonify({"message": "Listing updated successfully", "listing": listing.to_dict()}), 200

# @bp.route('/delete-listing/<uuid:listing_id>', methods=['DELETE'])
# def delete_listing(listing_id):
#     if 'user_id' not in session:
#         return jsonify({"error": "User not authenticated"}), 401

#     listing = Listing.query.get(listing_id)
#     if not listing:
#         return jsonify({"error": "Listing not found"}), 404

#     if listing.user_id != session['user_id']:
#         return jsonify({"error": "Unauthorized to delete this listing"}), 403

#     db.session.delete(listing)
#     db.session.commit()
#     return jsonify({"message": "Listing deleted successfully"}), 200

@bp.route('/get-user-listings/<int:user_id>', methods=['GET'])
def get_user_listings(user_id):
    # First check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get basic pagination parameters
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    # Get sort parameters
    sort_by = request.args.get('sort_by', 'date')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Get price range parameters
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    # Get date range parameters
    start_date = request.args.get('start_date')  # Format: YYYY-MM-DD
    end_date = request.args.get('end_date')      # Format: YYYY-MM-DD
    
    # Initialize query with user's listings
    listings_query = user.listings
    
    # Apply search filter if query parameter exists
    if query:
        listings_query = listings_query.filter(
            or_(
                Listing.title.ilike(f'%{query}%'),
                Listing.description.ilike(f'%{query}%'),
                Listing.class_type.ilike(f'%{query}%')
            )
        )
    
    # Apply price range filter
    if min_price is not None:
        listings_query = listings_query.filter(Listing.price >= min_price)
    if max_price is not None:
        listings_query = listings_query.filter(Listing.price <= max_price)
    
    # Apply date range filter with DateTime objects
    if start_date:
        try:
            start_datetime = datetime.strptime(start_date, '%Y-%m-%d')
            start_datetime = start_datetime.replace(hour=0, minute=0, second=0)
            listings_query = listings_query.filter(Listing.date >= start_datetime)
        except ValueError:
            return jsonify({"error": "Invalid start_date format. Use YYYY-MM-DD"}), 400
            
    if end_date:
        try:
            end_datetime = datetime.strptime(end_date, '%Y-%m-%d')
            end_datetime = end_datetime.replace(hour=23, minute=59, second=59)
            listings_query = listings_query.filter(Listing.date <= end_datetime)
        except ValueError:
            return jsonify({"error": "Invalid end_date format. Use YYYY-MM-DD"}), 400
    
    # Apply sorting
    sort_options = {
        'price_asc': Listing.price.asc(),
        'price_desc': Listing.price.desc(),
        'date_desc': Listing.date.desc(),
        'date_asc': Listing.date.asc(),
        # Add more sorting options here in the future
    }
    
    # Combine sort_by and sort_order to get the sort key
    sort_key = f"{sort_by}_{sort_order}"
    if sort_key in sort_options:
        listings_query = listings_query.order_by(sort_options[sort_key])
    
    # Apply pagination
    paginated_listings = listings_query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    # Get the current filter state
    active_filters = {
        "price_range": {
            "min": min_price,
            "max": max_price
        },
        "date_range": {
            "start": start_date,
            "end": end_date
        }
    }
    
    # Prepare response with user information
    response = {
        "user_id": user_id,
        "listings": [listing.to_dict() for listing in paginated_listings.items],
        "total_pages": paginated_listings.pages,
        "current_page": page,
        "total_items": paginated_listings.total,
        "sort_by": sort_by,
        "sort_order": sort_order,
        "available_sorts": list(sort_options.keys()),
        "active_filters": active_filters
    }
    
    return jsonify(response), 200

@bp.route('/update-listing/<uuid:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400
    
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.user_id != user_id:
        return jsonify({"error": "Unauthorized to update this listing"}), 403
    
    for key, value in data.items():
        if key != 'user_id':
            setattr(listing, key, value)
    db.session.commit()
    return jsonify({"message": "Listing updated successfully", "listing": listing.to_dict()}), 200

@bp.route('/delete-listing/<uuid:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID not provided"}), 400
    
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.user_id != int(user_id):
        return jsonify({"error": "Unauthorized to delete this listing"}), 403
    
    db.session.delete(listing)
    db.session.commit()
    return jsonify({"message": "Listing deleted successfully"}), 200

# Endpoints for saving/unsaving listings
@bp.route('/save-listing/<uuid:listing_id>', methods=['POST'])
def save_listing(listing_id):
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    if listing.is_saved_by_current_user():
        return jsonify({"error": "Listing already saved"}), 400
    
    listing.saved_by_users.append(user)
    db.session.commit()
    
    return jsonify({
        "message": "Listing saved successfully",
        "save_count": listing.save_count
    }), 200

@bp.route('/unsave-listing/<uuid:listing_id>', methods=['POST'])
def unsave_listing(listing_id):
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    if not listing.is_saved_by_current_user():
        return jsonify({"error": "Listing not saved"}), 400
    
    listing.saved_by_users.remove(user)
    db.session.commit()
    
    return jsonify({
        "message": "Listing unsaved successfully",
        "save_count": listing.save_count
    }), 200