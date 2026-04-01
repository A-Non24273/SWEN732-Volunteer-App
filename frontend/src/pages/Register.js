import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !password) {
      setMessage("Please fill all fields");
      return;
    }


    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.username === username);

    if (exists) {
      setMessage("User already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("Registered successfully!");

    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <div className="app-title">🤝 Helping Hands</div>
        <div className="tagline">Be part of something meaningful</div>

        <h2 className="login-title">Register</h2>

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

          <button className="primary-btn" onClick={handleRegister}>
            Register
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "10px", color: "red", fontWeight: "500" }}>
            {message}
          </p>
        )}

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Register;