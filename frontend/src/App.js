import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostRequest from "./pages/PostRequest";
import ViewRequests from "./pages/ViewRequests";
import About from "./pages/About";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* NEW PAGES */}
        <Route path="/post" element={<PostRequest />} />
        <Route path="/requests" element={<ViewRequests />} />

        <Route path="/about" element={<About />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;