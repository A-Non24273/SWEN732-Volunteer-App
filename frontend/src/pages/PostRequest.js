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
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("requests")) || [];

    const newRequest = {
      id: Date.now(),
      ...form
    };

    localStorage.setItem("requests", JSON.stringify([...existing, newRequest]));

    alert("Request Posted!");
    setForm({ title: "", description: "", location: "", date: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
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

        <div className="app-title">Post Request</div>

        <form onSubmit={handleSubmit}>
          <input name="title" value={form.title} placeholder="Title" onChange={handleChange} required />
          <input name="location" value={form.location} placeholder="Location" onChange={handleChange} required />
          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            style={{ width: "92%", padding: "10px", borderRadius: "6px" }}
          />

          <button type="submit">Post</button>
        </form>
      </div>
    </>
  );
}

export default PostRequest;