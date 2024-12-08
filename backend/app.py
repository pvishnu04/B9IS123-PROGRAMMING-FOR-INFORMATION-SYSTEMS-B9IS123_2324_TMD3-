import os
import pg8000
import hashlib
import traceback
from flask_cors import CORS
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
from flask import Flask, render_template,jsonify, redirect, url_for, request, session
from datetime import datetime 
import logging
logging.basicConfig(level=logging.DEBUG)
from flask_login import current_user
from decimal import Decimal

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
app.secret_key = 'vishnu'
app.secret_key = os.environ.get('SECRET_KEY', 'fallback_secret_key')

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+pg8000://postgres:admin@localhost/Pharmacy'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

def get_db_connection():
    return pg8000.connect(user="postgres", password="admin", host="localhost", database="Pharmacy")
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', back_populates='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'orders': [order.to_dict() for order in self.orders]
        }
class Medicine(db.Model):
    __tablename__ = 'medicine'  
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    order_items = db.relationship('OrderItem', back_populates='medicine', primaryjoin='Medicine.id == OrderItem.medicine_id')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': str(self.price),
            'stock_quantity': self.stock_quantity,
            'created_at': self.created_at.isoformat()
        }
class Order(db.Model):  # Renamed to match the relationship reference
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'canceled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='orders')
    order_items = db.relationship('OrderItem', backref='order_ref', cascade='all, delete', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': str(self.total_amount),
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'order_items': [item.to_dict() for item in self.order_items]
        }
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'))
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicine.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)  # Price at the time of the order

    order = db.relationship('Order', back_populates='order_items')
    medicine = db.relationship('Medicine', back_populates='order_items')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'quantity': self.quantity,
            'price': str(self.price),
            'total_price': str(self.price * self.quantity)
        }
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Query the User table
    user = User.query.filter_by(username=username, password=password).first()

    if user:
        return jsonify({"message": "Login successful", "role": user.role}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        username = data.get('username')
        password = data.get('password')
        role = data.get('role')
        email = data.get('email')

        if not username or not password or not role or not email:
            return jsonify({"error": "Missing required fields"}), 400
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO users (username, password, role, email)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (username, password, role, email))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201

    except psycopg2.DatabaseError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error, please try again later"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        app.logger.error(traceback.format_exc())  
        return jsonify({"error": "An unexpected error occurred"}), 500

    @app.route('/admin/medicines', methods=['GET'])
    def get_medicines():
        medicines = Medicine.query.all()
        return jsonify(medicines=[medicine.to_dict() for medicine in medicines])

    @app.route('/api/medicines', methods=['GET'])
    def get_medicine():
        medicines = Medicine.query.all()
        return jsonify(medicines=[medicine.to_dict() for medicine in medicines])

@app.route('/admin/medicines', methods=['GET'])
def add_medicine():
    try:
        data = request.json
        # Ensure data is present and valid
        if not data.get('name') or not data.get('description') or data.get('price') is None or data.get('stock_quantity') is None:
            return jsonify({"error": "Missing required fields"}), 400

        new_medicine = Medicine(
            name=data['name'],
            description=data['description'],
            price=data['price'],  # Should be a float
            stock_quantity=data['stock_quantity']  # Should be an integer
        )
        db.session.add(new_medicine)
        db.session.commit()
        return jsonify({"message": "Medicine added successfully"}), 201
    except Exception as e:
        logging.error(f"Error adding medicine: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/admin/medicines/<int:id>', methods=['PUT'])
def update_medicine(id):
    data = request.json
    medicine = Medicine.query.get_or_404(id)
    medicine.name = data['name']
    medicine.description = data['description']
    medicine.price = data['price']
    medicine.stock_quantity = data['stock_quantity']
    db.session.commit()
    return jsonify(message="Medicine updated successfully")

@app.route('/admin/medicines/<int:id>', methods=['DELETE'])
def delete_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    db.session.delete(medicine)
    db.session.commit()
    return jsonify(message="Medicine deleted successfully")

@login_required
@app.route('/check-session', methods=['GET'])
def check_session():
    if current_user.is_authenticated and current_user.role == 'admin':
        return jsonify({"message": "Session active"}), 200
    return jsonify({"error": "Access denied"}), 403

@app.route('/admin/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        print(f"Fetched Orders: {orders}")  # Log the fetched orders
        orders_list = [{
            'id': order.id,
            'user_id': order.user_id,
            'total_amount': str(order.total_amount),
            'status': order.status,
            'created_at': order.created_at.isoformat()
        } for order in orders]
        return jsonify({'orders': orders_list}), 200
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return jsonify({'error': 'Error fetching orders'}), 500

@app.route('/admin/orders/<int:id>', methods=['PUT'])
def update_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        status = request.json.get('status')
        if status:
            order.status = status
            db.session.commit()
            return jsonify({'message': 'Order updated successfully'}), 200
        else:
            return jsonify({'error': 'No status provided'}), 400
    except Exception as e:
        return jsonify({'error': 'Error updating order'}), 500

@app.route('/admin/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    if 'username' in session and session['role'] == 'admin':
        try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"message": "Order not found"}), 404

        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting order: {str(e)}"}), 500

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    selected_medicines = data.get('selected_medicines', [])
    total_amount = 0

    for item in selected_medicines:
        medicine_id = item['medicine_id']
        quantity = int(item['quantity'])  # Ensure quantity is an integer
        medicine = Medicine.query.get(medicine_id)
        if medicine:
            # Convert price to float and calculate total
            total_amount += float(medicine.price) * quantity

    order = Order(total_amount=total_amount)
    db.session.add(order)
    db.session.commit()

    return jsonify({'message': 'Order placed successfully', 'total_amount': total_amount}), 201

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the pharmacy app"}), 200

if __name__ == '__main__':
    app.run(debug=True)
