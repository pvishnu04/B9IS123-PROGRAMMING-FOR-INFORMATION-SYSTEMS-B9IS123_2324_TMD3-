from flask import Flask, jsonify, request, session
import pg8000
import hashlib
import traceback
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'  
CORS(app)
DATABASE_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "user": "postgres",  
    "password": "admin",  
    "database": "Pharmacy"  
}
def get_db_connection():
    return pg8000.connect(**DATABASE_CONFIG)
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
    
