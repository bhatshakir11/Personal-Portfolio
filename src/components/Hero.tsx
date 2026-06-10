import React from 'react';
import { ArrowRight, Code } from 'lucide-react';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge reveal active">
            <Code size={14} className="badge-icon" />
            <span>Computer Science & Engineering</span>
          </div>

          <h4 className="hero-intro reveal active">Hi, my name is</h4>
          <h1 className="hero-title reveal active">
            SHAKIR AHMAD BHAT
          </h1>
          <h2 className="hero-subtitle reveal active">
            I build intelligent solutions for the web and beyond.
          </h2>
          <p className="hero-description reveal active">
            A software development and data analytics enthusiast specializing in creating efficient backend architectures, AI agent workflows, and secure, high-performance web applications.
          </p>

          <div className="hero-ctas reveal active">
            <button
              onClick={() => handleScrollTo('projects')}
              className="btn btn-primary btn-hero"
            >
              Explore Projects <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="btn btn-secondary btn-hero"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-indicator" onClick={() => handleScrollTo('about')}>
        <div className="mouse-wheel-wrap">
          <span className="mouse-wheel"></span>
        </div>
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  );
};
