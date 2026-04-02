import { useNavigate } from "react-router-dom";
import "../App.css";

function About() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <>

      <div className="header">
        <div className="header-left">User: {userId}</div>

        <div className="header-center">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>
          <span onClick={() => navigate("/contact")}>Contact Us</span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>


      <div className="about-full">

        <h1 className="about-title">🤝 Helping Hands</h1>

        <p className="about-tagline">
          Connecting people. Building communities. Making a difference.
        </p>

        <div className="about-section">
          <h2>🌍 What is Helping Hands?</h2>
          <p>
            Helping Hands is a platform that connects people who need help with
            those who are willing to support. It allows users to post requests,
            manage schedules, and collaborate within their community.
          </p>
        </div>

        <div className="about-section">
          <h2>💡 What You Can Do</h2>
          <ul>
            <li>📌 Post and manage requests</li>
            <li>📍 Add location and timing</li>
            <li>✏️ Edit or delete your requests</li>
            <li>👥 View others' needs and contribute</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>🚀 Our Mission</h2>
          <p>
            We aim to simplify helping others by creating a platform where small
            actions can lead to meaningful impact. Together, we build stronger,
            more supportive communities.
          </p>
        </div>

        <div className="about-footer">
          ❤️ Built to make helping easier.
        </div>

      </div>
    </>
  );
}

export default About;