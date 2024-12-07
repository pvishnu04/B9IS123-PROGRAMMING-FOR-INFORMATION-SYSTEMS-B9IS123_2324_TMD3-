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

    except pg8000.DatabaseError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error, please try again later"}), 500
    except Exception as e:

        app.logger.error(f"Unexpected error: {e}")
        app.logger.error(traceback.format_exc())  
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Missing required fields"}), 400
        conn = get_db_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        if user:
            session['username'] = user[1]  # Store username in session
            session['role'] = user[3]      # Store role in session

            if user[3] == 'admin':
                return jsonify({"message": "Login successful. Redirecting to Admin Dashboard."}), 200
            elif user[3] == 'pharmacist':
                return jsonify({"message": "Login successful. Redirecting to Pharmacist Dashboard."}), 200
            elif user[3] == 'user':
                return jsonify({"message": "Login successful. Redirecting to User Dashboard."}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except pg8000.DatabaseError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error, please try again later"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        app.logger.error(traceback.format_exc())  # Print full stack trace for debugging
        return jsonify({"error": "An unexpected error occurred"}), 500
@app.route('/admin/medicines', methods=['POST'])
def add_medicine():
    if 'username' in session and session['role'] == 'admin':
        try:
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            availability = data.get('availability')

            if not name or not price or not availability:
                return jsonify({"error": "Missing required fields"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()

            query = """
                INSERT INTO medicines (name, description, price, availability)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (name, description, price, availability))
            conn.commit()

            cursor.close()
            conn.close()
            return jsonify({"message": "Medicine added successfully"}), 201
        except Exception as e:
            app.logger.error(f"Error adding medicine: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403
@app.route('/admin/medicines', methods=['GET'])
def view_medicines():
    if 'username' in session and session['role'] == 'admin':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "SELECT * FROM medicines"
            cursor.execute(query)
            medicines = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify({"medicines": medicines}), 200
        except Exception as e:
            app.logger.error(f"Error viewing medicines: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403
    
@app.route('/admin/medicines/<int:id>', methods=['PUT'])
def update_medicine(id):
    if 'username' in session and session['role'] == 'admin':
        try:
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')
            price = data.get('price')
            availability = data.get('availability')

            if not name or not price or not availability:
                return jsonify({"error": "Missing required fields"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()
             query = """
                UPDATE medicines SET name = %s, description = %s, price = %s, availability = %s
                WHERE id = %s
            """
            cursor.execute(query, (name, description, price, availability, id))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "Medicine updated successfully"}), 200
        except Exception as e:
            app.logger.error(f"Error updating medicine: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403
    
@app.route('/admin/medicines/<int:id>', methods=['DELETE'])
def delete_medicine(id):
    if 'username' in session and session['role'] == 'admin':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "DELETE FROM medicines WHERE id = %s"
            cursor.execute(query, (id,))
            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Medicine deleted successfully"}), 200
        except Exception as e:
            app.logger.error(f"Error deleting medicine: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403

@app.route('/admin/orders', methods=['GET'])
def view_orders():
    if 'username' in session and session['role'] == 'admin':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            query = "SELECT * FROM orders"
            cursor.execute(query)
            orders = cursor.fetchall()

            cursor.close()
            conn.close()

            return jsonify({"orders": orders}), 200
        except Exception as e:
            app.logger.error(f"Error viewing orders: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403

@app.route('/admin/orders/<int:id>', methods=['PUT'])
def update_order(id):
    if 'username' in session and session['role'] == 'admin':
        try:
            data = request.get_json()
            status = data.get('status')

            if not status:
                return jsonify({"error": "Missing required fields"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()

            query = """
                UPDATE orders SET status = %s WHERE id = %s
            """
            cursor.execute(query, (status, id))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "Order updated successfully"}), 200
        except Exception as e:
            app.logger.error(f"Error updating order: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403

@app.route('/admin/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    if 'username' in session and session['role'] == 'admin':
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            query = "DELETE FROM orders WHERE id = %s"
            cursor.execute(query, (id,))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "Order deleted successfully"}), 200
        except Exception as e:
            app.logger.error(f"Error deleting order: {e}")
            app.logger.error(traceback.format_exc())
            return jsonify({"error": "An unexpected error occurred"}), 500
    return jsonify({"error": "Access denied"}), 403

if __name__ == '__main__':
    app.run(debug=True)
