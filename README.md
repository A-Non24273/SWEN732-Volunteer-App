# SWEN732-Volunteer-App | Helping Hands
[![codecov](https://codecov.io/github/A-Non24273/SWEN732-Volunteer-App/graph/badge.svg?token=00BJU5PDPU)](https://codecov.io/github/A-Non24273/SWEN732-Volunteer-App)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=A-Non24273_SWEN732-Volunteer-App&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=A-Non24273_SWEN732-Volunteer-App)

# Project Overview
The goal of this application is to create a platform that connects people who need assistance with volunteers who are willing to help within their community. The app aims to make volunteering more accessible while simplifying how individuals request and receive support.

In many communities, people often require help with everyday activities such as organizing events, tutoring, transportation assistance, or community support tasks. However, finding reliable volunteers or structured opportunities can be difficult because information is usually scattered across social media and informal communication channels. Similarly, many individuals are interested in volunteering but struggle to find opportunities that match their availability or interests. This gap creates missed opportunities for collaboration and community engagement.
The Volunteering Help App seeks to solve this problem by providing a centralized system where requesters can post volunteer opportunities and volunteers can easily browse and participate in them. By bringing both groups together on a single platform, the application encourages organized volunteering and improves communication between participants.

This application includes core features that support both requesters and volunteers. Requesters can create, edit, or cancel volunteer opportunities and manage interested participants. Volunteers can browse available opportunities, view detailed information, sign up for events, and track their accepted commitments. The platform also allows requesters to approve or reject volunteers and mark opportunities as completed once activities are finished.

# Environment Setup
## Prerequisites

* Node.js (LTS)
* Python 3.9+
* PostgreSQL
* pgAdmin

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

Backend runs at:
http://localhost:5000


## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:
http://localhost:3000

## Database Setup:

Create PostgreSQL database:

swen_732

Create `.env` inside `backend/`:

DATABASE_URL=postgresql://postgres:<password>@localhost:5432/swen_732

# Project Structure
The project is split into two main folders, the frontend and backend.

## Frontend
The frontend folder contains everything pertaining to the frontend of the site. All React code for the site can be found in the src/ directory. Under the src/ directory, all of the different pages are found under pages/, and the API integration for the backend under services/.

## Backend
The backend folder contains everything pertaining to the backend of the site. All python code for Flask can be found in app.py. The schema setup can be found in schema.py. All unit tests for the backend are under the tests/ folder.

# Contributing Guidelines
If you feel the need to contribute to the project in any way to improve it, feel free to open a pull request, and maintainers will review the request.

# Contact Information
Email: [chasedmichael24273@gmail.com](mailto:chasedmichael24273@gmail.com)