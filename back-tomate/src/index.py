from flask import Flask, jsonify, request
from flaskr.db import get_db, close_db

app = Flask(__name__)

incomes = [
    { 'description': 'salary', 'amount': 510120 }
]


@app.route('/incomes')
def get_incomes():
    return jsonify(incomes)

@app.route('/users')
def get_users():
    db = get_db()
    cursor = db.cursor()

    # Execute a query to fetch all users from the 'users' table
    cursor.execute("SELECT * FROM test")
    users = cursor.fetchall()

    # Return the results as JSON
    return jsonify(users)