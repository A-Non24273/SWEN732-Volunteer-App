from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

from schema import User, db

def create_app():

    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    @app.route("/")
    def home():
        return {"message": "Flask connected to PostgreSQL successfully"}

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return {"error": "Username and password are required"}, 400
        
        user = User.query.filter_by(username=username).first()
        if not user or user.password_hash != password:
            return {"error": "Invalid username or password"}, 401
        
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    
    @app.route("/register", methods=["POST"])
    def register():
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return {"error": "Username and password are required"}, 400
        
        existing_user = db.session.query(db.exists().where(User.username == username)).scalar()
        if existing_user:
            return {"error": "Username already exists"}, 400
        
        new_user = User(username=username, password_hash=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully", "user_id": new_user.id}), 201

    return app

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)