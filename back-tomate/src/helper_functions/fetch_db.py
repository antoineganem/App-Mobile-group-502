from flaskr.db import get_db, close_db
from flask import jsonify
import psycopg2
from psycopg2.extras import execute_batch as psycopg2_execute_batch

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


def execute_batch(query, values):
    """
    Execute a batch of parameterized queries against the database in a single transaction.
    
    Args:
    - query: The SQL query to execute with placeholders for batch insertion.
    - values: A list of tuples, where each tuple contains parameters for one execution of the query.
    
    Returns:
    - A JSON response if an error occurs; otherwise, commits the transaction silently.
    """
    db = get_db()  # Reuse the existing database connection
    try:
        with db.cursor() as cursor:
            # Use psycopg2's execute_batch to execute all queries in the list efficiently
            psycopg2_execute_batch(cursor, query, values)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
        # Optionally return an error message in JSON format
        return jsonify({"error": str(e), "query": query}), 500