from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import current_user, login_required, login_user, logout_user
from flask_login import LoginManager
from datetime import datetime


from dotenv import load_dotenv
import os

from schema import User, db, Listing

format_pattern = "%d %B, %Y, %H:%M:%S" # for datetimes
login_manager = LoginManager()


def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")

    db.init_app(app)
    
    login_manager.init_app(app)
    login_manager.login_view = "/login"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))


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
        
        login_user(user)
        
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    
    @app.route("/logout", methods=["POST"])
    @login_required
    def logout():
        logout_user()
        return jsonify({"message": "Logout successful"}), 200

    
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
    
    @app.route("/listing", methods=["POST"])
    @login_required
    def post_listing():
        data = request.get_json()

        # everything listed here is required
        requester_id = current_user.id
        title = data.get("title")
        description = data.get("description")
        location = data.get("location")
        start_time = data.get("start_time") # this is a string
        end_time = data.get("end_time") # this is also a string
        # listing_status defaults to open
        # created_at and updated_at are automatic I think

        # make sure we have everything
        if not (title and description and location and start_time and end_time):
            return {"error": "title, description, location, start_time, and end_time are required"}, 400

        # convert to datetime
        start_time = datetime.strptime(data.get("start_time"), format_pattern)
        end_time = datetime.strptime(data.get("end_time"), format_pattern)

        new_listing = Listing(requester_id=requester_id, title=title, description=description, location=location, start_time=start_time, end_time=end_time)
        db.session.add(new_listing)
        db.session.commit()
        return jsonify({"message": "Listing posted successfully", "listing_id": new_listing.id}), 201
    
    @app.route("/listings", methods=["GET"])
    @login_required
    def get_listing():
        data = request.get_json()

        listing_id = data.get("id")

        if not listing_id:
            return {"error": "listing id is required"}, 400
        
        listing = db.session.get(Listing, listing_id)

        if not listing:
            return {"error": "listing does not exist"}, 400
        
        return jsonify(listing.to_dict()), 200


    return app

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)