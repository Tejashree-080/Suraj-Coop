import React, { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const FileViewerPage = () => {
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');
  const isMouseInsideRef = useRef(true);
  let startY = 0; // Define startY to fix the undefined error

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
      overlay.style.pointerEvents = "none";
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
    // Always show the warning message in the overlay
    overlay.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:32px;text-align:center;font-weight:bold;text-shadow:2px 2px 4px #000;">Screenshots are disabled on this website.</div>';
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

    const disableKeys = (e) => {
      // Block PrintScreen, F11, and all function keys
      if (
        e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen" ||
        e.key === "F11" || e.keyCode === 122 || e.code === "F11" ||
        (e.key && e.key.startsWith("F") && !isNaN(parseInt(e.key.substring(1)))) ||
        (e.keyCode >= 112 && e.keyCode <= 123)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setupAntiScreenshotOverlay(); // Ensure overlay is set up
        enableBlurOverlay();
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
        }, 0);
        return false;
      }
      // Block Ctrl/Shift/Alt + PrintScreen and other combos
      if (
        (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) &&
        (e.key === "PrintScreen" || e.keyCode === 44 || e.code === "PrintScreen")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setupAntiScreenshotOverlay();
        enableBlurOverlay();
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
        }, 0);
        return false;
      }
      // Block Windows Snipping Tool (Win+Shift+S)
      if ((e.metaKey || e.key === "Meta" || e.keyCode === 91 || e.keyCode === 92) && e.shiftKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        setupAntiScreenshotOverlay();
        enableBlurOverlay();
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
        }, 0);
        return false;
      }
      // Block Mac screenshot shortcuts (Cmd+Shift+3, Cmd+Shift+4)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) {
        e.preventDefault();
        e.stopPropagation();
        setupAntiScreenshotOverlay();
        enableBlurOverlay();
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
        }, 0);
        return false;
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length >= 2) {
        enableBlurOverlay();
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length >= 2) {
        enableBlurOverlay();
      }
    };

    const handleVolumeKeyDown = (e) => {
      if (e.key === "Volume_Down" || e.keyCode === 182 || e.keyCode === 174) {
        enableBlurOverlay();
      }
    };

    // Enhanced: Block 3-finger screenshot gesture on mobile (Android/iOS)
    const handleMultiTouch = (e) => {
      if (e.touches && e.touches.length >= 3) {
        enableBlurOverlay();
        setTimeout(() => {
          alert("Screenshots are disabled on this website.");
        }, 0);
      }
    };

    // Add blur on rapid button clicks
    const handleRapidClick = (e) => {
      // Only trigger for left/middle/right mouse buttons
      if (e.type === "mousedown" || e.type === "mouseup" || e.type === "click") {
        enableBlurOverlay();
        setTimeout(() => {
          resetOverlay();
        }, 600); // Keep blur for a short time
      }
    };

    // Prevent automatic downloads (e.g., Ctrl+S, Save As, or browser download triggers)
    const preventDownload = (e) => {
      // Block Ctrl+S, Cmd+S, Ctrl+Shift+S, Cmd+Shift+S
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "s" || e.key === "S"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        enableBlurOverlay();
        setTimeout(() => {
          alert("Downloading or saving this file is disabled on this website.");
        }, 0);
        return false;
      }
      // Block browser download shortcut (Ctrl+J, Cmd+J)
      if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        e.stopPropagation();
        enableBlurOverlay();
        setTimeout(() => {
          alert("Accessing downloads is disabled on this website.");
        }, 0);
        return false;
      }
    };

    // Block right-click "Save As" and download context menu
    const preventContextMenu = (e) => {
      e.preventDefault();
      enableBlurOverlay();
      setTimeout(() => {
        alert("Downloading or saving this file is disabled on this website.");
      }, 0);
      return false;
    };

    // Listen for all mouse button events on the document
    document.addEventListener("mousedown", handleRapidClick, { capture: true });
    document.addEventListener("mouseup", handleRapidClick, { capture: true });
    document.addEventListener("click", handleRapidClick, { capture: true });

    document.addEventListener("keydown", disableKeys, { capture: true });
    document.addEventListener("keyup", disableKeys, { capture: true });
    document.addEventListener("touchstart", handleTouchStart, { capture: true });
    document.addEventListener("touchend", handleTouchEnd, { capture: true });
    document.addEventListener("touchstart", handleMultiTouch, { capture: true }); // 3-finger ss
    document.addEventListener("touchmove", handleMultiTouch, { capture: true });  // 3-finger ss
    document.addEventListener("keydown", handleVolumeKeyDown, { capture: true });
    document.addEventListener("keydown", preventDownload, { capture: true });
    document.addEventListener("contextmenu", preventContextMenu, { capture: true });

    return () => {
      document.removeEventListener("keydown", disableKeys);
      document.removeEventListener("keyup", disableKeys);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchstart", handleMultiTouch);
      document.removeEventListener("touchmove", handleMultiTouch);
      document.removeEventListener("keydown", handleVolumeKeyDown);
      document.removeEventListener("keydown", preventDownload);
      document.removeEventListener("contextmenu", preventContextMenu);

      document.removeEventListener("mousedown", handleRapidClick, { capture: true });
      document.removeEventListener("mouseup", handleRapidClick, { capture: true });
      document.removeEventListener("click", handleRapidClick, { capture: true });
    };
  }, [setupAntiScreenshotOverlay, enableBlurOverlay, resetOverlay]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', backgroundColor: '#93a7b9', color: '#1f2c3d', textAlign: 'center' }}>
        <h1>File Viewer</h1>
      </header>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        {fileUrl ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            title="PDF Viewer"
            style={{ width: '80%', height: '80%', border: 'none' }}
          ></iframe>
        ) : (
          <p>No file specified. Please provide a valid file URL in the query parameters.</p>
        )}
      </div>
    </div>
  );
};

export default FileViewerPage;
