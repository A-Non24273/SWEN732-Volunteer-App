import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../App.css";

function Contact() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const userId = localStorage.getItem("user_id");

  const unescapeHtml = (text) => text.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent successfully! 📩");

    setForm({
      name: "",
      email: "",
      message: ""
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <>
      <div className="header">
        <div className="header-left">User: {unescapeHtml(userId)}</div>

        <div className="header-center">
          <span
            onClick={() => navigate("/home")}
            style={{
              color: location.pathname === "/home" ? "#60a5fa" : "white"
            }}
          >
            Home
          </span>

          <span
            onClick={() => navigate("/about")}
            style={{
              color: location.pathname === "/about" ? "#60a5fa" : "white"
            }}
          >
            About Us
          </span>

          <span
            onClick={() => {
              if (location.pathname === "/contact") {
                window.location.reload();  
              } else {
                navigate("/contact");
              }
            }}
            style={{
              color: location.pathname === "/contact" ? "#60a5fa" : "white",
              fontWeight: location.pathname === "/contact" ? "bold" : "normal"
            }}
          >
            Contact Us
          </span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <div className="contact-full">

        <div className="about-title">📞 Contact Us</div>

        <div className="contact-section">
          <h2>Get in Touch</h2>
          <p><b>📧 Email:</b> helpinghand@rit.edu</p>
          <p><b>📞 Phone:</b> +1 (585) 123-4567</p>
          <p><b>📍 Location:</b> Rochester Institute of Technology</p>
        </div>

        <div className="contact-section">
          <h2>Send us a Message</h2>

          <form onSubmit={handleSubmit} className="form">
            <input
              name="name"
              value={form.name}
              placeholder="Your Name"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Your Email"
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              value={form.message}
              placeholder="Your Message"
              onChange={handleChange}
              required
            />

            <button type="submit" className="primary-btn">
              Send Message
            </button>
          </form>
        </div>

      </div>
    </>
  );
}

export default Contact;