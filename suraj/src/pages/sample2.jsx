import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const BuildingAnimation = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for different animation effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Foundation & Planning",
      description: "Starting with a solid foundation and detailed architectural planning",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='ground' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23d4a574;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23a67c52;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='concrete' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e0e0e0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23bdbdbd;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23f5f5f5'/%3E%3Crect x='0' y='400' width='800' height='200' fill='url(%23ground)'/%3E%3Crect x='150' y='350' width='500' height='50' fill='url(%23concrete)' stroke='%23999' stroke-width='2'/%3E%3Cg transform='translate(200,250)'%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='100' y1='0' x2='100' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='150' y1='0' x2='150' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='200' y1='0' x2='200' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='250' y1='0' x2='250' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='300' y1='0' x2='300' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='350' y1='0' x2='350' y2='100' stroke='%23666' stroke-width='4'/%3E%3Cline x1='400' y1='0' x2='400' y2='100' stroke='%23666' stroke-width='4'/%3E%3C/g%3E%3Cg fill='%23ffeb3b' stroke='%23f57c00' stroke-width='2'%3E%3Ccircle cx='100' cy='300' r='15'/%3E%3Crect x='85' y='315' width='30' height='40' rx='5'/%3E%3C/g%3E%3Cg fill='%23ffeb3b' stroke='%23f57c00' stroke-width='2'%3E%3Ccircle cx='700' cy='320' r='15'/%3E%3Crect x='685' y='335' width='30' height='40' rx='5'/%3E%3C/g%3E%3Ctext x='400' y='50' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23333'%3EFoundation Stage%3C/text%3E%3C/svg%3E",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 2,
      title: "Structural Framework",
      description: "Building the concrete frame structure with precise engineering",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='concrete2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23e8e8e8;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23c0c0c0;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23f0f8ff'/%3E%3Crect x='0' y='500' width='800' height='100' fill='%23d4a574'/%3E%3Crect x='200' y='450' width='400' height='50' fill='url(%23concrete2)' stroke='%23999' stroke-width='2'/%3E%3Cg fill='url(%23concrete2)' stroke='%23999' stroke-width='2'%3E%3Crect x='200' y='350' width='50' height='100'/%3E%3Crect x='300' y='350' width='50' height='100'/%3E%3Crect x='400' y='350' width='50' height='100'/%3E%3Crect x='500' y='350' width='50' height='100'/%3E%3Crect x='550' y='350' width='50' height='100'/%3E%3C/g%3E%3Crect x='200' y='340' width='400' height='20' fill='url(%23concrete2)' stroke='%23999' stroke-width='2'/%3E%3Cg fill='url(%23concrete2)' stroke='%23999' stroke-width='2'%3E%3Crect x='200' y='250' width='50' height='90'/%3E%3Crect x='300' y='250' width='50' height='90'/%3E%3Crect x='400' y='250' width='50' height='90'/%3E%3Crect x='500' y='250' width='50' height='90'/%3E%3Crect x='550' y='250' width='50' height='90'/%3E%3C/g%3E%3Crect x='200' y='240' width='400' height='20' fill='url(%23concrete2)' stroke='%23999' stroke-width='2'/%3E%3Cg transform='translate(250,150)'%3E%3Cline x1='0' y1='0' x2='0' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='50' y1='0' x2='50' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='100' y1='0' x2='100' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='150' y1='0' x2='150' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='200' y1='0' x2='200' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='250' y1='0' x2='250' y2='90' stroke='%23666' stroke-width='3'/%3E%3Cline x1='300' y1='0' x2='300' y2='90' stroke='%23666' stroke-width='3'/%3E%3C/g%3E%3Ctext x='400' y='40' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23333'%3EStructural Framework%3C/text%3E%3C/svg%3E",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 3,
      title: "Multi-Story Construction",
      description: "Adding floors with systematic construction methodology",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='building' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f5f5f5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23d0d0d0;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='crane' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffd700;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ffa500;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23e6f3ff'/%3E%3Crect x='0' y='500' width='800' height='100' fill='%23d4a574'/%3E%3Cg fill='url(%23building)' stroke='%23999' stroke-width='2'%3E%3Crect x='250' y='200' width='300' height='300'/%3E%3Crect x='270' y='220' width='50' height='60' fill='%23333'/%3E%3Crect x='330' y='220' width='50' height='60' fill='%23333'/%3E%3Crect x='390' y='220' width='50' height='60' fill='%23333'/%3E%3Crect x='450' y='220' width='50' height='60' fill='%23333'/%3E%3Crect x='510' y='220' width='50' height='60' fill='%23333'/%3E%3Crect x='270' y='320' width='50' height='60' fill='%23333'/%3E%3Crect x='330' y='320' width='50' height='60' fill='%23333'/%3E%3Crect x='390' y='320' width='50' height='60' fill='%23333'/%3E%3Crect x='450' y='320' width='50' height='60' fill='%23333'/%3E%3Crect x='510' y='320' width='50' height='60' fill='%23333'/%3E%3Crect x='270' y='420' width='50' height='60' fill='%23333'/%3E%3Crect x='330' y='420' width='50' height='60' fill='%23333'/%3E%3Crect x='390' y='420' width='50' height='60' fill='%23333'/%3E%3Crect x='450' y='420' width='50' height='60' fill='%23333'/%3E%3Crect x='510' y='420' width='50' height='60' fill='%23333'/%3E%3C/g%3E%3Cg transform='translate(600,50)'%3E%3Crect x='0' y='0' width='15' height='400' fill='url(%23crane)'/%3E%3Crect x='-100' y='100' width='200' height='15' fill='url(%23crane)'/%3E%3Crect x='85' y='100' width='15' height='300' fill='url(%23crane)'/%3E%3Crect x='-50' y='400' width='120' height='20' fill='%23666'/%3E%3C/g%3E%3Cg transform='translate(650,200)'%3E%3Crect x='0' y='0' width='15' height='250' fill='url(%23crane)'/%3E%3Crect x='-80' y='80' width='160' height='12' fill='url(%23crane)'/%3E%3Crect x='65' y='80' width='12' height='200' fill='url(%23crane)'/%3E%3Crect x='-30' y='280' width='90' height='15' fill='%23666'/%3E%3C/g%3E%3Ctext x='400' y='40' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23333'%3EMulti-Story Construction%3C/text%3E%3C/svg%3E",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 4,
      title: "Finishing & Details",
      description: "Final touches with professional finishing and architectural details",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='finished' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffeb3b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ffc107;stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='balcony' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f0f0f0;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='%23e1f5fe'/%3E%3Crect x='0' y='500' width='800' height='100' fill='%23d4a574'/%3E%3Cg fill='url(%23finished)' stroke='%23f57c00' stroke-width='2'%3E%3Crect x='200' y='150' width='400' height='350'/%3E%3C/g%3E%3Cg fill='%231976d2' stroke='%230d47a1' stroke-width='1'%3E%3Crect x='220' y='180' width='40' height='50'/%3E%3Crect x='280' y='180' width='40' height='50'/%3E%3Crect x='340' y='180' width='40' height='50'/%3E%3Crect x='400' y='180' width='40' height='50'/%3E%3Crect x='460' y='180' width='40' height='50'/%3E%3Crect x='520' y='180' width='40' height='50'/%3E%3Crect x='220' y='260' width='40' height='50'/%3E%3Crect x='280' y='260' width='40' height='50'/%3E%3Crect x='340' y='260' width='40' height='50'/%3E%3Crect x='400' y='260' width='40' height='50'/%3E%3Crect x='460' y='260' width='40' height='50'/%3E%3Crect x='520' y='260' width='40' height='50'/%3E%3Crect x='220' y='340' width='40' height='50'/%3E%3Crect x='280' y='340' width='40' height='50'/%3E%3Crect x='340' y='340' width='40' height='50'/%3E%3Crect x='400' y='340' width='40' height='50'/%3E%3Crect x='460' y='340' width='40' height='50'/%3E%3Crect x='520' y='340' width='40' height='50'/%3E%3Crect x='220' y='420' width='40' height='50'/%3E%3Crect x='280' y='420' width='40' height='50'/%3E%3Crect x='340' y='420' width='40' height='50'/%3E%3Crect x='400' y='420' width='40' height='50'/%3E%3Crect x='460' y='420' width='40' height='50'/%3E%3Crect x='520' y='420' width='40' height='50'/%3E%3C/g%3E%3Cg fill='url(%23balcony)' stroke='%23bdbdbd' stroke-width='1'%3E%3Crect x='570' y='180' width='30' height='50'/%3E%3Crect x='570' y='260' width='30' height='50'/%3E%3Crect x='570' y='340' width='30' height='50'/%3E%3Crect x='570' y='420' width='30' height='50'/%3E%3C/g%3E%3Crect x='350' y='450' width='60' height='50' fill='%236d4c41' stroke='%23424242' stroke-width='2'/%3E%3Ccircle cx='395' cy='475' r='3' fill='%23424242'/%3E%3Ctext x='400' y='40' text-anchor='middle' font-family='Arial' font-size='24' font-weight='bold' fill='%23333'%3EFinished Building%3C/text%3E%3C/svg%3E",
      color: "from-purple-500 to-pink-600"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const step = Math.floor(scrolled / (windowHeight * 0.8));
      setCurrentStep(Math.min(step, steps.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight 
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 10, -10, 5, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + Math.sin(i) * 30}%`
          }}
        />
      ))}
    </div>
  );

  const ProgressBar = () => (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%"
      }}
    />
  );

  const StepIndicator = () => (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
            index <= currentStep 
              ? 'bg-white border-white shadow-lg' 
              : 'bg-transparent border-white/50'
          }`}
          whileHover={{ scale: 1.3 }}
          animate={{
            scale: index === currentStep ? 1.4 : 1,
            boxShadow: index === currentStep ? "0 0 20px rgba(255,255,255,0.8)" : "none"
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <ProgressBar />
      <FloatingElements />
      <StepIndicator />
      
      {/* Hero Section */}
      <motion.section 
        className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden"
        style={{ 
          y: backgroundY,
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2
        }}
      >
        <motion.div 
          className="text-center z-10 text-white px-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Building Dreams
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Watch architecture come to life through innovation
          </motion.p>
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full"
            animate={{ 
              scaleX: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Building Steps */}
      {steps.map((step, index) => (
        <motion.section
          key={step.id}
          className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${step.color} relative overflow-hidden`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, margin: "-20%" }}
        >
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="container mx-auto px-6 z-10 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-white space-y-6"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            >
              <motion.div 
                className="text-6xl font-bold opacity-20"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                0{step.id}
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                {step.title}
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                {step.description}
              </p>
              
              <motion.div className="flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-2 bg-white/30 rounded-full"
                    animate={{
                      scaleX: index === currentStep ? [1, 1.2, 1] : 1,
                      opacity: index === currentStep ? [0.3, 0.7, 0.3] : 0.3
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-4"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5
                }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-80 object-contain rounded-2xl"
                  animate={index === currentStep ? {
                    scale: [1, 1.02, 1],
                    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </motion.div>

              {/* Floating construction elements */}
              <AnimatePresence>
                {index === currentStep && (
                  <>
                    <motion.div
                      className="absolute -top-8 left-1/4 text-4xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [20, -20, -40],
                        x: [0, 10, -5]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    >
                      🏗️
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-8 right-1/4 text-3xl"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [-20, 20, 40],
                        x: [0, -10, 5]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      ⚡
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Background animated shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 border border-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        </motion.section>
      ))}

      {/* Final CTA Section */}
      <motion.section 
        className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm-30 0c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z"/%3E%3C/g%3E%3C/svg%3E')`,
            opacity: 0.2,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <motion.div 
          className="text-center z-10 text-white px-4"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            Your Vision, Built
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ delay: 0.6 }}
          >
            Ready to start your construction journey?
          </motion.p>
          
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 10px 20px rgba(59, 130, 246, 0.2)",
                "0 15px 30px rgba(147, 51, 234, 0.3)",
                "0 10px 20px rgba(59, 130, 246, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Get Started Today
          </motion.button>
        </motion.div>

        {/* Animated building silhouette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent">
          <motion.svg 
            viewBox="0 0 1200 200" 
            className="w-full h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.rect
                key={i}
                x={i * 150}
                y={120 - Math.random() * 80}
                width={120}
                height={80 + Math.random() * 40}
                fill="url(#cityGradient)"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
                style={{ transformOrigin: "bottom" }}
              />
            ))}
            <defs>
              <linearGradient id="cityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1f2937", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#000000", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </motion.section>
    </div>
  );
};

export default BuildingAnimation;