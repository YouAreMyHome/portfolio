// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Education from '../components/Education';
// import Awards from '../components/Awards'; // Hidden awards section
import Projects from '../components/Projects'; // Projects này sẽ hiển thị các dự án chính, không phải CleanURI hay Game
import Contact from '../components/Contact';

const HomePage = ({ setActiveSection, scrollToSection, performScroll }) => {
  // Logic IntersectionObserver để cập nhật activeSection cho HomePage
  // Bạn có thể chuyển logic IntersectionObserver từ App.jsx vào đây
  // và chỉ cho nó theo dõi các sections của HomePage
  useEffect(() => {
    const sections = ['home', 'education', 'projects', 'contact']; // Removed 'awards' section
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) observer.unobserve(element);
      });
    };
  }, [setActiveSection]);

  return (
    <>
      <Hero scrollToContact={() => performScroll('contact')} /> {/* Hero vẫn cần id="home" */}
      <Education /> {/* id="education" */}
      {/* <Awards /> */} {/* id="awards" - Hidden awards section */}
      <Projects /> {/* id="projects" - Component Projects của bạn sẽ cần điều chỉnh để chỉ hiển thị các dự án chính*/}
      <Contact /> {/* id="contact" */}
    </>
  );
};


export default HomePage;