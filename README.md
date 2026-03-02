# SWEN732-Volunteer-App
# Volunteering Help App — Environment Setup

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

---

## Database Setup

Create PostgreSQL database:

swen_732

Create `.env` inside `backend/`:

DATABASE_URL=postgresql://postgres:<password>@localhost:5432/swen_732
