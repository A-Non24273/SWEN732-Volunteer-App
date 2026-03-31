import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function ViewRequests() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    date: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const deleteRequest = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
  };

  const startEdit = (req) => {
    setEditingId(req.id);
    setEditForm(req);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    const updated = requests.map((r) =>
      r.id === editingId ? editForm : r
    );

    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
    setEditingId(null);
  };

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <div className="header-left">User: {userId}</div>

        <div className="header-center">
          <span onClick={() => navigate("/home")}>Home</span>
          <span>About Us</span>
          <span>Contact Us</span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* PAGE */}
      <div className="container page">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>

        <div className="app-title">My Requests</div>

        {requests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="card">
              {editingId === req.id ? (
                <>
                  <input name="title" value={editForm.title} onChange={handleEditChange} />
                  <input name="location" value={editForm.location} onChange={handleEditChange} />
                  <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
                  <textarea name="description" value={editForm.description} onChange={handleEditChange} />

                  <button onClick={saveEdit}>Save</button>
                </>
              ) : (
                <>
                  <h3>{req.title}</h3>
                  <p>{req.description}</p>
                  <p><b>Location:</b> {req.location}</p>
                  <p><b>Date:</b> {req.date}</p>

                  <button onClick={() => startEdit(req)}>Edit</button>
                  <button onClick={() => deleteRequest(req.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default ViewRequests;

