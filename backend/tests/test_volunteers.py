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

def test_volunteer_apply(client, app):
    """
    Test applying to volunteer for a listing
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
        listing_id = data["listing_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        assert apply_response.status_code == 200
        data = apply_response.get_json()

def test_volunteer_get(client, app):
    """
    Test getting volunteers for a listing
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
        listing_id = data["listing_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        assert apply_response.status_code == 200

        # Now get volunteers for the listing
        get_response = client.get(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        assert get_response.status_code == 200

def test_volunteer_withdraw(client, app):
    """
    Test withdrawing a volunteer application for a listing
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
        listing_id = data["listing_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        assert apply_response.status_code == 200

        # Now withdraw the volunteer application
        withdraw_response = client.put(
            "/volunteers",
            json={"listing_id": listing_id, "status": "withdrawn", "volunteer_id": 1}
        )
        assert withdraw_response.status_code == 200

def test_get_listings_by_user_commitment(client, app):
    """
    Retrieve all open listings
    """
    from schema import User, VolunteerListing
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
        
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        
        # Get all VolunteerListings with with userid
        get_response = client.get(
            "/signedup"
        )
        
        data = get_response.get_json()
        
        assert get_response.status_code == 200
        assert len(data) == 1
        assert data[0].get("user_id") == user.id