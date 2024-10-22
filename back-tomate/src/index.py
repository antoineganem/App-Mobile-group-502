from flask import Flask, jsonify, request
from flaskr.db import get_db, close_db

app = Flask(__name__)

incomes = [
    { 'description': 'salary', 'amount': 510120 }
]


@app.route('/incomes')
def get_incomes():
    return jsonify(incomes)
