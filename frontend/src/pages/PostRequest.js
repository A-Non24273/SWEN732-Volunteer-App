import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function PostRequest() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });

  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(""), 3000);
  };

  const validate = () => {
    const { startDate, endDate, startTime, endTime } = form;

    if (startDate && endDate && startDate > endDate) {
      showToast("⚠️ Start date must be before end date", "error");
      return false;
    }

    if (startDate && endDate && startDate === endDate && startTime && endTime && startTime >= endTime) {
      showToast("⚠️ Start time must be before end time on the same day", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const existing = JSON.parse(localStorage.getItem("requests")) || [];

    const newRequest = {
      id: Date.now(),
      ...form,
      createdBy: userId
    };

    localStorage.setItem("requests", JSON.stringify([...existing, newRequest]));

    showToast("Request Posted Successfully! 🎉", "success");

    setForm({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: ""
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const dateError = form.endDate && form.startDate && form.endDate < form.startDate;
  const timeError = form.startDate === form.endDate && form.endTime && form.startTime && form.endTime <= form.startTime;

  return (
    <>
      {toast && (
        <div
          className="toast"
          style={toastType === "error" ? { backgroundColor: "#e53e3e" } : {}}
        >
          {toast}
        </div>
      )}

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

      <div className="container page">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>

        <div className="app-title">Post Request</div>

        <form onSubmit={handleSubmit} className="form">
          <input
            name="title"
            value={form.title}
            placeholder="Title"
            onChange={handleChange}
            required
          />

          <input
            name="location"
            value={form.location}
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <div className="row">
            <div className="field">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={handleChange}
                required
                style={dateError ? { borderColor: "red" } : {}}
              />
            </div>
          </div>

          {dateError && (
            <p style={{ color: "red", fontSize: "0.8rem", margin: "-8px 0 8px" }}>
              ⚠️ End date must be after start date
            </p>
          )}

          <div className="row">
            <div className="field">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                style={timeError ? { borderColor: "red" } : {}}
              />
            </div>
          </div>

          {timeError && (
            <p style={{ color: "red", fontSize: "0.8rem", margin: "-8px 0 8px" }}>
              ⚠️ End time must be after start time on the same day
            </p>
          )}

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn">
            Post
          </button>
        </form>
      </div>
    </>
  );
}

export default PostRequest;