import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import firebase from './firebaseConfig'; // Import the initialized Firebase instance
import './App.css';

import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PageNotFound from './pages/PageNotFound';


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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
