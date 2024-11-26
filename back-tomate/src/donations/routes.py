from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db, execute_db, execute_batch

# We create a Blueprint for the donations route
donations_bp = Blueprint('donations_bp', __name__)

@donations_bp.route('/donations', methods=['GET'])
def get_donations_by_student_and_type():
    # Get query parameters
    student_id = request.args.get('student_id')
    donation_type = request.args.get('type')

    # Validate required parameters
    if not student_id or not donation_type:
        return jsonify({"error": "Missing required parameters: student_id and type"}), 400

    # Validate donation type
    valid_types = ["food", "clothes", "appliances", "all"]
    if donation_type not in valid_types:
        return jsonify({
            "error": "Invalid donation type. Choose between food, clothes, appliances, or all",
            "type": donation_type
        }), 400

    # SQL query to find donations
    query = """
    SELECT d.id as donation_id, d.created_at, d.hours, d.name, d.img, d.due_date,
           COALESCE(packages.packages, '[]'::json) AS packages
    FROM donations d
    LEFT JOIN (
        SELECT p.id_donation,
               json_agg(
                   json_build_object(
                       'package_id', p.id,
                       'unity', p.unity,
                       'quantity', p.quantity,
                       'object', o.object
                   )
               ) AS packages
        FROM packages p
        LEFT JOIN objects o ON o.id = p.id_obj
        GROUP BY p.id_donation
    ) AS packages ON d.id = packages.id_donation
    WHERE d.id NOT IN (
          SELECT id_donation
          FROM hours_donations
          WHERE id_student = %s
    )
    """
    
    # Add type filter if the type is not "all"
    if donation_type != "all":
        query += " AND d.type = %s"

    # Execute the query with parameters
    params = (student_id,)
    if donation_type != "all":
        params += (donation_type,)

    results = fetch_db(query, params)

    # Return the results as JSON
    return jsonify(results), 200

@donations_bp.route('/donations', methods=['POST'])
def create_donation():
    # Get the JSON data from the request
    data = request.json

    # Check if the required fields are present
    if 'hours' not in data or 'name' not in data or 'img' not in data or 'due_date' not in data or 'type' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract fields
    hours = data['hours']
    name = data['name']
    img = data['img']
    due_date = data['due_date']
    donation_type = data['type']
    packages = data.get('packages', [])

    # Insert the new donation and get the donation_id
    query = """
    INSERT INTO donations (hours, name, img, due_date, type) 
    VALUES (%s, %s, %s, %s, %s) RETURNING id;
    """
    donation_id = fetch_db(query, (hours, name, img, due_date, donation_type))[0]['id']

    # Collect unique package objects
    unique_objects = {package['object'] for package in packages}

    # Batch insert new objects
    object_query = "INSERT INTO objects (object) VALUES (%s) ON CONFLICT (object) DO NOTHING;"
    execute_batch(object_query, [(obj,) for obj in unique_objects])

    # Map object names to IDs in one query
    objects_query = "SELECT id, object FROM objects WHERE object IN %s"
    object_mapping = {row['object']: row['id'] for row in fetch_db(objects_query, (tuple(unique_objects),))}

    # Prepare package data for batch insertion
    package_values = [
        (donation_id, package['unity'], package['quantity'], object_mapping[package['object']])
        for package in packages
    ]

    # Batch insert packages
    package_query = """
    INSERT INTO packages (id_donation, unity, quantity, id_obj) 
    VALUES (%s, %s, %s, %s)
    """
    execute_batch(package_query, package_values)

    return jsonify({"id": donation_id}), 201


