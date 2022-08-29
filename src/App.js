import React, { useContext } from "react";
import "./assets/css/styles.css";
import "./assets/css/sitemap.css";

import Home from "./pages/Home";

import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Policy from "./pages/Policy";
import About from "./pages/About";
import BrandPromotion from "./pages/Brand-promotion";
import EventPromotion from "./pages/Event-promotion";
import Contact from "./pages/Contact-us";
import Terms from "./pages/Terms";
import Videos from "./pages/Videos";
import Event from "./pages/Events";
import Profile from "./pages/Profile";
import { AuthContext } from "./AuthContext";
import Register from "./pages/Register";
import NewPost from "./pages/NewPost";
import AllPosts from "./pages/AllPosts";

function App() {
  // assign currentuser
  const { currentUser } = useContext(AuthContext);
  // redirect no user to login page middleware
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/account/login" />;
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* redirect to login page if no user */}
        <Route
          path="/my-account"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/About-us" element={<About />} />
        <Route path="/brand-promotion" element={<BrandPromotion />} />
        <Route path="/event-promotion" element={<EventPromotion />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/events" element={<Event />} />
        <Route path="/watch-videos" element={<Videos />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/admin/new-post" element={<NewPost />} />
        <Route path="/admin/posts" element={<AllPosts />} />
        <Route component={Error} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
