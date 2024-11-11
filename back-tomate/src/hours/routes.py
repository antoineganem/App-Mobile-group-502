from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db, execute_db
from datetime import datetime

app = Flask(__name__)

# We create a Blueprint for the activities route
hours_bp = Blueprint('hours_bp', __name__)

# Endpoint to search for activities the student is not involved in
@hours_bp .route('/student/total_hours', methods=['GET'])
def search_student():
    # Get query parameters (e.g., /search?query=example&limit=5)
    student_id = request.args.get('student_id')

    if not student_id:
        return jsonify({"error": "Missing student_id parameter"}), 400


       # Query to get total hours from activities and donations
    query_total_hours = """
    SELECT 
      (SELECT SUM(hours) FROM hours_activities WHERE id_student = %s) +
      (SELECT SUM(hours) FROM hours_donations WHERE id_student = %s) AS total_hours;
    """
    
    # Execute total hours query
    total_hours_result = fetch_db(query_total_hours, (student_id, student_id))
    total_hours = total_hours_result[0]["total_hours"] 

    # Query to find activities the student is involved in
    query_activities = """
    SELECT A.id, A.hours, A.description, A.date 
    FROM activities A 
    JOIN hours_activities HA ON A.id = HA.id_activity 
    WHERE HA.id_student = %s;
    """
    
    # Execute activities query
    activities_result = fetch_db(query_activities, (student_id,))
  
    # Query to find donations the student is involved in
    query_donations = """
    SELECT D.id, D.hours, D.name, D.due_date 
    FROM donations D 
    JOIN hours_donations HD ON D.id = HD.id_donation 
    WHERE HD.id_student = %s;
    """

    # Execute donations query
    donations_result = fetch_db(query_donations, (student_id,))
  

    # Construct the response
    response = {
        "total_hours": total_hours,
        "activities": activities_result,
        "donations": donations_result
    }

    # Return the results as JSON
    return jsonify(response),200

# Endpoint to get all the students involved in an activity
@hours_bp .route('/event/activity', methods=['GET'])
def search_activity_event():
    # Get query parameters (e.g., /search?query=example&limit=5)
    activity_id = request.args.get('activity_id')

    if not activity_id:
        return jsonify({"error": "Missing activity_id parameter"}), 400

    # SQL query to find students involved in the activity
    query = """
    SELECT S.id, U.name, U.email, HA.hours, HA.status
    FROM students S
    JOIN hours_activities HA ON S.id = HA.id_student
    JOIN users U ON S.user_id = U.id
    WHERE HA.id_activity = %s;
    """

    # Execute the query with the activity_id as a parameter
    results = fetch_db(query, (activity_id,))

    # Return the results as JSON
    return jsonify(results), 200

# Endpoint to get all the students involved in a donation
@hours_bp .route('/event/donation', methods=['GET'])
def search_donation_event():
    # Get query parameters (e.g., /search?query=example&limit=5)
    donation_id = request.args.get('donation_id')

    if not donation_id:
        return jsonify({"error": "Missing donation_id parameter"}), 400

    # SQL query to find students involved in the donation
    query = """
    SELECT S.id, U.name, U.email, HD.hours, HD.status
    FROM students S
    JOIN hours_donations HD ON S.id = HD.id_student
    JOIN users U ON S.user_id = U.id
    WHERE HD.id_donation = %s;
    """

    # Execute the query with the donation_id as a parameter
    results = fetch_db(query, (donation_id,))

    # Return the results as JSON
    return jsonify(results), 200

# Endpoint to patch the status of a student's hours in an event
@hours_bp.route('/student/update_status', methods=['PATCH'])
def update_status():
    # Get the JSON data from the request
    data = request.json

    student_id = data.get('student_id')
    event_id = data.get('event_id')
    event_type = data.get('event_type')
    status = data.get('status')

    # Check for missing fields
    if student_id is None or event_id is None or event_type is None or status is None:
        return jsonify({"error": "Missing required fields"}), 400

    # Validate event type
    if event_type not in ["activity", "donation"]:
        return jsonify({"error": "Invalid event type"}), 400

    # Determine the database table based on event type
    event_db = "hours_activities" if event_type == "activity" else "hours_donations"

    # Get the current timestamp
    update_timestamp = datetime.now()

    # Define the query using placeholders for parameters
    query = f"UPDATE {event_db} SET status = %s, updated_at = %s WHERE id_student = %s AND id_{event_type} = %s;"

    # Execute the query with parameterized values to prevent SQL injection
    try:
        # Assuming fetch_db is set up to accept parameterized queries
        results = execute_db(query, (status, update_timestamp, student_id, event_id))
    except Exception as e:
        return jsonify({"error": str(e), "query":query}), 500

    # Return the result
    return jsonify({"message": "Status updated successfully"}), 200


