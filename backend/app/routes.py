from flask import Blueprint, request, jsonify, session, make_response, current_app
from sqlalchemy import or_
from google.oauth2 import id_token
from google.auth.transport import requests
from app import db
from app.models import User, Listing, saved_listings
import app
from datetime import datetime
from flask_cors import cross_origin
from functools import wraps
import logging
import re
from werkzeug.utils import secure_filename
from flask import send_from_directory
import os

# Add these configurations at the top of your routes file
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# from datetime import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
bp = Blueprint('/api', __name__)

CLIENT_ID = "181075873064-ggjodg29em6uua3m78iptb9e3aaqr610.apps.googleusercontent.com"

@bp.route('/api/images/<path:filename>')
@cross_origin(supports_credentials=True)
def serve_image(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

# Helper functions
def validate_email(email):
    """Validate email format"""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_username(username):
    """Validate username format"""
    pattern = r'^[\w-]{3,30}$'
    return re.match(pattern, username) is not None

def validate_phone_number(phone):
    """Validate phone number format"""
    # Accepts formats like: +1-123-456-7890, (123) 456-7890, 123.456.7890, 123-456-7890
    pattern = r'^\+?1?\s*[-.]?\s*(\([0-9]{3}\)|[0-9]{3})\s*[-.]?\s*[0-9]{3}\s*[-.]?\s*[0-9]{4}$'
    return re.match(pattern, phone) is not None

def format_phone_number(phone):
    """Format phone number consistently"""
    # Remove all non-digit characters
    digits = ''.join(filter(str.isdigit, phone))
    
    # Format as XXX-XXX-XXXX
    if len(digits) == 10:
        return f'{digits[:3]}-{digits[3:6]}-{digits[6:]}'
    elif len(digits) == 11 and digits[0] == '1':
        return f'{digits[1:4]}-{digits[4:7]}-{digits[7:]}'
    return digits  # Return original digits if it doesn't match expected patterns


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

@bp.route('/users/<int:user_id>', methods=['PUT', 'PATCH'])
@login_required
def modify_user(user_id):
    try:
        # Verify user is modifying their own account
        if session['user_id'] != user_id:
            return jsonify({
                'error': 'Forbidden - You can only modify your own account'
            }), 403

        # Get the user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Track what fields were modified
        modified_fields = []
        
        try:
            # Username update
            if 'username' in data:
                new_username = data['username']
                if new_username:  # Allow clearing username by setting to None/null
                    if not validate_username(new_username):
                        return jsonify({
                            'error': 'Invalid username format. Use 3-30 characters, alphanumeric with underscores and hyphens only.'
                        }), 400
                    
                    existing_user = User.query.filter(
                        User.username == new_username,
                        User.id != user_id
                    ).first()
                    if existing_user:
                        return jsonify({
                            'error': 'Username already taken'
                        }), 400
                
                user.username = new_username
                modified_fields.append('username')

            # Email update
            if 'email' in data:
                new_email = data['email']
                if not validate_email(new_email):
                    return jsonify({
                        'error': 'Invalid email format'
                    }), 400
                
                existing_user = User.query.filter(
                    User.email == new_email,
                    User.id != user_id
                ).first()
                if existing_user:
                    return jsonify({
                        'error': 'Email already registered'
                    }), 400
                
                user.email = new_email
                modified_fields.append('email')

            # Name update
            if 'name' in data:
                new_name = data['name']
                if not new_name or len(new_name.strip()) < 1:
                    return jsonify({
                        'error': 'Name cannot be empty'
                    }), 400
                
                if len(new_name) > 120:
                    return jsonify({
                        'error': 'Name is too long (maximum 120 characters)'
                    }), 400
                
                user.name = new_name.strip()
                modified_fields.append('name')

            # Picture URL update
            if 'picture' in data:
                new_picture = data['picture']
                if new_picture and len(new_picture) > 255:
                    return jsonify({
                        'error': 'Picture URL is too long (maximum 255 characters)'
                    }), 400
                
                user.picture = new_picture
                modified_fields.append('picture')

            # Phone number update
            if 'phone_number' in data:
                new_phone = data['phone_number']
                if new_phone:  # Allow clearing phone number by setting to None/null
                    if not validate_phone_number(new_phone):
                        return jsonify({
                            'error': 'Invalid phone number format. Use format like: XXX-XXX-XXXX or (XXX) XXX-XXXX'
                        }), 400
                    # Format phone number consistently
                    new_phone = format_phone_number(new_phone)
                
                user.phone_number = new_phone
                modified_fields.append('phone_number')

            # Only commit if there were actual changes
            if modified_fields:
                db.session.commit()
                logging.info(f"User {user_id} modified fields: {', '.join(modified_fields)}")
                
                return jsonify({
                    'message': 'User updated successfully',
                    'modified_fields': modified_fields,
                    'user': user.to_dict()
                }), 200
            else:
                return jsonify({
                    'message': 'No fields were modified',
                    'user': user.to_dict()
                }), 200

        except Exception as e:
            db.session.rollback()
            logging.error(f"Database error while modifying user {user_id}: {str(e)}")
            return jsonify({
                'error': 'Database error occurred while updating user'
            }), 500

    except Exception as e:
        logging.error(f"Error in modify_user endpoint: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred'
        }), 500




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

@bp.route('/current-user', methods=['GET'])
def get_current_user_info():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify(user.to_dict()), 200
    return jsonify({"error": "Not authenticated"}), 401

@bp.route('/create-listing', methods=['POST'])
def create_listing():
    logger.debug(f"Session in create_listing: {session}")
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if files were uploaded
    if 'thumbnail' not in request.files:
        return jsonify({"error": "No thumbnail file provided"}), 400
    
    logger.debug(f"Request files: {request.files}")
    
    thumbnail_file = request.files['thumbnail']
    if thumbnail_file.filename == '' or not allowed_file(thumbnail_file.filename):
        return jsonify({"error": "Invalid thumbnail file"}), 400

    # Handle other images
    other_image_paths = []
    if 'other_images' in request.files:
        other_images = request.files.getlist('other_images')
        for image in other_images:
            if image.filename != '' and allowed_file(image.filename):
                other_image_paths.append(image)

    # Create new listing
    new_listing = Listing(
        title=request.form['title'],
        description=request.form['description'],
        price=float(request.form['price']),
        phone_number=request.form['phone_number'],
        email_address=request.form['email_address'],
        condition=request.form['condition'],
        date=datetime.utcnow(),
        class_type=request.form['class_type'],
        user_id=user.id
    )

    logger.debug(f"New listing: {new_listing}")
    logger.debug(f"Image path: {current_app.config['UPLOAD_FOLDER']}")  # Add this at the start of save_uploaded_file

    try:
        # Save thumbnail
        logger.debug(f"Thumbnail file: {thumbnail_file}")
        thumbnail_path = new_listing.save_uploaded_file(thumbnail_file, is_thumbnail=True)
        new_listing.thumbnail_path = thumbnail_path
        logger.debug(f"Thumbnail path: {thumbnail_path}")

        # Save other images
        logger.debug(f"Other images: {other_image_paths}")
        other_paths = []
        for image in other_image_paths:
            path = new_listing.save_uploaded_file(image, is_thumbnail=False)
            other_paths.append(path)
        new_listing.other_image_paths = other_paths
        logger.debug(f"Other image paths: {other_paths}")

        db.session.add(new_listing)
        db.session.commit()
        
        return jsonify({
            "message": "Listing created successfully",
            "listing": new_listing.to_dict()
        }), 201

    except Exception as e:
        logger.error(f"Error creating listing: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



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
    # print("SORT KEY: ", sort_key)
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

@bp.route('/get-saved-listings/<int:user_id>', methods=['GET'])
def get_saved_listings(user_id):
    # Verify user exists
    user = User.query.get_or_404(user_id)
    
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
    
    # Initialize the query with saved listings for the user
    listings_query = user.saved_listings
    
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
        "active_filters": active_filters,
        "user_id": user_id
    }
    
    return jsonify(response), 200

@bp.route('/update-listing/<uuid:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.user_id != session['user_id']:
        return jsonify({"error": "Unauthorized to update this listing"}), 403

    try:
        # Update basic fields
        listing.title = request.form.get('title', listing.title)
        listing.description = request.form.get('description', listing.description)
        listing.price = float(request.form.get('price', listing.price))
        listing.phone_number = request.form.get('phone_number', listing.phone_number)
        listing.email_address = request.form.get('email_address', listing.email_address)
        listing.condition = request.form.get('condition', listing.condition)
        listing.class_type = request.form.get('class_type', listing.class_type)

        # Handle new thumbnail if provided
        if 'thumbnail' in request.files:
            thumbnail_file = request.files['thumbnail']
            if thumbnail_file.filename != '' and allowed_file(thumbnail_file.filename):
                # Delete old thumbnail
                listing.delete_file(listing.thumbnail_path)
                # Save new thumbnail
                new_thumbnail_path = listing.save_uploaded_file(thumbnail_file, is_thumbnail=True)
                listing.thumbnail_path = new_thumbnail_path

        # Handle new other images if provided
        if 'other_images' in request.files:
            new_images = request.files.getlist('other_images')
            valid_new_images = [img for img in new_images if img.filename != '' and allowed_file(img.filename)]
            
            if valid_new_images:
                # Delete old images
                for old_path in listing.other_image_paths:
                    listing.delete_file(old_path)
                
                # Save new images
                new_paths = []
                for image in valid_new_images:
                    path = listing.save_uploaded_file(image, is_thumbnail=False)
                    new_paths.append(path)
                listing.other_image_paths = new_paths

        db.session.commit()
        return jsonify({"message": "Listing updated successfully", "listing": listing.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/delete-listing/<uuid:listing_id>', methods=['DELETE', 'OPTIONS'])
def delete_listing(listing_id):
    if request.method == "OPTIONS":
        response = jsonify({'status': 'ok'})
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    if 'user_id' not in session:
        return jsonify({"error": "User not authenticated"}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.user_id != session['user_id']:
        return jsonify({"error": "Unauthorized to delete this listing"}), 403

    try:
        # Delete image files
        listing.delete_file(listing.thumbnail_path)
        for path in listing.other_image_paths:
            listing.delete_file(path)

        # Delete database record
        db.session.delete(listing)
        db.session.commit()
        return jsonify({"message": "Listing deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    try:
        # Check if the logged-in user is trying to delete their own account
        if session['user_id'] != user_id:
            return jsonify({
                'error': 'Forbidden - You can only delete your own account'
            }), 403

        # Get the user
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Begin database transaction
        try:
            # Delete user's saved listings (association table entries)
            db.session.execute(saved_listings.delete().where(
                saved_listings.c.user_id == user_id
            ))

            # Delete all listings owned by the user
            Listing.query.filter_by(user_id=user_id).delete()

            # Delete the user
            db.session.delete(user)
            
            # Commit the transaction
            db.session.commit()

            # Clear the session
            session.clear()

            return jsonify({
                'message': 'User and associated data successfully deleted'
            }), 200

        except Exception as e:
            # If anything goes wrong, rollback the transaction
            db.session.rollback()
            logging.error(f"Error deleting user {user_id}: {str(e)}")
            return jsonify({
                'error': 'An error occurred while deleting the user'
            }), 500

    except Exception as e:
        logging.error(f"Error in delete_user endpoint: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred'
        }), 500

