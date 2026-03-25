import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser({ username, password });

      setType("success");
      setMessage("User registered successfully!");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="app-title">🤝 Helping Hands</div>
      <div className="tagline">Be part of something meaningful</div>
      <h2>Register</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      {message && <div className={`message ${type}`}>{message}</div>}

      <span className="link" onClick={() => navigate("/")}>
        Back to Login
      </span>
    </div>
  );
}

export default Register;