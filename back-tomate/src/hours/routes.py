from flask import Flask, request, jsonify, Blueprint
from ..helper_functions.fetch_db import fetch_db

app = Flask(__name__)

# We create a Blueprint for the activities route
hours_bp = Blueprint('hours_bp', __name__)

# Endpoint to search for activities the student is not involved in
@hours_bp .route('/student/total_hours', methods=['GET'])
def search():
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
