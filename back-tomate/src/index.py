from flask import Flask, jsonify, request
from flask_cors import CORS
from flaskr.db import get_db, close_db
from .activities.routes import activities_bp
from .hours.routes import hours_bp
from .donations.routes import donations_bp
from .users.routes import user_bp
from .cart.routes import cart_bp

app = Flask(__name__)
incomes = [
    { 'description': 'salary', 'amount': 510120 }
]


@app.route('/incomes')
def get_incomes():
    return jsonify(incomes)

#Example of fetching to the test table in the SupaBase


app.register_blueprint(activities_bp)
app.register_blueprint(hours_bp)
app.register_blueprint(donations_bp)
app.register_blueprint(user_bp)
app.register_blueprint(cart_bp)
CORS(app) 


if __name__ == '__main__':
    app.run(debug=True)
