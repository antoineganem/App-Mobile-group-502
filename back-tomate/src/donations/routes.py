from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db

# We create a Blueprint for the donations route
donations_bp = Blueprint('donations_bp', __name__)

@donations_bp.route('/donations', methods=['GET'])
def get_donations_by_student_and_type():
    # Get query parameters
    student_id = request.args.get('student_id')
    donation_type = request.args.get('type')

    if donation_type not in ["food", "clothes", "appliances"]:
        return jsonify({"error": "Invalid donation type", "type": donation_type}), 400

    # Validate required parameters
    if not student_id or not donation_type:
        return jsonify({"error": "Missing required parameters: student_id and type"}), 400

    # SQL query to find donations by student ID and type
    query = """
    SELECT d.id, d.created_at, d.hours, d.name, d.img, d.due_date,
           json_agg(json_build_object(
               'id', p.id,
               'unity', p.unity,
               'quantity', p.quantity,
               'object', o.object
           )) AS packages
    FROM donations d
    JOIN hours_donations sd ON d.id = sd.id_donation AND sd.id_student != %s
    LEFT JOIN packages p ON d.id = p.id_donation
    LEFT JOIN objects o ON o.id = p.id_obj 
    WHERE d.type = %s
    GROUP BY d.id;
    """

    # Execute the query with student_id and donation_type as parameters
    results = fetch_db(query, (student_id, donation_type))

    # Return the results as JSON
    return jsonify(results), 200


# Endpoint to create a new donation
@donations_bp.route('/donations', methods=['POST'])
def create_donation():
    # Get the JSON data from the request
    data = request.json

    # Check if the required fields are present
    if 'hours' not in data or 'name' not in data or 'img' not in data or 'due_date' not in data or 'type' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract the fields from the JSON data
    hours = data['hours']
    name = data['name']
    img = data['img']
    due_date = data['due_date']
    donation_type = data['type']

    # SQL query to insert a new donation
    query = """
    INSERT INTO donations (hours, name, img, due_date, type) 
    VALUES (%s, %s, %s, %s, %s) RETURNING *;
    """

    # Execute the query
    results = fetch_db(query, (hours, name, img, due_date, donation_type))

    # Return the newly created donation as JSON
    return jsonify(results), 201

# Endpoint to update an existing donation
@donations_bp.route('/donations', methods=['PUT'])
def update_donation():
    # Get the JSON data from the request
    data = request.json

    id = request.args.get('id')
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Check if the required fields are present
    if 'hours' not in data or 'name' not in data or 'img' not in data or 'due_date' not in data or 'type' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract the fields from the JSON data
    hours = data['hours']
    name = data['name']
    img = data['img']
    due_date = data['due_date']
    donation_type = data['type']

    # SQL query to update a donation
    query = """
    UPDATE donations 
    SET hours = %s, name = %s, img = %s, due_date = %s, type = %s 
    WHERE id = %s RETURNING *;
    """

    # Execute the query
    results = fetch_db(query, (hours, name, img, due_date, donation_type, id))

    # Return the updated donation as JSON
    return jsonify(results), 200

# Endpoint to partially update a donation
@donations_bp.route('/donations', methods=['PATCH'])
def partial_update_donation():
    # Get the JSON data from the request
    data = request.json

    id = request.args.get('id')
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Extract the fields from the JSON data
    hours = data.get('hours')
    name = data.get('name')
    img = data.get('img')
    due_date = data.get('due_date')
    donation_type = data.get('type')

    # SQL query to partially update a donation with COALESCE to retain existing values if not provided
    query = """
    UPDATE donations 
    SET hours = COALESCE(%s, hours), 
        name = COALESCE(%s, name), 
        img = COALESCE(%s, img), 
        due_date = COALESCE(%s, due_date), 
        type = COALESCE(%s, type) 
    WHERE id = %s RETURNING *;
    """

    # Execute the query
    results = fetch_db(query, (hours, name, img, due_date, donation_type, id))

    # Return the updated donation as JSON
    return jsonify(results), 200

# Endpoint to delete a donation
@donations_bp.route('/donations', methods=['DELETE'])
def delete_donation():
    id = request.args.get('id')
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # SQL query to delete a donation
    query = "DELETE FROM donations WHERE id = %s RETURNING *;"

    # Execute the query
    results = fetch_db(query, (id,))

    # Return a 204 No Content response if deletion was successful
    return jsonify(results), 204
