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
      console.log(`Key pressed: ${e.key}`);
      if (["PrintScreen", "F11"].includes(e.key) || e.keyCode === 44 || e.keyCode === 122) {
        e.preventDefault();
        enableBlurOverlay();
        alert("Screenshots are disabled on this website.");
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

    document.addEventListener("keydown", disableKeys, { capture: true });
    document.addEventListener("touchstart", handleTouchStart, { capture: true });
    document.addEventListener("touchend", handleTouchEnd, { capture: true });
    document.addEventListener("keydown", handleVolumeKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", disableKeys);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("keydown", handleVolumeKeyDown);
    };
  }, [setupAntiScreenshotOverlay, enableBlurOverlay]);

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
