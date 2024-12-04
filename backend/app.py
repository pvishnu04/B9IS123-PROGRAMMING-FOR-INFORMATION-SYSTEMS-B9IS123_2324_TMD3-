from flask import Flask, jsonify, request, session
import pg8000
import hashlib
import traceback
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # For session management (change this)
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
