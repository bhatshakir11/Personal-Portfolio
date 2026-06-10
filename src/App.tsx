import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './App.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load and apply theme setting
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  };

  // Scroll Entrance Reveal Animation Trigger
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px' // triggers slightly before scrolling fully in
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, we can optionally stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Dynamic Animated Glass/Mesh Blobs in background */}
      <div className="bg-mesh">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Trailing Glow Custom Cursor */}
      <CustomCursor />

      {/* Navigation Header */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>

      {/* Footer Details */}
      <Footer />
    </>
  );
};

export default App;
