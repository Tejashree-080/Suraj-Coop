import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import database from '../firebaseConfig'; // Use database from firebaseConfig
import { storage } from '../firebaseConfig'; // Use storage from firebaseConfig
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const navigate = useNavigate();

  // Fetch data from Firebase
  useEffect(() => {
    const announcementsRef = ref(database, 'announcements');
    const documentsRef = ref(database, 'documents');

    // Fetch announcements
    onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      setAnnouncements(data ? Object.values(data) : []);
    });

    // Fetch documents
    onValue(documentsRef, (snapshot) => {
      const data = snapshot.val();
      setDocuments(data ? Object.values(data) : []);
    });
  }, []);

  // Fetch gallery images
  useEffect(() => {
    const galleryRef = ref(database, 'images');

    onValue(galleryRef, async (snapshot) => {
      const data = snapshot.val();
      console.log("Gallery Data:", data); // Debug log to verify data structure
      if (data && typeof data === 'object') {
        const images = await Promise.all(
          Object.values(data).map(async (item) => {
            const url = item.url || await getDownloadURL(storageRef(storage, item.path));
            return { ...item, url };
          })
        );
        setGalleryImages(images);
      } else {
        console.warn("No gallery data found or invalid structure.");
        setGalleryImages([]); // Ensure galleryImages is an empty array if no data
      }
    }, (error) => {
      console.error("Error fetching gallery data:", error);
      setGalleryImages([]); // Handle Firebase errors gracefully
    });
  }, []);

  // Carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  const customStyles = {
    gradientBg: {
      background: "linear-gradient(135deg, #0C0420, #5D3C64)",
      color: "white"
    },
    headerBg: {
      background: "linear-gradient(135deg, #0C0420, #5D3C64)",
      backdropFilter: "blur(5px)"
    },
    pinkishPurple: {
      color: "#D391B0"
    },
    loginButton: {
      background: "#9F6496",
      transition: "background 0.3s"
    },
    heroText: {
      textShadow: "0px 2px 4px rgba(0,0,0,0.3)"
    },
    primaryButton: {
      background: "#D391B0",
      transition: "background 0.3s, transform 0.2s",
      border: "none"
    },
    outlineButton: {
      borderColor: "#D391B0",
      color: "white",
      transition: "background 0.3s, transform 0.2s"
    },
    sectionDark: {
      background: "rgba(93, 60, 100, 0.3)"
    },
    announcementCard: {
      background: "#7B466A",
      height: "300px"
    },
    announcementIndicator: {
      background: "rgba(255,255,255,0.3)",
      transition: "background 0.3s"
    },
    activeIndicator: {
      background: "#D391B0"
    },
    cardBg: {
      background: "#5D3C64"
    },
    dateBadge: {
      color: "#D391B0"
    },
    purpleButton: {
      background: "#9F6496",
      border: "none"
    },
    darkBg: {
      background: "#0C0420"
    },
    borderColor: {
      borderColor: "#7B466A"
    },
    iconWrapper: {
      background: "#9F6496"
    },
    footerBg: {
      background: "#5D3C64"
    },
    footerText: {
      color: "#D391B0"
    },
    footerBorder: {
      borderTop: "1px solid #7B466A"
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={customStyles.gradientBg}>
      {/* Header */}
      <header className="py-3 sticky-top" style={customStyles.headerBg}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <h1 className="h3 fw-bold mb-0">Skyline Towers</h1>
            </div>
            <nav className="d-none d-md-flex gap-4">
              <a href="#home" className="text-decoration-none" style={customStyles.pinkishPurple}>Home</a>
              <a href="#updates" className="text-decoration-none" style={customStyles.pinkishPurple}>Updates</a>
              <a href="#gallery" className="text-decoration-none" style={customStyles.pinkishPurple}>Gallery</a>
              <a href="#documents" className="text-decoration-none" style={customStyles.pinkishPurple}>Documents</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-5 py-md-6 px-3 text-center" style={{ animation: "fadeIn 1s ease-in-out" }}>
        <div className="container">
          <h2 className="display-4 fw-bold mb-4" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.3)" }}>
            Building Your Future Home
          </h2>
          <p className="fs-5 mx-auto mb-5" style={{ maxWidth: "700px" }}>
            Stay informed about the latest developments in your future home. Track construction progress,
            access important documents, and join community meetings.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-lg px-4 py-2 rounded-3 fw-medium" style={{
              background: "#D391B0",
              transition: "background 0.3s, transform 0.2s",
              border: "none"
            }}>View Progress</button>
            <button className="btn btn-lg px-4 py-2 rounded-3 fw-medium border-2" style={{
              borderColor: "#D391B0",
              color: "white",
              transition: "background 0.3s, transform 0.2s"
            }}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Announcements Carousel */}
      <section id="updates" className="py-5" style={customStyles.sectionDark}>
        <div className="container py-3">
          <h2 className="h2 fw-bold mb-5 text-center">Latest Announcements</h2>
          <div className="position-relative overflow-hidden rounded-4 shadow mx-auto"
            style={{
              background: customStyles.announcementCard.background,
              minHeight: "300px",
              maxWidth: "800px"
            }}>
            <div className="carousel-container position-relative h-100">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="announcement-item position-absolute top-0 start-0 end-0 h-100 d-flex flex-column align-items-center"
                  style={{
                    opacity: index === activeAnnouncement ? 1 : 0,
                    visibility: index === activeAnnouncement ? 'visible' : 'hidden',
                    transition: "opacity 0.5s ease-in-out",
                    zIndex: index === activeAnnouncement ? 1 : 0,
                    padding: "2.5rem"
                  }}
                >
                  <div className="badge rounded-pill mb-3 px-3 py-2" style={customStyles.darkBg}>
                    {announcement.date}
                  </div>
                  <h3 className="fs-3 fw-bold mb-3 text-center">{announcement.title}</h3>
                  <p className="text-center mx-auto" style={{ maxWidth: "600px" }}>{announcement.content}</p>
                </div>
              ))}
            </div>

            <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center gap-2 mb-3 z-10">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  className="border-0 rounded-circle"
                  style={{
                    width: "12px",
                    height: "12px",
                    cursor: "pointer",
                    ...customStyles.announcementIndicator,
                    ...(index === activeAnnouncement ? customStyles.activeIndicator : {})
                  }}
                  onClick={() => setActiveAnnouncement(index)}
                  aria-label={`Announcement ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="position-absolute top-50 start-0 translate-middle-y bg-transparent border-0 text-white ms-2 z-10"
              onClick={() => setActiveAnnouncement(prev => (prev - 1 + announcements.length) % announcements.length)}
              aria-label="Previous announcement"
              style={{ zIndex: 2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
              </svg>
            </button>

            <button
              className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-white me-2 z-10"
              onClick={() => setActiveAnnouncement(prev => (prev + 1) % announcements.length)}
              aria-label="Next announcement"
              style={{ zIndex: 2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Add this CSS to the existing styles */}
        <style jsx>{`
    .announcement-item {
      animation: fadeEffect 0.5s ease-in-out;
    }
    
    @keyframes fadeEffect {
      from { opacity: 0.7; }
      to { opacity: 1; }
    }
    
    /* Hover effect for navigation buttons */
    button svg {
      opacity: 0.7;
      transition: opacity 0.3s, transform 0.2s;
    }
    
    button:hover svg {
      opacity: 1;
      transform: scale(1.2);
    }
  `}</style>
      </section>

      {/* Construction Progress Gallery */}
      <section id="gallery" className="py-5">
        <div className="container py-3">
          <h2 className="h2 fw-bold mb-5 text-center">Construction Progress</h2>
          {galleryImages.length === 0 ? (
            <p className="text-center text-muted">No images available at the moment.</p>
          ) : (
            <div className="row g-4 justify-content-center color-white">
              {galleryImages.map((image, index) => (
                <div key={index} className="col-md-4 col-sm-6">
                  <div className="card h-100 border-0 shadow rounded-4 overflow-hidden" style={customStyles.cardBg}>
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <img
                        src={image.url}
                        alt={image.name || "Gallery Image"}
                        className="w-100 h-100 object-fit-cover"
                        style={{ transition: "transform 500ms", transformOrigin: "center" }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                      />
                    </div>
                    <div className="card-body  color-white">
                      <h3 className="fw-bold fs-5 mb-1">{image.name}</h3>
                      <p className="small" style={customStyles.dateBadge}>{image.uploadDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="d-flex justify-content-center mt-4">
            <button className="btn px-4 py-2 rounded-3 fw-medium" style={customStyles.purpleButton}>
              View All Photos
            </button>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents" className="py-5" style={customStyles.sectionDark}>
        <div className="container py-3">
          <h2 className="h2 fw-bold mb-5 text-center">Important Documents</h2>
          <div className="mx-auto rounded-4 overflow-hidden shadow" style={{
            ...customStyles.cardBg,
            maxWidth: "800px"
          }}>
            <div className="p-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between py-3 px-3 border-bottom rounded-3 mb-2"
                  style={customStyles.borderColor}
                >
                  <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center rounded-3 me-3" style={{
                      ...customStyles.iconWrapper,
                      width: "48px",
                      height: "48px"
                    }}>
                      {doc.type}
                    </div>
                    <div>
                      <h4 className="fw-medium mb-0">{doc.name}</h4>
                      <p className="small mb-0" style={customStyles.dateBadge}>{doc.uploadDate}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm rounded-3 px-3"
                    style={customStyles.primaryButton}
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Panel Quick Access */}
      <section className="py-4" style={customStyles.darkBg}>
        <div className="container text-center py-2">
          <h2 className="h3 fw-bold mb-3">Admin Access</h2>
          <p className="mb-4">For property managers and society administrators</p>
          <button
            className="btn px-4 py-2 rounded-3 fw-medium"
            style={customStyles.purpleButton}
            onClick={() => navigate('/Login')} // Navigate to /Login on click
          >
            Admin Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 mt-auto" style={customStyles.footerBg}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <h3 className="h5 fw-bold mb-2">Skyline Towers</h3>
              <p className="small mb-0" style={customStyles.footerText}>A premium residential project by Horizon Developers</p>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h4 className="h6 fw-medium mb-2">Contact</h4>
                  <p className="small mb-0">support@skylinetowers.com</p>
                  <p className="small mb-0">(555) 123-4567</p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-medium mb-2">Address</h4>
                  <p className="small mb-0">123 Construction Ave</p>
                  <p className="small mb-0">Metropolis, MP 12345</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center small mt-4 pt-4" style={customStyles.footerBorder}>
            &copy; 2025 Skyline Towers. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;