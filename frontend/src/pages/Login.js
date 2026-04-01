import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      alert("User not found. Please create an account.");
      return;
    }

    localStorage.setItem("user_id", username);
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