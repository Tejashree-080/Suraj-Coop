import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "../styles/LoginPage.css";

function LoginPage({ setLoggedInUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  // Set the logged-in user if one exists when the component mounts
  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setLoggedInUser(user.uid);
    }
  }, [setLoggedInUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const loggedInUserId = userCredential.user.uid;

      // Navigate to a default dashboard
      setLoggedInUser(loggedInUserId);
      navigate("/AdminDashboard");
    } catch (error) {
      setErrors("Login failed! Please check your credentials.");
      console.error("Login Error:", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="body">
      <div className="container-login">
        <div className="left-section">
          <div className="left-section-content">
            <h2>Welcome Back!</h2>
            <p>Access your dashboard and manage your account.</p>
          </div>
        </div>
        <div className="right-section">
          <h2>Login</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            <input
              className="col-10"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="col-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="toggleShowPassword" onClick={toggleShowPassword}>
              {showPassword ? "Hide Password" : "Show Password"}
            </div>

            <a href="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </a>
            {errors && <span className="error-message">{errors}</span>}
            <button type="submit">Login</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
