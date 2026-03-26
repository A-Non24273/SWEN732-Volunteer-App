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

@pytest.fixture
def client(app):
    return app.test_client()

def test_listing_create(client, app):
    """
    Test creating a listing as a logged in user
    """
    from schema import User, Listing
    with app.app_context():
        # First, create a user to log in with
        user = User(username="bob", password_hash="password456")
        db.session.add(user)
        db.session.commit()
    
        # Now attempt to log in
        login_response = client.post(
            "/login",
            json={"username": "bob", "password": "password456"}
        )

        # Now create a listing
        listing_response = client.post(
            "/listing",
            json={
                "title": "Test Listing",
                "description": "A listing that is a test",
                "location": "somewhere in the back of my mind",
                "start_time": "21 April, 2026, 10:30:00",
                "end_time": "21 April, 2026, 11:30:00"
            }
        )
        assert listing_response.status_code == 201
        data = listing_response.get_json()
        assert data["message"] == "Listing posted successfully"
        assert "listing_id" in data
