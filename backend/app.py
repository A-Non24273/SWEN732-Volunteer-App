from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import current_user, login_required, login_user, logout_user
from flask_login import LoginManager
from datetime import datetime


from dotenv import load_dotenv
import os

from schema import User, db, Listing, VolunteerListing

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
    
    @app.route("/listing", methods=["GET"])
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
    
    @app.route("/listing", methods=["PUT"])
    @login_required
    def update_listing():
        from datetime import timezone
        data = request.get_json()
        
        listing_id = data.get("listing_id")
        user_id = current_user.id
        
        if not listing_id:
            return {"error": "listing id is required"}, 400
        
        # Check if the user owns the listing
        listing = db.session.get(Listing, listing_id)
        
        if listing.requester_id != user_id:
            return {"error": "user does not own this request"}, 401
        
        # Update the listing
        new_listing_data = {
            "title": data.get("title", listing.title),
            "description": data.get("description", listing.description),
            "location": data.get("location", listing.location),
            "start_time": datetime.strptime(data.get("start_time"), format_pattern) if data.get("start_time") else listing.start_time,
            "end_time": datetime.strptime(data.get("end_time"), format_pattern) if data.get("end_time") else listing.end_time,
            "status": data.get("status") if data.get("status") else listing.status,
            "updated_at": datetime.now(timezone.utc)
        }
        db.session.query(Listing).filter(Listing.id == listing_id).update(new_listing_data)
        db.session.commit()
        
        return {"message": "Listing updated successfully"}, 200

    @app.route("/listings", methods=["GET"])
    @login_required
    def get_listings_by_status():
        """
        Retreives all listings from given listing status
        """
        data = request.get_json()
        
        status = data.get("status")
        
        listings = db.session.query(Listing).filter(Listing.status == status).all()

        return jsonify([listing.to_dict() for listing in listings]), 200
    
    @app.route("/signedup", methods=["GET"])
    @login_required
    def get_listings_by_user_commitment():
        """
        Retreives all listings a volunteer has signedup for
        """
        user_id = current_user.id
        
        listings = db.session.query(VolunteerListing).filter(VolunteerListing.user_id == user_id).all()

        return jsonify([listing.to_dict() for listing in listings]), 200
    
    @app.route("/volunteers", methods=["GET"])
    @login_required
    def get_volunteers():
        """
        Retreives all volunteers from a listing
        """
        data = request.get_json()

        listing_id = data.get("listing_id")

        # We don't care if any user can see the list of volunteers
        # If we choose to change this, the check goes here

        volunteers = db.session.query(VolunteerListing).filter(VolunteerListing.listing_id == listing_id).all()

        return jsonify([volunteer.to_dict() for volunteer in volunteers]), 200

    @app.route("/volunteers", methods=["POST"])
    @login_required
    def volunteer_signup():
        """
        Add a user to the waitlist of volunteers for a listing
        """
        data = request.get_json()

        user_id = current_user.id

        new_join = VolunteerListing(
            user_id = user_id,
            listing_id = data.get("listing_id")
        )

        db.session.add(new_join)
        db.session.commit()
        return {"message": "Volunteer signup successful"}, 200

    @app.route("/volunteers", methods=["PUT"])
    @login_required
    def change_volunteer_status():
        """
        Change the status of a volunteer

        If current user is owner of listing, they can approve/deny volunteers

        If current user is a volunteer, they can withdraw, or unwithdraw
        """
        data = request.get_json()

        user_id = current_user.id

        listing_id = data.get("listing_id")

        listing = db.session.get(Listing, listing_id)

        volunteers = db.session.query(VolunteerListing).filter(VolunteerListing.listing_id == listing_id).all()

        # If user owns the listing
        if listing.requester_id == user_id:
            volunteer_id = data.get("volunteer_id")
            new_status = data.get("status")

            if not volunteer_id or not new_status:
                return {"error": "volunteer_id and status are required"}, 400
            
            volunteer = db.session.query(VolunteerListing).filter(VolunteerListing.listing_id == listing_id, VolunteerListing.user_id == volunteer_id).first()

            if not volunteer:
                return {"error": "volunteer is not signed up for this listing"}, 400
            
            if new_status not in ["withdrawn", "approved", "rejected"]:
                return {"error": "status must be approved, rejected, or withdrawn"}, 400

            volunteer.status = new_status
            db.session.commit()
            return {"message": "Volunteer status updated successfully"}, 200
        # Else if current user is a volunteer
        elif any(volunteer.user_id == user_id for volunteer in volunteers):
            volunteer = db.session.query(VolunteerListing).filter(VolunteerListing.listing_id == listing_id, VolunteerListing.user_id == user_id).first()

            if not volunteer:
                return {"error": "volunteer is not signed up for this listing"}, 400
            
            # If volunteer is withdrawing, they can only withdraw if they are currently approved or pending
            if data.get("status") == "withdrawn" and volunteer.status not in ["approved", "pending"]:
                return {"error": "volunteer cannot withdraw unless they are currently approved or pending"}, 400
            
            # If volunteer is unwithdrawing, they can only unwithdraw if they are currently withdrawn
            if data.get("status") == "pending" and volunteer.status != "withdrawn":
                return {"error": "volunteer cannot unwithdraw unless they are currently withdrawn"}, 400
            
            volunteer.status = data.get("status")
            db.session.commit()
            return {"message": "Volunteer status updated successfully"}, 200
        else:
            return {"error": "user is not a volunteer or owner of this listing"}, 401
        

    return app
        

if __name__ == "__main__": # pragma: no cover
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)