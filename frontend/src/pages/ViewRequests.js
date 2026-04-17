import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function ViewRequests() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState("");

  const [volunteers, setVolunteers] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const escapeHtml = (text) => text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  const unescapeHtml = (text) => text.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const markCompleted = (id) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: "completed" } : r
    );
    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
    showToast("Event marked as completed ✅");
  };

  const getFilteredRequests = () => {
    let data = [...requests];

    if (filter === "recent") data = [...data].reverse();

    if (filter === "upcoming") {
      data = data.filter((r) => new Date(r.startDate) >= new Date());
    }

    if (filter === "completed") {
      data = data.filter((r) => r.status === "completed");
    }

    if (filter === "mine") {
      data = data.filter((r) => r.createdBy === userId);
    }

    return data;
  };

  const handleSignup = (listingId) => {
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    const already = volunteers.find(
      (v) => v.listing_id === listingId && v.user_id === userId
    );

    if (already) {
      showToast("Already registered ❌");
      return;
    }

    volunteers.push({
      listing_id: listingId,
      user_id: userId,
      status: "pending"
    });

    localStorage.setItem("volunteers", JSON.stringify(volunteers));
    showToast("Registration successful 🎉");
  };

  const handleWithdraw = (listingId) => {
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    volunteers = volunteers.filter(
      (v) => !(v.listing_id === listingId && v.user_id === userId)
    );

    localStorage.setItem("volunteers", JSON.stringify(volunteers));
    showToast("Withdrawn successfully ❌");
  };

  const viewVolunteers = (listingId) => {
    const volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    const filtered = volunteers.filter((v) => v.listing_id === listingId);

    setVolunteers(filtered);
    setSelectedListing(listingId);
    setShowVolunteerModal(true);
  };

  const updateStatus = (volunteerId, status) => {
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    volunteers = volunteers.map((v) =>
      v.listing_id === selectedListing && v.user_id === volunteerId
        ? { ...v, status }
        : v
    );

    localStorage.setItem("volunteers", JSON.stringify(volunteers));
    viewVolunteers(selectedListing);
    showToast(`Volunteer ${status} ✅`);
  };

  const startEdit = (req) => {
    setEditingId(req.id);
    setEditForm({...req});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    const { startDate, endDate, startTime, endTime } = editForm;

    if (startDate && endDate && startDate > endDate) {
      showToast("⚠️ Start date must be before end date");
      return;
    }

    if (startDate && endDate && startDate === endDate && startTime && endTime && startTime >= endTime) {
      showToast("⚠️ Start time must be before end time on the same day");
      return;
    }

    const sanitizedEditForm = {
      ...editForm,
      title: escapeHtml(editForm.title.trim()),
      description: escapeHtml(editForm.description.trim()),
      location: escapeHtml(editForm.location.trim()),
      startDate: editForm.startDate.trim(),
      endDate: editForm.endDate.trim(),
      startTime: editForm.startTime.trim(),
      endTime: editForm.endTime.trim()
    };

    const updated = requests.map((r) =>
      r.id === editingId ? sanitizedEditForm : r
    );
    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
    setEditingId(null);
    showToast("Updated ✏️");
  };

  const deleteRequest = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    localStorage.setItem("requests", JSON.stringify(updated));
    setRequests(updated);
    showToast("Deleted 🗑️");
  };

  const getUserStatus = (listingId) => {
    const volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    const found = volunteers.find(
      (v) => v.listing_id === listingId && v.user_id === userId
    );

    return found ? found.status : null;
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <div className="header">
        <div className="header-left">User: {unescapeHtml(userId)}</div>

        <div className="header-center">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>
          <span onClick={() => navigate("/contact")}>Contact Us</span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="page">
        <div className="max-w-6xl mx-auto">
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            minHeight: "80vh"
          }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button className="back-btn" onClick={() => navigate("/home")}>
              ← Back
            </button>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">All Events</option>
              <option value="recent">Recently Added</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="completed">Completed Events</option>
              <option value="mine">My Events</option>
            </select>
          </div>

          <div className="app-title">Requests</div>

          <div className="requests-grid">
            {getFilteredRequests().map((req) => (
              <div key={req.id} className="card">

                {req.status === "completed" && (
                  <div style={{ color: "green", marginBottom: "5px" }}>
                    ✅ Completed
                  </div>
                )}

                {editingId === req.id ? (
                  <div className="edit-form">
                    <input name="title" value={editForm.title || ""} onChange={handleEditChange} className="form-input" />
                    <input name="location" value={editForm.location || ""} onChange={handleEditChange} className="form-input" />
                    <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="form-input" />
                    <div className="form-row">
                      <input type="date" name="startDate" value={editForm.startDate || ""} onChange={handleEditChange} className="form-input" />
                      <input
                        type="date"
                        name="endDate"
                        value={editForm.endDate || ""}
                        onChange={handleEditChange}
                        className="form-input"
                        style={editForm.endDate && editForm.startDate && editForm.endDate < editForm.startDate ? { borderColor: "red" } : {}}
                      />
                    </div>
                    {editForm.endDate && editForm.startDate && editForm.endDate < editForm.startDate && (
                      <p style={{ color: "red", fontSize: "0.8rem", margin: "-8px 0 8px" }}>⚠️ End date must be after start date</p>
                    )}
                    <div className="form-row">
                      <input type="time" name="startTime" value={editForm.startTime || ""} onChange={handleEditChange} className="form-input" />
                      <input
                        type="time"
                        name="endTime"
                        value={editForm.endTime || ""}
                        onChange={handleEditChange}
                        className="form-input"
                        style={editForm.startDate === editForm.endDate && editForm.endTime && editForm.startTime && editForm.endTime <= editForm.startTime ? { borderColor: "red" } : {}}
                      />
                    </div>
                    {editForm.startDate === editForm.endDate && editForm.endTime && editForm.startTime && editForm.endTime <= editForm.startTime && (
                      <p style={{ color: "red", fontSize: "0.8rem", margin: "-8px 0 8px" }}>⚠️ End time must be after start time</p>
                    )}
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="primary-btn">Save</button>
                      <button onClick={() => setEditingId(null)} className="secondary-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                      
                      <div className="card-header">
                        <h3>{unescapeHtml(req.title)}</h3>
                      </div>

                      {req.createdBy === userId && req.status !== "completed" && (
                        <button
                          className="complete-btn card-top-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            markCompleted(req.id);
                          }}
                        >
                          Mark Completed
                        </button>
                      )}

                    <p>{unescapeHtml(req.description)}</p>

                    <p><b>📍</b> {unescapeHtml(req.location)}</p>
                    <p>📅 {req.startDate} → {req.endDate}</p>
                    <p>⏰ {req.startTime} → {req.endTime}</p>
                    <p>👤 Posted by: <b>{req.createdBy}</b></p>

                    <div className="card-buttons">
                      {req.createdBy === userId ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); startEdit(req); }} className="secondary-btn">✏️ Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(req.id); }} className="danger-btn">🗑️ Delete</button>
                          <button onClick={(e) => { e.stopPropagation(); viewVolunteers(req.id); }} className="primary-btn">👀 View Volunteers</button>
                        </>
                      ) : req.status === "completed" ? (
                        <button className="danger-btn" disabled>🔒 Event Closed</button>
                      ) : (
                        (() => {
                          const status = getUserStatus(req.id);

                          if (status === "approved") {
                            return (
                              <div className="status-actions">
                                <button className="accept-btn" disabled>✅ Accepted</button>
                                <button className="withdraw-btn" onClick={(e) => { e.stopPropagation(); handleWithdraw(req.id); }}>
                                  Withdraw
                                </button>
                              </div>
                            );
                          }

                          if (status === "pending") {
                            return (
                              <div className="status-actions">
                                <button className="secondary-btn" disabled>⏳ Pending</button>
                                <button className="withdraw-btn" onClick={(e) => { e.stopPropagation(); handleWithdraw(req.id); }}>
                                  Withdraw
                                </button>
                              </div>
                            );
                          }

                          if (status === "rejected") {
                            return <button className="danger-btn" disabled>❌ Position Filled</button>;
                          }

                          return (
                            <button onClick={(e) => { e.stopPropagation(); handleSignup(req.id); }} className="primary-btn">
                              Volunteer 🙋
                            </button>
                          );
                        })()
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="volunteer-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Event</h2>
            <p style={{ margin: "12px 0 24px" }}>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button className="secondary-btn" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button
                className="danger-btn"
                onClick={() => {
                  deleteRequest(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >
                🗑️ Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showVolunteerModal && (
        <div className="modal-overlay" onClick={() => setShowVolunteerModal(false)}>
          <div className="volunteer-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Volunteers</h2>

            {volunteers.map((v) => (
              <div key={v.user_id} className="volunteer-card">
                <div className="volunteer-info">
                  <div className="avatar">{v.user_id[0]}</div>
                  <div>
                    <p className="volunteer-name">User {v.user_id}</p>
                    <span className={`status-badge ${v.status}`}>
                      {v.status === "approved" && "✅ Accepted"}
                      {v.status === "rejected" && "❌ Rejected"}
                      {v.status === "pending" && "⏳ Pending"}
                    </span>
                  </div>
                </div>

                <div className="volunteer-actions">
                  <button onClick={() => updateStatus(v.user_id, "approved")} className="accept-btn">Accept</button>
                  <button onClick={() => updateStatus(v.user_id, "rejected")} className="reject-btn">Reject</button>
                </div>
              </div>
            ))}

            <button className="close-btn" onClick={() => setShowVolunteerModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewRequests;