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
      {/* HEADER */}
      <div className="header">
        <div className="header-left">User: {userId}</div>

        <div className="header-center">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>
          <span>Contact Us</span>
        </div>

        <div className="header-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* PAGE */}
      <div className="container page">
        <div className="app-title">About Helping Hands</div>

        <p style={{ marginTop: "15px" }}>
          Helping Hands is a community-driven platform that connects people who want to help 
          with those who need support. Our mission is to make volunteering simple, accessible, 
          and impactful.
        </p>

        <p>
          Over the years, we have organized multiple events such as food drives, beach cleanups, 
          and community support initiatives. Hundreds of volunteers have contributed their time 
          and effort to make a difference.
        </p>

        {/* IMAGES */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Volunteers"
          style={{ width: "100%", borderRadius: "10px", marginTop: "15px" }}
        />

        <img
          src="https://images.unsplash.com/photo-1509099836639-18ba1795216d"
          alt="Community"
          style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
        />

        <p style={{ marginTop: "15px" }}>
          Join Helping Hands and be part of something meaningful. Together, we can build a 
          stronger and more supportive community.
        </p>
      </div>
    </>
  );
}

export default About;