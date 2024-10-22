import psycopg2  # type: ignore # To return rows as dictionaries
from psycopg2.extras import RealDictCursor  # type: ignore # To return rows as dictionaries
from flask import current_app, g
from config import Config


def get_db():
    if 'db' not in g:
        # Fetch the connection string from the Flask config
        connection_string = Config.SUPABASE_DB_URL
        # Connect to the PostgreSQL database
        g.db = psycopg2.connect(
            connection_string,
            cursor_factory=RealDictCursor  # Return results as dictionaries
        )

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
