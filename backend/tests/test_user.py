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

def test_user_create(client, app):
    """
    Test creating a user
    """
    from schema import User

    with app.app_context():
        response = client.post(
        "/register",
        json={"username": "alice", "password": "secret123"}
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User registered successfully"
    assert "user_id" in data

def test_user_login(client, app):
    """
    Test user login
    """
    from schema import User

    with app.app_context():
        # First, create a user to log in with
        user = User(username="bob", password_hash="password456")
        db.session.add(user)
        db.session.commit()

        # Now attempt to log in
        response = client.post(
            "/login",
            json={"username": "bob", "password": "password456"}
        )

    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Login successful"
    assert data["user_id"] == user.id