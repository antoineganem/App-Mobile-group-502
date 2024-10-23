from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db

app = Flask(__name__)

# We create a Blueprint for the activities route
activities_bp = Blueprint('activities_bp', __name__)

# Endpoint to search for activities the student is not involved in
@activities_bp .route('/activities', methods=['GET'])
def search():
    # Get query parameters (e.g., /search?query=example&limit=5)
    student_id = request.args.get('student_id')

    if not student_id:
        return jsonify({"error": "Missing student_id parameter"}), 400


    # SQL query to find activities the student is not involved in
    query = """
    SELECT a.* 
    FROM activities a
    LEFT JOIN hours_activities ha ON a.id = ha.id_activity AND ha.id_student = %s
    WHERE ha.id_student IS NULL;
    """

    # Execute the query with the student_id as a parameter
    results = fetch_db(query, (student_id,))

    # Return the results as JSON
    return jsonify(results), 200

# Endpoint to create a new activity
@activities_bp.route('/activities', methods=['POST'])
def create():
    # Get the JSON data from the request
    data = request.json

    # Check if the required fields are present
    if 'name' not in data or 'description' not in data  or 'location' not in data or 'date' not in data or 'img' not in data or 'hours' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract the fields from the JSON data
    name = data['name']
    description = data['description']
    location = data['location']
    date = data['date']
    img = data['img']
    hours = data['hours']
    
    # SQL query to insert a new activity
    query = "Insert into activities (name, description, location, date, img, hours) values (%s, %s, %s, %s, %s, %s) RETURNING *;"

    # Execute the query with the name and description as parameters
    results = fetch_db(query, (name, description,location,date,img, hours))

    # Return the newly created activity as JSON
    return jsonify(results),200

@activities_bp.route('/activities', methods=['PUT'])
def update():
    # Get the JSON data from the request
    data = request.json

    id = request.args.get('id')

    #Check for the id of the student
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Check if the required fields are present
    if 'name' not in data or 'description' not in data or 'location' not in data or 'date' not in data or 'img' not in data or 'hours' not in data:
        return jsonify({"error": "Missing required fields in the request body"}), 400

    # Extract the fields from the JSON data
    name = data['name']
    description = data['description']
    location = data['location']
    date = data['date']
    img = data['img']
    hours = data['hours']
    
    # SQL query to update an activity
    query = "UPDATE activities SET name = %s, description = %s, location = %s, date = %s, img = %s, hours = %s WHERE id = %s RETURNING *;"

    # Execute the query with the name and description as parameters
    results = fetch_db(query, (name, description,location,date,img, hours, id))

    # Return the updated activity as JSON
    return jsonify(results),200

@activities_bp.route('/activities', methods=['PATCH'])
def partial_update():
    # Get the JSON data from the request
    data = request.json

    id = request.args.get('id')

    #Check for the id of the student
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Extract the fields from the JSON data
    name = data.get('name')
    description = data.get('description')
    location = data.get('location')
    date = data.get('date')
    img = data.get('img')
    hours = data.get('hours')
    
    # SQL query to update an activity
    query = "UPDATE activities SET name = COALESCE(%s, name), description = COALESCE(%s, description), location = COALESCE(%s, location), date = COALESCE(%s, date), img = COALESCE(%s, img), hours = COALESCE(%s, hours) WHERE id = %s RETURNING *;"

    # Execute the query with the name and description as parameters
    results = fetch_db(query, (name, description,location,date,img, hours, id))

    # Return the updated activity as JSON
    return jsonify(results),200

@activities_bp.route('/activities', methods=['DELETE'])
def delete():
    id = request.args.get('id')

    #Check for the id of the student
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # SQL query to delete an activity
    query = "DELETE FROM activities WHERE id = %s RETURNING *;"

    # Execute the query with the name and description as parameters
    results = fetch_db(query, (id,))

    # Return the updated activity as JSON
    return jsonify(results),204