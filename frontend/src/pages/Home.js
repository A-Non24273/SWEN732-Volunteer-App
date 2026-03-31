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

      {/* MAIN CONTENT */}
      <div className="container page">
        <div className="app-title">🤝 Helping Hands</div>
        <div className="tagline">Making a difference together</div>

        <div className="button-group">
          <button onClick={() => navigate("/post")}>Post Request</button>
          <button onClick={() => navigate("/requests")}>View Requests</button>
        </div>
      </div>
    </>
  );
}

export default Home;