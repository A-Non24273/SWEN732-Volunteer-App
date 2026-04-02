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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("requests")) || [];

    const newRequest = {
      id: Date.now(),
      ...form,
      createdBy: userId
    };

    localStorage.setItem("requests", JSON.stringify([...existing, newRequest]));

    setToast("Request Posted Successfully!");

    setTimeout(() => {
      setToast("");
    }, 3000);

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
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

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