from flaskr.db import get_db, close_db
from flask import jsonify

def fetch_db(query, params=()):
    """
    Execute a parameterized query against the database.
    
    Args:
    - query: The SQL query to execute.
    - params: A tuple of parameters to safely pass into the query.
    
    Returns:
    - A list of rows from the query result.
    """
    db = get_db()  # Assume get_db() returns a database connection
    cursor = db.cursor()

    # Execute the query with the parameters
    cursor.execute(query, params)

    # Commit the transaction to ensure changes are saved to the database
    db.commit()
    
    # Fetch all the results and return them
    return cursor.fetchall()

def execute_db(query, params=()):
    try:
      fetch_db(query, params)
    except Exception as e:
        # Ignore "no results to fetch" but catch other errors
        if "no results to fetch" not in str(e).lower():
            return jsonify({"error": str(e), "query": query}), 500

