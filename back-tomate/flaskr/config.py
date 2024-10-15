import os

class Config:
    # Other config settings
    SUPABASE_DB_URL = os.getenv('SUPABASE_DB_URL')
    TEST = "test"
