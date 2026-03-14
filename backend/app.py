from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

from schema import db

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

    return app

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, port=5000)