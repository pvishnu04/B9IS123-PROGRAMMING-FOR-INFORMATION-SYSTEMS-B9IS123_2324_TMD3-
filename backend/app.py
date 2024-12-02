from flask import Flask, jsonify, request, session
import pg8000
import hashlib
import traceback
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # For session management (change this)
CORS(app)
