# Ported schema.sql to use SQLAlchemy

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from flask_login import UserMixin

db = SQLAlchemy()

listing_status = Enum(
    "open",
    "cancelled",
    "completed",
    name="listing_status"
)

application_status = Enum(
    "pending",
    "approved",
    "rejected",
    "withdrawn",
    name="application_status"
)


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(
        db.TIMESTAMP,
        nullable=False,
        server_default=db.func.current_timestamp()
    )


class Listing(db.Model):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)

    requester_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255))

    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    status = db.Column(
        listing_status,
        nullable=False,
        server_default="open"
    )

    created_at = db.Column(
        db.TIMESTAMP,
        nullable=False,
        server_default=db.func.current_timestamp()
    )

    updated_at = db.Column(
        db.TIMESTAMP,
        nullable=False,
        server_default=db.func.current_timestamp()
    )

    def to_dict(self):
        """
            Converts the listing to a dict
        """
        return {
            "id": self.id,
            "requester_id": self.requester_id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class VolunteerListing(db.Model):
    __tablename__ = "volunteer_listings"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    listing_id = db.Column(
        db.Integer,
        db.ForeignKey("listings.id", ondelete="CASCADE"),
        primary_key=True
    )

    status = db.Column(
        application_status,
        nullable=False,
        server_default="pending"
    )

    applied_at = db.Column(
        db.TIMESTAMP,
        nullable=False,
        server_default=db.func.current_timestamp()
    )