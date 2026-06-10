import React, { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      // Format as HH:MM:SS AM/PM
      const formatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer-section">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <span className="logo-accent">SHAKIR</span>BHAT
          </div>
          <div className="footer-text">
            Designing next-generation web platforms & intelligent software workflows.
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Shakir Ahmad Bhat. All rights reserved.
          </div>
          
          <div className="footer-tech">
            Built with React, TypeScript &amp; Vanilla CSS
          </div>

          {time && (
            <div className="footer-time-badge">
              <span className="time-dot"></span>
              <span>Local Time: {time}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
