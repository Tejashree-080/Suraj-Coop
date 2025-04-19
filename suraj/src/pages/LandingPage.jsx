
import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import database from '../firebaseConfig';
import { storage } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import building from '../assets/building1.jpg';

const LandingPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const [isMouseInside, setIsMouseInside] = useState(true);
  const isMouseInsideRef = useRef(true);
  const antiScreenshotStyleRef = useRef(null);
  const metaTagRef = useRef(null);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  // Update ref when state changes
  useEffect(() => {
    isMouseInsideRef.current = isMouseInside;
  }, [isMouseInside]);

  // Setup anti-screenshot overlay - modified to use refs
  const setupAntiScreenshotOverlay = useCallback(() => {
    // Clean up any existing overlay first to prevent duplicates
    if (overlayRef.current && overlayRef.current.parentNode) {
      overlayRef.current.parentNode.removeChild(overlayRef.current);
    }
    
    // Create a new overlay
    let overlay = document.createElement("div");
    overlay.id = "anti-screenshot-overlay-landing";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.webkitBackdropFilter = "blur(5px)";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "all 0.1s ease";
    overlay.style.opacity = "0.05";
    document.body.appendChild(overlay);
    
    // Store reference for cleanup
    overlayRef.current = overlay;
    return overlay;
  }, []);

  // Enable blur overlay - modified to use refs
  const enableBlurOverlay = useCallback(() => {
    console.log("Landing Page: Enabling blur overlay");
    let overlay = document.getElementById("anti-screenshot-overlay-landing") || setupAntiScreenshotOverlay();

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

    overlay.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:32px;text-align:center;font-weight:bold;text-shadow:2px 2px 4px #000;"></div>';

    const sensitiveElements = document.querySelectorAll('.sensitive-content');
    sensitiveElements.forEach(el => {
      el.dataset.originalContent = el.textContent;
      el.textContent = "****PROTECTED****";
    });
  }, [setupAntiScreenshotOverlay]);

  // Reset overlay - modified to use refs
  const resetOverlay = useCallback(() => {
    const overlay = document.getElementById("anti-screenshot-overlay-landing");
    if (overlay && isMouseInsideRef.current) {
      console.log("Landing Page: Resetting overlay, mouse is inside:", isMouseInsideRef.current);
      overlay.style.backdropFilter = "blur(0px)";
      overlay.style.webkitBackdropFilter = "blur(0px)";
      overlay.style.opacity = "0.1";
      overlay.innerHTML = '';

      const sensitiveElements = document.querySelectorAll('.sensitive-content');
      sensitiveElements.forEach(el => {
        if (el.dataset.originalContent) {
          el.textContent = el.dataset.originalContent;
        }
      });
    }
  }, []);

  // Fetch announcements and documents from Firebase
  useEffect(() => {
    const announcementsRef = ref(database, 'announcements');
    const documentsRef = ref(database, 'documents');

    onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      setAnnouncements(data ? Object.values(data) : []);
    });

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
        setGalleryImages([]);
      }
    }, (error) => {
      console.error("Error fetching gallery data:", error);
      setGalleryImages([]);
    });
  }, []);

  // Carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % Math.max(1, announcements.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Anti-screenshot protection setup - isolated to this component
  useEffect(() => {
    console.log("Landing Page: Setting up anti-screenshot protection");
    
    // Set up the initial overlay
    setupAntiScreenshotOverlay();

    // Mouse tracking handlers
    const handleMouseLeave = (e) => {
      if (e.relatedTarget === null || !document.documentElement.contains(e.relatedTarget)) {
        console.log("Landing Page: Mouse genuinely left window");
        setIsMouseInside(false);
        isMouseInsideRef.current = false;
        enableBlurOverlay();
      }
    };

    const handleMouseEnter = (e) => {
      if (e.relatedTarget === null || !document.documentElement.contains(e.relatedTarget)) {
        console.log("Landing Page: Mouse genuinely entered window");
        setIsMouseInside(true);
        isMouseInsideRef.current = true;
        resetOverlay();
      }
    };

    // Setup window-level mouse events
    window.addEventListener("mouseout", (e) => {
      if (e.relatedTarget === null && e.target === document.documentElement) {
        console.log("Landing Page: Mouse left window via window.mouseout");
        setIsMouseInside(false);
        isMouseInsideRef.current = false;
        enableBlurOverlay();
      }
    }, { capture: true });

    window.addEventListener("mouseover", (e) => {
      if (e.target === document.documentElement && (e.relatedTarget === null || !document.documentElement.contains(e.relatedTarget))) {
        console.log("Landing Page: Mouse entered window via window.mouseover");
        setIsMouseInside(true);
        isMouseInsideRef.current = true;
        resetOverlay();
      }
    }, { capture: true });

    // Mouse movement detection
    let mouseActivityTimeout;
    const handleMouseMove = () => {
      if (!isMouseInsideRef.current) {
        console.log("Landing Page: Mouse movement detected, mouse must be inside");
        setIsMouseInside(true);
        isMouseInsideRef.current = true;
        resetOverlay();
      }

      clearTimeout(mouseActivityTimeout);
      mouseActivityTimeout = setTimeout(() => {
        if (isMouseInsideRef.current && !document.hasFocus()) {
          console.log("Landing Page: No recent mouse activity and window not focused, assuming mouse left");
          setIsMouseInside(false);
          isMouseInsideRef.current = false;
          enableBlurOverlay();
        }
      }, 5000);
    };

    // Key event handlers
    const disableKeys = (e) => {
      // Print Screen
      if (e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen") {
        console.log("Landing Page: PrintScreen detected");
        e.preventDefault();
        e.stopPropagation();
        enableBlurOverlay();
        
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
          if (isMouseInsideRef.current) resetOverlay();
        }, 100);
        return false;
      }
      
      // F11 (Full screen)
      if (e.key === "F11" || e.keyCode === 122 || e.code === "F11") {
        console.log("Landing Page: F11 detected - blocking fullscreen");
        e.preventDefault();
        e.stopPropagation();
        enableBlurOverlay();

        if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => {
            console.error(`Error exiting fullscreen: ${err.message}`);
          });
        }

        setTimeout(() => {
          alert("Full screen mode is disabled on this website.");
          if (isMouseInsideRef.current) resetOverlay();
        }, 100);
        return false;
      }

      // Function keys
      if ((e.key && e.key.startsWith("F") && !isNaN(parseInt(e.key.substring(1)))) ||
        (e.keyCode >= 112 && e.keyCode <= 123)) {
        console.log(`Landing Page: Function key detected: ${e.key}`);
        enableBlurOverlay();
        e.preventDefault();
        e.stopPropagation();
        if (isMouseInsideRef.current) resetOverlay();
        return false;
      }

      // Windows key
      if (e.key === "Meta" || e.keyCode === 91 || e.keyCode === 92) {
        console.log("Landing Page: Windows/Meta key detected");
        enableBlurOverlay();
        e.preventDefault();
        e.stopPropagation();
        if (isMouseInsideRef.current) resetOverlay();
        return false;
      }

      // Key combinations
      if (e.ctrlKey || e.shiftKey || e.altKey) {
        const dangerousCombos = [
          { ctrl: true, key: "p" },        // Print
          { ctrl: true, shift: true, key: "i" }, // Dev tools
          { ctrl: true, shift: true, key: "j" }, // Dev tools
          { ctrl: true, shift: true, key: "c" }, // Dev tools
          { ctrl: true, shift: true, key: "k" }, // Dev tools
          { ctrl: true, key: "u" },        // View source
          { alt: true, key: "PrintScreen" }, // Window screenshot
          { shift: true, key: "PrintScreen" }, // Screenshot options
        ];

        for (const combo of dangerousCombos) {
          if ((combo.ctrl && e.ctrlKey) &&
            (!combo.shift || (combo.shift && e.shiftKey)) &&
            (!combo.alt || (combo.alt && e.altKey)) &&
            (e.key.toLowerCase() === combo.key.toLowerCase())) {

            // Allow copy if text is selected
            if (combo.key === "c" && e.ctrlKey && !e.shiftKey && !e.altKey &&
              window.getSelection().toString() !== "") {
              return; // Allow legitimate text copying
            }

            console.log(`Landing Page: Dangerous key combo detected: ${JSON.stringify(combo)}`);
            enableBlurOverlay();
            e.preventDefault();
            e.stopPropagation();
            if (isMouseInsideRef.current) resetOverlay();
            return false;
          }
        }
      }

      // Windows specific screenshot (Win+Shift+S)
      if ((e.metaKey || e.key === "Meta") && e.shiftKey && (e.key === "s" || e.key === "S")) {
        console.log("Landing Page: Windows snipping tool shortcut detected");
        enableBlurOverlay();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Mac specific screenshot shortcuts (Cmd+Shift+3, Cmd+Shift+4)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) {
        console.log("Landing Page: Mac screenshot shortcut detected");
        enableBlurOverlay();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Fullscreen handler
    function handleFullscreenChange() {
      console.log("Landing Page: Fullscreen change detected");
      enableBlurOverlay();

      if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) {

        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.error(`Error exiting fullscreen: ${err.message}`);
          });
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }

      if (isMouseInsideRef.current) resetOverlay();
    }

    // Touch handlers
    const handleTouchStart = (e) => {
      if (e.touches.length >= 2) {
        enableBlurOverlay();
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        enableBlurOverlay();
      }
      if ((e.touches && e.touches.length >= 2) ||
        (e.targetTouches && e.targetTouches.length >= 2)) {
        enableBlurOverlay();
      }
      lastTouchEnd = now;
    };

    // Visibility change handler
    const handleVisibilityChange = () => {
      console.log(`Landing Page: Visibility changed: ${document.visibilityState}`);
      if (document.visibilityState === "hidden") {
        enableBlurOverlay();
      } else if (document.visibilityState === "visible") {
        if (isMouseInsideRef.current) resetOverlay();
      }
    };

    // Focus/blur handlers
    const handleBlur = () => {
      console.log("Landing Page: Window lost focus");
      enableBlurOverlay();
    };

    const handleFocus = () => {
      console.log("Landing Page: Window gained focus");
      if (isMouseInsideRef.current) {
        resetOverlay();
      }
    };

    // Disable right-click menu
    const disableContextMenu = (e) => {
      console.log("Landing Page: Context menu blocked");
      e.preventDefault();
      return false;
    };

    // Apply CSS protection - store ref for cleanup
    const antiScreenshotStyle = document.createElement('style');
    antiScreenshotStyle.id = 'landing-page-anti-screenshot-style';
    antiScreenshotStyle.textContent = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        body:before {
          content: "Printing and screenshots are disabled";
          visibility: visible;
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          text-align: center;
          color: red;
        }
      }
      
      .landing-screenshot-protection * {
        transition: opacity 0.01s;
      }
      
      :fullscreen, ::backdrop {
        background-color: rgba(0,0,0,0.9) !important;
      }
      
      .landing-anti-screenshot * {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(antiScreenshotStyle);
    antiScreenshotStyleRef.current = antiScreenshotStyle;
    
    document.body.classList.add('landing-screenshot-protection');
    document.body.classList.add('landing-anti-screenshot');

    // Apply viewport restriction - store ref for cleanup
    const metaTag = document.createElement("meta");
    metaTag.id = "landing-anti-screenshot-viewport";
    metaTag.name = "viewport";
    metaTag.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(metaTag);
    metaTagRef.current = metaTag;

    // Set up focus check interval
    const focusCheckInterval = setInterval(() => {
      if (document.hasFocus()) {
        if (!isMouseInsideRef.current) {
          console.log("Landing Page: Window has focus but mouse marked as outside, waiting for explicit mouse action");
        }
      } else {
        if (isMouseInsideRef.current) {
          console.log("Landing Page: Window lost focus, mouse might be outside");
          setIsMouseInside(false);
          isMouseInsideRef.current = false;
          enableBlurOverlay();
        }
      }
    }, 2000);

    // Add all event listeners with capture phase for highest priority
    document.addEventListener("keydown", disableKeys, { capture: true, passive: false });
    document.addEventListener("keyup", disableKeys, { capture: true, passive: false });
    document.addEventListener("touchstart", handleTouchStart, { capture: true, passive: false });
    document.addEventListener("touchend", handleTouchEnd, { capture: true, passive: false });
    document.addEventListener("visibilitychange", handleVisibilityChange, { capture: true });
    document.addEventListener("blur", handleBlur, { capture: true });
    document.addEventListener("focus", handleFocus, { capture: true });
    document.addEventListener("contextmenu", disableContextMenu, { capture: true, passive: false });
    document.addEventListener("mouseleave", handleMouseLeave, { capture: true });
    document.addEventListener("mouseenter", handleMouseEnter, { capture: true });
    document.addEventListener("mousemove", handleMouseMove, { capture: true });
    document.addEventListener("fullscreenchange", handleFullscreenChange, { capture: true });
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange, { capture: true });
    document.addEventListener("mozfullscreenchange", handleFullscreenChange, { capture: true });
    document.addEventListener("MSFullscreenChange", handleFullscreenChange, { capture: true });
    
    // Special debug overlay for printscreen detection
    window.landingPageDebugAntiScreenshot = {
      printscreenDetected: () => {
        console.log("Landing Page: PrintScreen detected through debug");
        enableBlurOverlay();
      }
    };

    // CRITICAL: Comprehensive cleanup on component unmount
    return () => {
      console.log("Landing Page: Cleaning up anti-screenshot protection");
      document.removeEventListener("keydown", disableKeys);
      document.removeEventListener("keyup", disableKeys);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("blur", handleBlur);
      document.removeEventListener("focus", handleFocus);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

      // Remove window-level events
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseEnter);

      clearInterval(focusCheckInterval);
      clearTimeout(mouseActivityTimeout);

      // Remove overlay
      if (overlayRef.current && overlayRef.current.parentNode) {
        document.body.removeChild(overlayRef.current);
      }

      // Remove stylesheet
      if (antiScreenshotStyleRef.current && antiScreenshotStyleRef.current.parentNode) {
        document.head.removeChild(antiScreenshotStyleRef.current);
      }

      // Remove viewport meta tag
      if (metaTagRef.current && metaTagRef.current.parentNode) {
        document.head.removeChild(metaTagRef.current);
      }

      // Remove body classes specific to landing page
      document.body.classList.remove('landing-screenshot-protection');
      document.body.classList.remove('landing-anti-screenshot');

      // Remove global debug function
      if (window.landingPageDebugAntiScreenshot) {
        delete window.landingPageDebugAntiScreenshot;
      }
    };
  }, [setupAntiScreenshotOverlay, enableBlurOverlay, resetOverlay]);

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
              <h1 className="h3 fw-bold mb-0">Suraj Co-op Housing Society</h1>
            </div>
            <nav className="d-none d-md-flex gap-4 align-items-center">
              <a href="#home" className="text-decoration-none" style={customStyles.pinkishPurple}>Home</a>
              <a href="#updates" className="text-decoration-none" style={customStyles.pinkishPurple}>Updates</a>
              <a href="#gallery" className="text-decoration-none" style={customStyles.pinkishPurple}>Gallery</a>
              <a href="#documents" className="text-decoration-none" style={customStyles.pinkishPurple}>Documents</a>
              <button
                className="btn px-4 py-2 rounded-3 fw-medium"
                style={customStyles.purpleButton}
                onClick={() => navigate('/Login')}
              >
                Admin Login
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="py-5 py-md-6 px-3 text-center position-relative"
        style={{
          animation: "fadeIn 1s ease-in-out",
          backgroundImage: `url(${building})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
          minHeight: "70vh",
        }}
      >
        {/* Black shadow overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 0,
          }}
        ></div>

        {/* Content section */}
        <div className="container position-relative z-index-2 align-items-center">
          <h2
            className="display-4 fw-bold mb-4"
            style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.3)" }}
          >
            Building Your Future Home
          </h2>
          <p className="fs-5 mx-auto mb-5" style={{ maxWidth: "700px" }}>
            Stay informed about the latest developments in your future home. Track construction progress,
            access important documents, and join community meetings.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="tel:987654321">
              <button
                className="btn btn-lg px-4 py-2 rounded-3 fw-medium border-2"
                style={{
                  borderColor: "#D391B0",
                  color: "white",
                  transition: "background 0.3s, transform 0.2s"
                }}
              >
                Contact Us
              </button>
            </a>
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
              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
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
                ))
              ) : (
                <div className="announcement-item position-absolute top-0 start-0 end-0 h-100 d-flex flex-column align-items-center justify-content-center" style={{ padding: "2.5rem" }}>
                  <p className="text-center">No announcements available at the moment.</p>
                </div>
              )}
            </div>

            {announcements.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          .announcement-item {
            animation: fadeEffect 0.5s ease-in-out;
          }
          
          @keyframes fadeEffect {
            from { opacity: 0.7; }
            to { opacity: 1; }
          }
          
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
                        className="w-100 h-100 object-fit-cover gallery-image"
                        style={{ transition: "opacity 0.5s, transform 500ms", transformOrigin: "center" }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                      />
                    </div>
                    <div className="card-body color-white">
                      <h3 className="fw-bold fs-5 mb-1" style={{ color: "white" }}>{image.name}</h3>
                      <p className="small" style={{ color: "white" }}>{image.description}</p>
                      <p className="small" style={customStyles.dateBadge}>{image.uploadDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              {documents.length > 0 ? (
                documents.map((doc, index) => (
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
                ))
              ) : (
                <p className="text-center py-4">No documents available at the moment.</p>
              )}
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
            onClick={() => navigate('/Login')}
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
              <h3 className="h5 fw-bold mb-2">Suraj Co-op Housing Society</h3>
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