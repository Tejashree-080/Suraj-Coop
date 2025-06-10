import React, { useState, useEffect } from 'react';
import step1 from '../assets/1.png';
import step2 from '../assets/2.png';
import step3 from '../assets/3.png';
import step4 from '../assets/4.png';

const sections = [
  { 
    img: step1,
    title: "Foundation & Rod Work", 
    content: "Guarantees consistently high quality without overpayments. Our foundation work ensures strong and durable base structures.",
    textColor: "text-warning"
  },
  { 
    img: step2, 
    title: "Cement Layering", 
    content: "Products from this line are made for construction and repair of cottages. Professional cement application techniques.",
    textColor: "text-warning"
  },
  { 
    img: step3, 
    title: "Painting the Structure", 
    content: "Ensures durability and aesthetic appeal for structures. High-quality paints and finishing techniques for lasting results.",
    textColor: "text-warning"
  },
  { 
    img: step4, 
    title: "Final Look", 
    content: "Provides the final touch for a polished and professional appearance. Complete finishing and quality assurance.",
    textColor: "text-warning"
  },
];

const ConstructionStepsSection = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % sections.length);
    }, 1000); // Change every 0.5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-vh-70" style={{ backgroundColor: "#1f2c3d", color: "white" }}>
      {/* Header Section */}
      <div className="py-4 border-secondary">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="display-4 fw-bold mb-0">
            <span style={{ color: "white" }}>Construction</span>{" "}
            <span style={{ color: "#ffc107" }}>Process</span>
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="d-flex">
        {/* Left Content Panel */}
        <div className="flex-grow-1">
          <div className="p-5">
            <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-space-around;">
              {/* Image Section */}
              <div className="mb-4 mb-lg-0">
                <img
                  src={sections[activeSection].img}
                  alt={sections[activeSection].title}
                  className="img-fluid rounded"
                  style={{ maxWidth: '400px' }} // Increased image size
                />
              </div>

              {/* Text Content */}
              <div className="ms-lg-4">
                <h2 className={`display-5 fw-bold ${sections[activeSection].textColor}`}>
                  {sections[activeSection].title}
                </h2>
                <p className="fs-5">
                  {sections[activeSection].content}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Dots */}
          <div className="py-3">
            <div className="d-flex justify-content-center gap-3">
              {sections.map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm rounded-circle ${activeSection === index ? 'btn-warning animate-dot' : 'btn-secondary'}`}
                  style={{ width: '20px', height: '20px' }}
                  onClick={() => setActiveSection(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Vertical Navigation */}
        <div className="shadow-sm border-secondary" style={{ width: '200px', backgroundColor: "#1f2c3d" }}>
          {sections.map((section, index) => (
            <button
              key={index}
              className={`btn w-100 text-start py-3 animate-nav ${activeSection === index ? 'border-start border-warning' : ''}`}
              style={{ backgroundColor: "#1f2c3d", color: "white" }}
              onClick={() => setActiveSection(index)}
            >
              <span className="fw-bold">STEP {index + 1}</span>
              <h5 className="fw-bold mt-2">{section.title}</h5>
            </button>
          ))}
        </div>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-dot {
          transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
        }
        .animate-dot:hover {
          transform: scale(1.3);
          background-color: #ffc107;
        }

        .animate-nav {
          transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
        }
        .animate-nav:hover {
          transform: scale(1.05);
          background-color: #ffc107;
        }
      `}</style>
    </div>
    </div>
  );
};

export default ConstructionStepsSection;