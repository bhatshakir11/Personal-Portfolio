import React, { useState, useEffect, useRef } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import './App.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  // Scroll Progress Tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && progressBarRef.current) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Entrance Reveal Animation Trigger for all directions
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
    
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px' // triggers slightly before scrolling fully in
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Card Hover Coordinate Tracking (for custom border glows)
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.glass-card') as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        ref={progressBarRef}
        className="scroll-progress-bar" 
        style={{ width: '0%' }}
      />

      {/* Dynamic Interactive Canvas Background */}
      <BackgroundCanvas />

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
