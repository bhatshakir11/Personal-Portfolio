import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
    width: 0,
    left: 0,
    opacity: 0,
    height: 0
  });

  // Smooth pill position mapping
  useEffect(() => {
    const updatePill = () => {
      const targetId = hoveredSection || activeSection;
      const activeBtn = containerRef.current?.querySelector(
        `.nav-link-btn[data-id="${targetId}"]`
      ) as HTMLElement;

      if (activeBtn && window.innerWidth > 768) {
        setPillStyle({
          width: activeBtn.offsetWidth,
          left: activeBtn.offsetLeft,
          height: activeBtn.offsetHeight,
          opacity: 1
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    // Slight delay to ensure elements are fully painted
    const timeoutId = setTimeout(updatePill, 60);

    window.addEventListener('resize', updatePill);
    return () => {
      window.removeEventListener('resize', updatePill);
      clearTimeout(timeoutId);
    };
  }, [activeSection, hoveredSection, isMobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-70px 0px -60% 0px', // account for header offset
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 70; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="nav-logo" onClick={() => handleNavClick('home')}>
          <span className="logo-accent">SHAKIR</span>
          <span className="logo-main">BHAT</span>
        </div>

        <nav 
          ref={containerRef}
          className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}
        >
          {/* Sliding indicator background pill */}
          <div 
            className="nav-indicator-pill" 
            style={pillStyle}
          />
          {navItems.map((item) => (
            <button
              key={item.id}
              data-id={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => setHoveredSection(item.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="theme-icon" size={18} /> : <Moon className="theme-icon" size={18} />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};
