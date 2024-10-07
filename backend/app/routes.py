from flask import Blueprint, request, jsonify
from app import db
from app.models import Item

bp = Blueprint('api', __name__)

@bp.route('/items', methods=['POST'])
def add_item():
    data = request.json
    name = data.get('name')
    print("Adding item: ", name)
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    item = Item(name=name)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added", "item": {"id": item.id, "name": item.name}}), 201

@bp.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    print("Deleting item: ", item)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted"}), 200

@bp.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    print("Querying items")
    items_list = [{"id": item.id, "name": item.name} for item in items]
    return jsonify({"items": items_list}), 200  # Return data in a consistent structure

@bp.route('/credentials', methods=['POST'])
def add_credentials():
    data = request.json
    # name = data.get('name')
    print("Adding item: ", data)
    # if not name:
    #     return jsonify({"error": "Name is required"}), 400
    
    # item = Item(name=name)
    # db.session.add(item)
    # db.session.commit()
    return jsonify({"message": "Credentials goog", "credentials": {"id": "HALLO"}}), 201

@bp.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello, World!"}), 200
