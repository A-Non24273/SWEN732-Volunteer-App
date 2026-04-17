import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const unescapeHtml = (text) => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");

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
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/home")}
          >
            Home
          </span>

          <span onClick={() => navigate("/about")}>
            About Us
          </span>

        
            <span onClick={() => navigate("/contact")}>
            Contact Us
          </span>
        </div>

        <div className="header-right">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>


      <div className="page flex items-center justify-center min-h-[80vh]">


        <div className="home-card text-center">
          <div className="app-title">🤝 Helping Hands</div>
          <div className="tagline">Making a difference together</div>

          <div className="btn-group mt-6">
            <button
              className="primary-btn"
              onClick={() => navigate("/post")}
            >
              Post Request
            </button>

            <button
              className="primary-btn"
              onClick={() => navigate("/requests")}
            >
              View Requests
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;