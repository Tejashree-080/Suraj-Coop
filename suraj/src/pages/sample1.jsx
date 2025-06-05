import React from "react";
import "../styles/sample1.css";

function Home() {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="top-bar">
          <span>📞 +904 236 897 22</span>
          <span>✉️ info@email.com</span>
          <span>📍 San Andrees, USA</span>
        </div>
        <nav className="navbar">
          <div className="logo">BUILDERON</div>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Projects</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>We Construct Your <span>Dream Projects</span></h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <button>Learn More</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="left">
          <h2>Why Choose Us For Projects!</h2>
          <p>Magnam voluptatem doloremque. Eveniet ratione impedit labore magni?</p>
          <button>View All Services</button>
        </div>
        <div className="right">
          <div className="feature-box">🏗️ Modern Technique</div>
          <div className="feature-box">🧱 Quality Materials</div>
          <div className="feature-box">👷 Professional Team</div>
          <div className="feature-box">📞 24/7 Support</div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial">
        <img src="/worker.jpg" alt="worker" className="worker-img" />
        <blockquote>
          "We built Beautifully with the best possible materials and resources"
        </blockquote>
        <p>- Henry Scott, CEO</p>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <img src="/logo1.png" alt="Partner 1" />
        <img src="/logo2.png" alt="Partner 2" />
        <img src="/logo3.png" alt="Partner 3" />
        <img src="/logo4.png" alt="Partner 4" />
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-left">
          <img src="/about-img.jpg" alt="about" />
        </div>
        <div className="about-right">
          <h3>How we became best among others?</h3>
          <p>Introduction - Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
