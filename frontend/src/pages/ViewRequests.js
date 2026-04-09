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
        <div className="header-left">User: {userId}</div>

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
                  <div className="edit-form"></div>
                ) : (
                  <>
                      
                      <div className="card-header">
                        <h3>{req.title}</h3>
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

                    <p>{req.description}</p>

                    <p><b>📍</b> {req.location}</p>
                    <p>📅 {req.startDate} → {req.endDate}</p>
                    <p>⏰ {req.startTime} → {req.endTime}</p>

                    <div className="card-buttons">
                      {req.createdBy === userId ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); startEdit(req); }} className="secondary-btn">✏️ Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); deleteRequest(req.id); }} className="danger-btn">🗑️ Delete</button>
                          <button onClick={(e) => { e.stopPropagation(); viewVolunteers(req.id); }} className="primary-btn">👀 View Volunteers</button>
                        </>
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

      {/* 🔥 REMOVED BUTTON FROM MODAL */}
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