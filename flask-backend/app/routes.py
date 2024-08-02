from flask import Blueprint, jsonify

bp = Blueprint('api', __name__)

@bp.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello, World!"}), 200
