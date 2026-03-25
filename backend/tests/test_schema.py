import pytest
from sqlalchemy import inspect

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import create_app
from schema import db

@pytest.fixture
def app():
    app = create_app()
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
        
def test_schema(app):
    """
    Check if the database schema is correct
    """
    with app.app_context():
        inspector = inspect(db.engine)
        
        # Check table names
        tables = inspector.get_table_names()
        assert "users" in tables
        assert "listings" in tables
        assert "volunteer_listings" in tables
        
        # Check all columns
        user_columns = {col["name"] for col in inspector.get_columns("users")}
        assert {"id", "username", "password_hash", "created_at"} <= user_columns

        listing_columns = {col["name"] for col in inspector.get_columns("listings")}
        assert {
            "id",
            "requester_id",
            "title",
            "description",
            "location",
            "start_time",
            "end_time",
            "status",
            "created_at",
            "updated_at",
        } <= listing_columns

        volunteer_listing_columns = {
            col["name"] for col in inspector.get_columns("volunteer_listings")
        }
        assert {
            "user_id",
            "listing_id",
            "status",
            "applied_at",
        } <= volunteer_listing_columns