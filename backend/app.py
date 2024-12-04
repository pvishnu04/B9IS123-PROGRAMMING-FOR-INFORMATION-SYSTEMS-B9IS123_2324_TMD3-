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
        username = data.get('username')
        password = data.get('password')
        role = data.get('role')
        email = data.get('email')

        if not username or not password or not role or not email:
            return jsonify({"error": "Missing required fields"}), 400
