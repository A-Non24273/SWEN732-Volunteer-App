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
        
        assert login_response.status_code == 200

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
        
        assert login_response.status_code == 200

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
        
        assert login_response.status_code == 200
        
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
        
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        
        assert apply_response.status_code == 200
        
        # Get all VolunteerListings with with userid
        get_response = client.get(
            "/signedup"
        )
        
        data = get_response.get_json()
        
        assert get_response.status_code == 200
        assert len(data) == 1
        assert data[0].get("user_id") == user.id


def test_volunteer_approve(client, app):
    """
    Test accepting a volunteer for a listing
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
        
        assert login_response.status_code == 200

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

        client.post("/logout")
        user2 = User(username="alice", password_hash="password456")
        db.session.add(user2)
        db.session.commit()

        # log in as alice
        alice_response = client.post("/login", json={"username":"alice", "password":"password456"})
        alice = alice_response.get_json()
        alice_id = alice["user_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        
        assert apply_response.status_code == 200
        
        # switch login to bob
        client.post("/logout")
        bob_login = client.post("/login", json={"username":"bob", "password":"password456"})
        
        assert bob_login.status_code == 200

        # approve alice as a volunteer
        volunteer_id = alice_id
        new_status = "approved"
        response = client.put("/volunteers", json={"volunteer_id":volunteer_id, "status":new_status, "listing_id":listing_id})

        assert response.status_code == 200


def test_volunteer_reject(client, app):
    """
    Test rejecting a volunteer for a listing
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
        
        assert login_response.status_code == 200

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

        client.post("/logout")
        user2 = User(username="alice", password_hash="password456")
        db.session.add(user2)
        db.session.commit()

        # log in as alice
        alice_response = client.post("/login", json={"username":"alice", "password":"password456"})
        alice = alice_response.get_json()
        alice_id = alice["user_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        
        assert apply_response.status_code == 200
        
        # switch login to bob
        client.post("/logout")
        bob_login = client.post("/login", json={"username":"bob", "password":"password456"})
        assert bob_login.status_code == 200

        # approve alice as a volunteer
        volunteer_id = alice_id
        new_status = "rejected"
        response = client.put("/volunteers", json={"volunteer_id":volunteer_id, "status":new_status, "listing_id":listing_id})

        assert response.status_code == 200


def test_volunteer_bad_status(client, app):
    """
    Test setting a bad status for a volunteer for a listing
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
        
        assert login_response.status_code == 200

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

        client.post("/logout")
        user2 = User(username="alice", password_hash="password456")
        db.session.add(user2)
        db.session.commit()

        # log in as alice
        alice_response = client.post("/login", json={"username":"alice", "password":"password456"})
        alice = alice_response.get_json()
        alice_id = alice["user_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )
        
        assert apply_response.status_code == 200
        
        # switch login to bob
        client.post("/logout")
        bob_login = client.post("/login", json={"username":"bob", "password":"password456"})
        assert bob_login.status_code == 200

        # approve alice as a volunteer
        volunteer_id = alice_id
        new_status = "bad status"
        response = client.put("/volunteers", json={"volunteer_id":volunteer_id, "status":new_status, "listing_id":listing_id})

        assert response.status_code == 400

def test_volunteer_withdraw(client, app):
    """
    Test withdrawing a volunteer for a listing
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
        
        assert login_response.status_code == 200

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

        client.post("/logout")
        user2 = User(username="alice", password_hash="password456")
        db.session.add(user2)
        db.session.commit()

        # log in as alice
        alice_response = client.post("/login", json={"username":"alice", "password":"password456"})
        alice = alice_response.get_json()
        alice_id = alice["user_id"]

        # Now apply to volunteer for the listing
        apply_response = client.post(
            "/volunteers",
            json={"listing_id": listing_id}
        )

        assert apply_response.status_code == 200

        # approve alice as a volunteer
        volunteer_id = alice_id
        new_status = "withdrawn"
        response = client.put("/volunteers", json={"volunteer_id":volunteer_id, "status":new_status, "listing_id":listing_id})

        assert response.status_code == 200

        