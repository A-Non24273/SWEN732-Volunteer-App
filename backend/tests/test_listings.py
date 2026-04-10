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

def test_listing_get(client, app):
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
        data = listing_response.get_json()
        listing_id = data.get("listing_id")
        
        # now get the listing
        get_response = client.get(
            "/listing",
            json={
                "id": listing_id
            }
        )
        data = get_response.get_json()
        assert get_response.status_code == 200
        assert data.get("id") == listing_id
        assert data.get("title") == "Test Listing"
        
def test_update_listing(client, app):
    """
    Update an existing listing and check the updates were made
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
        data = listing_response.get_json()
        listing_id = data.get("listing_id")
        
        # Update the listing
        update_response = client.put(
            "/listing",
            json={
                "listing_id": listing_id,
                "title": "updated title",
                "description": "updated description",
                "location": "updated location",
                "start_time": "1 April, 2026, 10:00:00",
                "end_time": "1 April, 2026, 11:00:00",
                "status": "cancelled"
            }
        )
        
        # Get the listing
        get_response = client.get(
            "/listing",
            json={
                "id": listing_id
            }
        )
        
        data = get_response.get_json()
        assert update_response.status_code == 200
        assert get_response.status_code == 200
        assert data.get("title") == "updated title"
        assert data.get("description") == "updated description"
        assert data.get("location") == "updated location"
        assert data.get("start_time") == "2026-04-01T10:00:00"
        assert data.get("end_time") == "2026-04-01T11:00:00"
        assert data.get("status") == "cancelled"
        
def test_get_listings_by_status_open(client, app):
    """
    Retrieve all open listings
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
        
        listing_response = client.post(
            "/listing",
            json={
                "title": "Test Listing 1",
                "description": "A listing that is a test",
                "location": "somewhere in the back of my mind",
                "start_time": "21 April, 2026, 10:30:00",
                "end_time": "21 April, 2026, 11:30:00",
            }
        )
        data = listing_response.get_json()
        listing_id = data.get("listing_id")
        
        listing_response2 = client.post(
            "/listing",
            json={
                "title": "Test Listing 2",
                "description": "A listing that is a test",
                "location": "somewhere in the back of my mind",
                "start_time": "21 April, 2026, 10:30:00",
                "end_time": "21 April, 2026, 11:30:00",
            }
        )
        data = listing_response2.get_json()
        listing_id2 = data.get("listing_id")
        
        # Update status of listing 2
        update_response = client.put(
            "/listing",
            json={"listing_id": listing_id2,
                  "status": "cancelled"}
        )
        
        # Get all listings with status "open"
        get_response = client.get(
            "/listings",
            json={"status": "open"}
        )
        
        data = get_response.get_json()
        
        assert get_response.status_code == 200
        assert len(data) == 1
        assert data[0].get("id") == 1
        assert data[0].get("status") == "open"

def test_user_change_listing_not_owner(client, app):
    """
    Test to check if user tries editing a listing they do not own returns an error
    """
    from schema import User, Listing
    with app.app_context():
        # First, create users and listing to test with
        user = User(username="bob", password_hash="password456")
        user2 = User(username="bill", password_hash="password123")
        listing = Listing(requester_id=2, title="test", description="test", location="test", start_time="21 April, 2026, 10:30:00", end_time="21 April, 2026, 11:30:00")
        db.session.add(user)
        db.session.add(user2)
        db.session.commit()
        db.session.add(listing)
        db.session.commit()
    
        # login as first user
        login_response = client.post(
            "/login",
            json={"username": "bob", "password": "password456"}
        )

        # Try to edit the second user's listing
        update_response = client.put(
            "/listing",
            json={"listing_id": 1,
                  "status": "cancelled"}
        )

        assert update_response.status_code == 401
        