import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import step1 from "../assets/1.png";
import step2 from "../assets/2.png";
import step3 from "../assets/3.png";
import step4 from "../assets/4.png";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { img: step1, title: "Foundation & Rod Work" },
  { img: step2, title: "Cement Layering" },
  { img: step3, title: "Painting the Structure" },
  { img: step4, title: "Final Look" },
];

const AnimatedSteps = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".step");

    sections.forEach((section, i) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen overflow-x-hidden">
      <h1 className="text-center text-4xl font-bold pt-16 pb-10">Building Construction Process</h1>

      <div className="space-y-32 px-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <section key={index} className="step relative">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="overflow-hidden rounded-3xl shadow-2xl"
            >
              <img
                src={step.img}
                alt={step.title}
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-1000"
              />
            </motion.div>
            <h2 className="text-3xl mt-6 text-center font-semibold">{step.title}</h2>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AnimatedSteps;
