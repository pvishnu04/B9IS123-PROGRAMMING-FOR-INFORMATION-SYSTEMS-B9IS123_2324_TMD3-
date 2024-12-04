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
