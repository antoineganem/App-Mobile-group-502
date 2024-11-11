from flask import Flask, request, jsonify, Blueprint, redirect, session, url_for
import requests
import base64
import hashlib
import os

app = Flask(__name__)
app.secret_key = "super_secret_key"  # Use a secure key in production
login_bp = Blueprint('login_bp', __name__)

# Auth0 Configuration
AUTH0_DOMAIN = "dev-7h8wa2ewzisofb0k.us.auth0.com"
CLIENT_ID = "NXtiX6vcLLbinXbf29HzqULrKzcHmoRK"
CLIENT_SECRET = "M8BijFhBqpOaVV-Prj8xhqnT70ydX39XeuG_ss6uZE5-y8xEKB2BzF5YTTlwL78x"
AUDIENCE = f"https://{AUTH0_DOMAIN}/api/v2/"
REDIRECT_URI = "http://localhost:5000/callback"  # Replace with your callback URL

# Helper functions for PKCE
def generate_code_verifier():
    return base64.urlsafe_b64encode(os.urandom(40)).rstrip(b'=').decode('utf-8')

def generate_code_challenge(code_verifier):
    code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode('utf-8')


# Start login and initiate PKCE flow
@login_bp.route('/start-login')
def start_login():
    # Generate code_verifier and code_challenge
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    session['code_verifier'] = code_verifier  # Store for later use in the callback

    # Redirect to Auth0's authorization URL with the PKCE challenge
    auth_url = (
        f"https://{AUTH0_DOMAIN}/authorize?"
        f"audience={AUDIENCE}&"
        f"response_type=code&"
        f"client_id={CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"scope=openid profile email&"
        f"code_challenge={code_challenge}&"
        f"code_challenge_method=S256"
    )
    return redirect(auth_url)

# Callback to exchange authorization code for tokens
@login_bp.route('/callback', methods=['POST'])
def callback():
    # Get the authorization code from the request body
    code = request.json.get("code")
    code_verifier = session.get('code_verifier')  # Retrieve stored code_verifier

    if not code or not code_verifier:
        return jsonify({"error": "Authorization code or verifier missing"}), 400

    # Exchange the authorization code for access and ID tokens
    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    token_payload = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "code_verifier": code_verifier  # Send the code_verifier here
    }
    token_headers = {'content-type': "application/json"}
    token_response = requests.post(token_url, json=token_payload, headers=token_headers)
    
    if token_response.status_code == 200:
        tokens = token_response.json()
        session['access_token'] = tokens.get("access_token")
        session['id_token'] = tokens.get("id_token")
        return jsonify({"message": "Login successful", "tokens": tokens})
    else:
        return jsonify({"error": "Token exchange failed"}), token_response.status_code

# Protected route example
@login_bp.route('/protected')
def protected():
    access_token = session.get('access_token')
    if not access_token:
        return jsonify({"error": "Access token is missing. Please log in first."}), 401

    headers = {"Authorization": f"Bearer {access_token}"}
    user_info_url = f"https://{AUTH0_DOMAIN}/userinfo"
    user_info_response = requests.get(user_info_url, headers=headers)
    return jsonify(user_info_response.json())

def get_auth0_token():
    token_url = f"https://{AUTH0_DOMAIN}/oauth/token"
    token_payload = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "audience": AUDIENCE
    }
    token_headers = {'content-type': "application/json"}
    token_response = requests.post(token_url, json=token_payload, headers=token_headers)
    
    if token_response.status_code == 200:
        return token_response.json().get("access_token")
    else:
        return None

# User creation endpoint as previously defined
@login_bp.route('/create_user', methods=['POST'])
def create_user():
    token = get_auth0_token()
    if not token:
        return jsonify({"error": "Unable to get token"}), 500

    url = f"https://{AUTH0_DOMAIN}/api/v2/users"
    headers = {
        "Authorization": f"Bearer {token}",
        "content-type": "application/json"
    }
    user_data = {
        "email": request.json.get("email"),
        "password": request.json.get("password"),
        "connection": "Username-Password-Authentication"
    }
    response = requests.post(url, json=user_data, headers=headers)
    return jsonify(response.json()), response.status_code
