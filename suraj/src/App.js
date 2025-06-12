import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import firebase from './firebaseConfig'; // Import the initialized Firebase instance
import './App.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PageNotFound from './pages/PageNotFound';
import FileViewerPage from './pages/FileViewerPage'; // Import the file viewer page

// Custom hook for anti-screenshot functionality
export const useAntiScreenshot = () => {
  const isMouseInsideRef = useRef(true);

  const setupAntiScreenshotOverlay = useCallback(() => {
    let overlay = document.getElementById("anti-screenshot-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "anti-screenshot-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backdropFilter = "blur(5px)";
      overlay.style.webkitBackdropFilter = "blur(5px)";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      overlay.style.zIndex = "2147483647";
      overlay.style.pointerEvents = "none"; // Ensure overlay does not block interactions
      overlay.style.transition = "all 0.1s ease";
      overlay.style.opacity = "0.05";
      document.body.appendChild(overlay);
    }
    return overlay;
  }, []);

  const enableBlurOverlay = useCallback(() => {
    let overlay = document.getElementById("anti-screenshot-overlay") || setupAntiScreenshotOverlay();
    overlay.style.transition = "none";
    requestAnimationFrame(() => {
      overlay.style.backdropFilter = "blur(30px)";
      overlay.style.webkitBackdropFilter = "blur(30px)";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      overlay.style.opacity = "1";
      requestAnimationFrame(() => {
        overlay.style.transition = "all 0.1s ease";
      });
    });
  }, [setupAntiScreenshotOverlay]);

  const resetOverlay = useCallback(() => {
    const overlay = document.getElementById("anti-screenshot-overlay");
    if (overlay && isMouseInsideRef.current) {
      overlay.style.backdropFilter = "blur(0px)";
      overlay.style.webkitBackdropFilter = "blur(0px)";
      overlay.style.opacity = "0.1";
      overlay.innerHTML = '';
    }
  }, []);

  useEffect(() => {
    setupAntiScreenshotOverlay();

    const handleMouseLeave = (e) => {
      if (e.relatedTarget === null || !document.documentElement.contains(e.relatedTarget)) {
        isMouseInsideRef.current = false;
        enableBlurOverlay();
      }
    };

    const handleMouseEnter = (e) => {
      if (e.relatedTarget === null || !document.documentElement.contains(e.relatedTarget)) {
        isMouseInsideRef.current = true;
        resetOverlay();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        enableBlurOverlay();
      } else if (document.visibilityState === "visible") {
        resetOverlay();
      }
    };

    const handleBlur = () => {
      enableBlurOverlay();
    };

    const handleFocus = () => {
      if (isMouseInsideRef.current) {
        resetOverlay();
      }
    };

    const disablePrintScreen = (e) => {
      if (e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen") {
        console.log("PrintScreen detected");
        e.preventDefault();
        enableBlurOverlay();
        alert("Screenshots are disabled on this website.");
      }
    };

    document.addEventListener("keydown", disablePrintScreen, { capture: true, passive: false });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("keydown", disablePrintScreen);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("blur", handleBlur);
      document.removeEventListener("focus", handleFocus);
    };
  }, [setupAntiScreenshotOverlay, enableBlurOverlay, resetOverlay]);

  return { setupAntiScreenshotOverlay, enableBlurOverlay, resetOverlay };
};

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            setLoggedInUser(user.uid);
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!loggedInUser) return;

      try {
        const userSnapshot = await firebase
          .database()
          .ref(`users/${loggedInUser}`)
          .once('value');
        setUserData(userSnapshot.val());
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [loggedInUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Login" element={<Login setLoggedInUser={setLoggedInUser} />} />
        <Route
          path="/AdminDashboard/"
          element={
            loggedInUser ? (
              <AdminDashboard loggedInUser={loggedInUser} userData={userData} />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route path="/view" element={<FileViewerPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
