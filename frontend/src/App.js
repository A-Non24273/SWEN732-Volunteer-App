import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostRequest from "./pages/PostRequest";
import ViewRequests from "./pages/ViewRequests";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/post" element={<PostRequest />} />
        <Route path="/requests" element={<ViewRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;