import React from 'react';
import { ArrowRight, Code, Cpu, Shield, LineChart } from 'lucide-react';
import { Tilt } from './Tilt';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
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

        <div className="hero-visual reveal active">
          {/* Orbital tracks */}
          <div className="visual-orbit orbit-1"></div>
          <div className="visual-orbit orbit-2"></div>

          {/* Interactive Tilt Console */}
          <Tilt className="hero-glass-panel glass-card">
            <div className="panel-header">
              <div className="dot-red"></div>
              <div className="dot-yellow"></div>
              <div className="dot-green"></div>
              <span className="panel-title">ai-agent-console.ts</span>
            </div>
            <div className="panel-body">
              <div>
                <span className="code-keyword">const</span> <span className="code-variable">engineer</span> = <span className="code-keyword">new</span> <span className="code-variable">AIAgent</span>(&#123;
              </div>
              <div style={{ paddingLeft: '16px' }}>
                <span className="code-property">name</span>: <span className="code-string">"Shakir Ahmad Bhat"</span>,
              </div>
              <div style={{ paddingLeft: '16px' }}>
                <span className="code-property">role</span>: <span className="code-string">"Intelligent Systems Engineer"</span>,
              </div>
              <div style={{ paddingLeft: '16px' }}>
                <span className="code-property">skills</span>: [
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <span className="code-string">"Multi-Agent AI"</span>,
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <span className="code-string">"Backend Systems"</span>,
              </div>
              <div style={{ paddingLeft: '32px' }}>
                <span className="code-string">"Fullstack Dev"</span>
              </div>
              <div style={{ paddingLeft: '16px' }}>
                ],
              </div>
              <div style={{ paddingLeft: '16px' }}>
                <span className="code-property">status</span>: <span className="code-string">"Active & Innovating"</span>
              </div>
              <div>&#125;);</div>
              <br />
              <div>
                <span className="code-keyword">await</span> <span className="code-variable">engineer</span>.<span className="code-property">solveRealWorldProblems</span>();
              </div>
            </div>
          </Tilt>

          {/* Floating micro glass-cards */}
          <div className="floating-glass-card floating-card-1">
            <Cpu size={18} className="micro-card-icon" />
            <span className="micro-card-text">Multi-Agent AI</span>
          </div>

          <div className="floating-glass-card floating-card-2">
            <Shield size={18} className="micro-card-icon" />
            <span className="micro-card-text">Cyber Security</span>
          </div>

          <div className="floating-glass-card floating-card-3">
            <LineChart size={18} className="micro-card-icon" />
            <span className="micro-card-text">Data Analytics</span>
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
