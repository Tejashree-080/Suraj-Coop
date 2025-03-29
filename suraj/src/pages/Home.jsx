import React from 'react';
import '../styles/Home.css';


const HomePage = () => {
    return (
      <div className="homepage">
        <header className="header">
          <h1>Suraj Co-Operative Society</h1>
          <button className="contact-btn">Contact us</button>
        </header>
        <main className="hero">
          <h2>Welcome to Our Society</h2>
          <p>Stay updated with the latest announcements, events, and community updates.</p>
        </main>
        <section className="announcements">
        <h2>Latest Announcements</h2>
        <ul>
          <li>Annual General Meeting on April 10th at 5 PM.</li>
          <li>Maintenance work scheduled for April 15th.</li>
          <li>Community cleanup drive on April 20th.</li>
        </ul>
      </section>
      <section className="view-documents">
        <h2>View Documents</h2>
        <p>Access important files related to the society’s redevelopment.</p>
        <button className="view-docs-btn">View Documents</button>
      </section>
      <section className="admin-panel">
        <h2>Admin Panel</h2>
        <button className="admin-btn">Admin Login</button>
      </section>
        <footer className="footer">
          <p>&copy; 2025 Suraj Cooperative Society. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default HomePage;
  