@donations_bp.route('/donations', methods=['PUT'])
def update_donation():
    data = request.json
    id = request.args.get('id')

    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    if 'hours' not in data or 'name' not in data or 'img' not in data or 'due_date' not in data or 'type' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract fields
    hours = data['hours']
    name = data['name']
    img = data['img']
    due_date = data['due_date']
    donation_type = data['type']
    packages = data.get('packages', [])

    # Update the donation
    update_query = """
    UPDATE donations 
    SET hours = %s, name = %s, img = %s, due_date = %s, type = %s 
    WHERE id = %s RETURNING id;
    """
    execute_db(update_query, (hours, name, img, due_date, donation_type, id))

    # Delete existing packages in one query
    delete_query = "DELETE FROM packages WHERE id_donation = %s;"
    execute_db(delete_query, (id,))

    # Insert new packages in batch
    if packages:
        # Insert unique objects for packages
        unique_objects = {package['object'] for package in packages}
        object_query = "INSERT INTO objects (object) VALUES (%s) ON CONFLICT (object) DO NOTHING;"
        execute_batch(object_query, [(obj,) for obj in unique_objects])

        # Get object IDs
        objects_query = "SELECT id, object FROM objects WHERE object IN %s"
        object_mapping = {row['object']: row['id'] for row in fetch_db(objects_query, (tuple(unique_objects),))}

        # Prepare package data
        package_values = [
            (id, package['unity'], package['quantity'], object_mapping[package['object']])
            for package in packages
        ]
        
        # Batch insert packages
        package_query = """
        INSERT INTO packages (id_donation, unity, quantity, id_obj) 
        VALUES (%s, %s, %s, %s)
        """
        execute_batch(package_query, package_values)

    return jsonify({"id": id}), 200


# Endpoint to partially update a donation
@donations_bp.route('/donations', methods=['PATCH'])
def partial_update_donation():
    # Get the JSON data from the request
    data = request.json
    id = request.args.get('id')

    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Extract fields to update if provided
    hours = data.get('hours')
    name = data.get('name')
    img = data.get('img')
    due_date = data.get('due_date')
    donation_type = data.get('type')
    packages = data.get('packages', [])

    # Update only the provided fields using COALESCE
    query = """
    UPDATE donations 
    SET hours = COALESCE(%s, hours), 
        name = COALESCE(%s, name), 
        img = COALESCE(%s, img), 
        due_date = COALESCE(%s, due_date), 
        type = COALESCE(%s, type) 
    WHERE id = %s RETURNING id;
    """
    result = execute_db(query, (hours, name, img, due_date, donation_type, id))
    if result:
        return result  # Return error response if an error occurred

    # If packages are provided, update them
    if packages:
        # Delete existing packages for the donation in one batch
        delete_query = "DELETE FROM packages WHERE id_donation = %s;"
        result = execute_db(delete_query, (id,))
        if result:
            return result  # Return error response if an error occurred

        # Prepare for batch insertion of new packages
        # Insert unique objects for packages
        unique_objects = {package['object'] for package in packages}
        object_query = "INSERT INTO objects (object) VALUES (%s) ON CONFLICT (object) DO NOTHING;"
        execute_batch(object_query, [(obj,) for obj in unique_objects])

        # Get object IDs in a single query
        objects_query = "SELECT id, object FROM objects WHERE object IN %s"
        object_mapping = {row['object']: row['id'] for row in fetch_db(objects_query, (tuple(unique_objects),))}

        # Prepare package data
        package_values = [
            (id, package['unity'], package['quantity'], object_mapping[package['object']])
            for package in packages
        ]
        
        # Batch insert packages
        package_query = """
        INSERT INTO packages (id_donation, unity, quantity, id_obj) 
        VALUES (%s, %s, %s, %s)
        """
        execute_batch(package_query, package_values)

    return jsonify({"id": id}), 200

# Endpoint to delete a donation
@donations_bp.route('/donations', methods=['DELETE'])
def delete_donation():
    id = request.args.get('id')
    if not id:
        return jsonify({"error": "Missing id query parameter"}), 400

    # Delete related entries and donation in a single transaction
    delete_related_query = """
    DELETE FROM hours_donations WHERE id_donation = %s;
    DELETE FROM packages WHERE id_donation = %s;
    DELETE FROM donations WHERE id = %s RETURNING *;
    """
    results = fetch_db(delete_related_query, (id, id, id))

    return jsonify(results), 204
