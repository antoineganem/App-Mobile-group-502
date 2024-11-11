from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db

app = Flask(__name__)

# We create a Blueprint for the activities route
user_bp = Blueprint('user_bp', __name__)

# Endpoint to search for activities the student is not involved in
@user_bp .route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello, World!"}), 200