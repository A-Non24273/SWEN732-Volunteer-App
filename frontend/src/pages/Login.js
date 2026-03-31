import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
  localStorage.setItem("user_id", "1");
  navigate("/home");
};

  return (
  <div className="container">
    <div className="app-title">🤝 Helping Hands</div>
    <div className="tagline">Connecting people who care</div>

    <h2>Login</h2>

    <input
      placeholder="Username"
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>

    {message && <div className={`message ${type}`}>{message}</div>}

    <span className="link" onClick={() => navigate("/register")}>
      Create account
    </span>
  </div>
);

  
}

export default Login;