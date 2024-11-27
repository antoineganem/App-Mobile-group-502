from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db, execute_db
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

# We create a Blueprint for the activities route
user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/sign-up', methods=['POST', 'OPTIONS'])
def createUser():
    if request.method == 'OPTIONS':
        return jsonify({"status": "preflight check"}), 200  # For CORS preflight requests
    data = request.json
    name = data['name']
    email = data['email']
    password_hash = data['password_hash']
    is_student = data['isStudent']

    if not name or not email or not password_hash or is_student is None:
        return jsonify({"error": "Missing required fields"}), 400
    
    is_admin= False
    if not is_student:
        results = fetch_db("SELECT * FROM authorized_admins WHERE email = %s", (email,))
        if len(results) > 0 :
            is_admin = True

    type_account = "student" if is_student else "admin" if is_admin else "user"

    results = fetch_db("SELECT * FROM users WHERE email = %s", (email,))
    if len(results) > 0:
        return jsonify({"error": "El email ya esta registrado"}), 400

    if type_account == "student":
        enrollment_num = data['enrollmentNum']
        if not enrollment_num:
            return jsonify({"error": "Missing enrollment_number(matricula)"}), 400
        results = fetch_db("SELECT * FROM students WHERE enrollment_number = %s", (enrollment_num,))
        if len(results) > 0:
            return jsonify({"error": "El número de matrícula ya esta registrado"}), 400

    query = "INSERT INTO users (name, email, password_hash, type_account) VALUES (%s, %s, %s, %s) RETURNING id"

    results = fetch_db(query, (name, email, password_hash, type_account))

    if type_account == "student":
        query = "INSERT INTO students (user_id, enrollment_number) VALUES (%s, %s)"
        execute_db(query, (results[0]['id'],enrollment_num))

    return jsonify({"message": "User created successfully"}), 201

@user_bp.route('/getUser', methods=['GET'])
def get_user():

    user_id = request.args.get('user_id')

    if  not user_id : 
        return jsonify({"error": "Missing id"}), 400

    query = "SELECT * FROM users WHERE id = %s"
    results = fetch_db(query, (user_id,)) 

    if not results:
        return jsonify({"error": "User not found"}), 404

    user = results[0]

    return jsonify({"user": user}), 200

@user_bp.route('/users/log-in', methods=['POST'])
def log_in():
    data = request.json
    email = data['email']
    password = data['password']

 

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Use parentheses around (email,) to pass it as a tuple, necessary for psycopg2
    results = fetch_db("SELECT * FROM users WHERE email = %s", (email,))
    
    if len(results) == 0:
        return jsonify({"error": "Usuario no registrado"}), 400
    
    
    if not bcrypt.check_password_hash(results[0]['password_hash'], password):
        return jsonify({"error": "Contraseña incorrecta"}), 400
    
    return jsonify({"message": "Log ok", "accountType":results[0]["type_account"]}), 200

@user_bp.route('/users', methods=['GET']) 

# Endpoint to search for activities the student is not involved in
@user_bp .route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello, World!"}), 200

@user_bp.route('/users/authorize', methods=['POST'])
def authorize_user():
    data = request.json
    email = data['email']
    
    print(email)
    if not email :
        return jsonify({"error": "Missing required fields"}), 400

    results = fetch_db("SELECT * FROM users WHERE email = %s AND type_account = 'user'", (email,))
    
    if len(results) == 0:
        return jsonify({"error": "Usuario no registrado"}), 400

    query = "INSERT INTO authorized_admins (email) VALUES (%s)"
    query_set_admin = "UPDATE users SET type_account = 'admin' WHERE email = %s AND type_account = 'user'"

    
    res=execute_db(query, (email,))
    res2=execute_db(query_set_admin, (email,))


    print(res2)

    return jsonify({"message": "Log ok"}), 200