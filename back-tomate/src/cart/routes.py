from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db, execute_batch

app = Flask(__name__)

# We create a Blueprint for the activities route
cart_bp = Blueprint('cart_bp', __name__)

# Endpoint to search for activities the student is not involved in
@cart_bp.route('/cart', methods=['POST'])
def create():
    # Get the JSON data from the request
    student_id = request.args.get('student_id')
    data = request.json

    # Check if the required fields are present
    if student_id is None or not data:
        return jsonify({"error": "Missing required fields"}), 400

    # Extract the fields from the JSON data
    activities_ids = data.get('activities_ids', [])
    donations_ids = data.get('donations_ids', [])

    # Check if ids are not empty 
    if not activities_ids and not donations_ids:
        return jsonify({"error": "Missing required fields"}), 400
    

    donation_hours= {}

    # Check if each id exists
    if activities_ids:
        query_check_activities = "SELECT id, hours FROM activities WHERE id IN %s"

        # Fetch hours for activities and donations in batches
        activity_hours = {row['id']: row['hours'] for row in fetch_db(query_check_activities, (tuple(activities_ids),))}
            
        for id_activity in activities_ids:
            if id_activity not in activity_hours:
                return jsonify({"error": "Activity id does not exist", "id": id_activity}), 400
        # Check if ids exist in the database
    if donations_ids:
        query_check_donations = "SELECT id, hours FROM donations WHERE id IN %s"
        donation_hours = {row['id']: row['hours'] for row in fetch_db(query_check_donations, (tuple(donations_ids),))}
        for id_donation in donations_ids:
            if id_donation not in donation_hours:
                return jsonify({"error": "Donation id does not exist", "id": id_donation}), 400

    # Validate that the total donation hours don’t exceed valid activity hours
    num_valid_activities_query = "SELECT SUM(hours) FROM hours_activities WHERE id_student = %s AND status = true;"
    num_valid_activities_hours = fetch_db(num_valid_activities_query, (student_id,))[0]["sum"] or 0
    
    num_curr_donations_query = "SELECT SUM(hours) FROM hours_donations WHERE id_student = %s;"
    num_curr_donations_hours = fetch_db(num_curr_donations_query, (student_id,))[0]["sum"] or 0

    num_new_donations_hours = sum(donation_hours[id] for id in donations_ids)

    if num_curr_donations_hours + num_new_donations_hours > num_valid_activities_hours:
        return jsonify({"error": "Hours of donations exceeds the number of valid activities"}), 400
    
    # Prepare batch inserts for activities and donations
    # Prepare batch inserts for activities and donations
    activities_insert_query = """
    INSERT INTO hours_activities (id_student, id_activity, hours)
    VALUES (%s, %s, %s)
    ON CONFLICT (id_student, id_activity) DO NOTHING;
    """
    activities_values = [(student_id, id_activity, activity_hours[id_activity]) for id_activity in activities_ids]

    donations_insert_query = """
    INSERT INTO hours_donations (id_student, id_donation, hours)
    VALUES (%s, %s, %s)
    ON CONFLICT (id_student, id_donation) DO NOTHING;
    """
    donations_values = [(student_id, id_donation, donation_hours[id_donation]) for id_donation in donations_ids]

    # Execute batch inserts
    execute_batch(activities_insert_query, activities_values)
    execute_batch(donations_insert_query, donations_values)

    # Return a success message
    return jsonify({"message": "Cart created successfully"}), 201
