import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function ViewRequests() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    createdBy: ""
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
    const requestToDelete = requests.find((r) => r.id === id);

    if (requestToDelete.createdBy !== userId) {
      alert("You are not allowed to delete this request");
      return;
    }

    const updated = requests.filter((r) => r.id !== id);
    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
  };


  const startEdit = (req) => {
    if (req.createdBy !== userId) {
      alert("You are not allowed to edit this request");
      return;
    }

    setEditingId(req.id);
    setEditForm(req);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };


  const saveEdit = () => {
    const requestToEdit = requests.find((r) => r.id === editingId);

    if (requestToEdit.createdBy !== userId) {
      alert("Unauthorized action");
      return;
    }

    const updated = requests.map((r) =>
      r.id === editingId ? editForm : r
    );

    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
    setEditingId(null);
  };

  return (
    <>

      <div className="header">
        <div className="header-left">User: {userId}</div>

        <div className="header-center">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>
          <span>Contact Us</span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>


      <div className="page">
        <div className="max-w-6xl mx-auto">

          <button
            className="back-btn"
            onClick={() => navigate("/home")}
          >
            ← Back
          </button>

          <div className="app-title">My Requests</div>

          {requests.length === 0 ? (
            <p>No requests yet</p>
          ) : (
            <div className="requests-grid">
              {requests.map((req) => (
                <div key={req.id} className="card">

                  {editingId === req.id ? (

                    <>
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                      />

                      <input
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                      />


                      <div className="row">
                        <div className="field">
                          <label>Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={editForm.startDate}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="field">
                          <label>End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={editForm.endDate}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>


                      <div className="row">
                        <div className="field">
                          <label>Start Time</label>
                          <input
                            type="time"
                            name="startTime"
                            value={editForm.startTime}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="field">
                          <label>End Time</label>
                          <input
                            type="time"
                            name="endTime"
                            value={editForm.endTime}
                            onChange={handleEditChange}
                          />
                        </div>
                      </div>

                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />

                      <button
                        onClick={saveEdit}
                        className="primary-btn"
                      >
                        Save
                      </button>
                    </>
                  ) : (

                    <>
                      <h3 className="card-title">{req.title}</h3>
                      <p>{req.description}</p>

                      <p><b>📍 Location:</b> {req.location}</p>

                      <p>
                        <b>📅 Start:</b> {req.startDate} at {req.startTime}
                      </p>

                      <p>
                        <b>📅 End:</b> {req.endDate} at {req.endTime}
                      </p>

                      {req.createdBy === userId && (
                        <div className="card-buttons">
                          <button
                            onClick={() => startEdit(req)}
                            className="secondary-btn"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteRequest(req.id)}
                            className="danger-btn"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewRequests;