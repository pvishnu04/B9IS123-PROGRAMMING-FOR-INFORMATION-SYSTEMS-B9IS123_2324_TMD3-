from flask import Blueprint, request, jsonify
from models import db, Product

pharmacy_bp = Blueprint('pharmacy', __name__)

@pharmacy_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])
