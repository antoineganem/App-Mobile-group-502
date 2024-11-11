from flask import Flask, jsonify, request
from flaskr.db import get_db, close_db
from .activities.routes import activities_bp
from .hours.routes import hours_bp
from .donations.routes import donations_bp
from .cart.routes import cart_bp
from .auth.routes import login_bp

app = Flask(__name__)

app.secret_key = "super_secret_key"  # Make sure this is set in production
app.config['SESSION_TYPE'] = 'filesystem'

app.register_blueprint(activities_bp)
app.register_blueprint(hours_bp)
app.register_blueprint(donations_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(login_bp)

if __name__ == '__main__':
    app.run(debug=True)
