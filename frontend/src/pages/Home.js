import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="app-title">🤝 Helping Hands</div>
      <div className="tagline">Making a difference together</div>
      <h2>Welcome 🎉</h2>
      <p>User ID: {userId}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;