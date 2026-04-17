import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const escapeHtml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const handleLogin = () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const trimmedUsername = username.trim();
      const escapedUsername = escapeHtml(trimmedUsername);
      const trimmedPassword = password.trim();

      if (!trimmedUsername || !trimmedPassword) {
        alert("Please enter username and password");
        return;
      }

      const foundUser = users.find(
        (u) => u.username === escapedUsername && u.password === trimmedPassword
      );

      if (!foundUser) {
        alert("User not found. Please create an account.");
        return;
      }

      localStorage.setItem("user_id", escapedUsername);
      navigate("/home");
    };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <div className="app-title">🤝 Helping Hands</div>
        <div className="tagline">Connecting people who care</div>

        <h2 className="login-title">Login</h2>

        <div className="login-form">
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="primary-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="login-link">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Create account
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;