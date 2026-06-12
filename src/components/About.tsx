import React from 'react';
import { Award, GraduationCap, Percent, BookOpen } from 'lucide-react';
import profileImg from '../assets/profile.jpg';
import { Tilt } from './Tilt';

export const About: React.FC = () => {
  const stats = [
    {
      icon: <GraduationCap className="stat-icon" />,
      value: "9.35 CGPA",
      label: "B.E. Computer Science",
      desc: "New Horizon College of Engineering (VTU)"
    },
    {
      icon: <Percent className="stat-icon" />,
      value: "93.6%",
      label: "XII Standard",
      desc: "JKBOSE (Anantnag J&K)"
    },
    {
      icon: <Percent className="stat-icon" />,
      value: "84.2%",
      label: "X Standard",
      desc: "JKBOSE (Anantnag J&K)"
    }
  ];

  const certifications = [
    { title: "Artificial Intelligence", issuer: "NPTEL Certification" },
    { title: "Database Management System", issuer: "Coursera Certification" },
    { title: "Python for Machine Learning", issuer: "IIT Bombay Spoken Tutorial" },
    { title: "Git Version Control", issuer: "IIT Bombay Spoken Tutorial" }
  ];

  return (
    <section id="about" className="about-section reveal">
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A glance into my academic achievements, background, and certifications.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-image-wrapper">
            <div className="image-frame">
              <img src={profileImg} alt="Shakir Ahmad Bhat" className="profile-img" />
              <div className="floating-badge badge-top-right">
                <BookOpen size={16} /> <span>Learner</span>
              </div>
              <div className="floating-badge badge-bottom-left">
                <Award size={16} /> <span>Developer</span>
              </div>
            </div>
          </div>

          <div className="about-details">
            <h3 className="about-greeting">
              I'm a passionate problem solver and computer science researcher.
            </h3>
            <p className="about-text">
              I am currently pursuing a Bachelor of Computer Science and Engineering at New Horizon College of Engineering (affiliated to Visvesvaraya Technological University). With a solid foundation in software development, data analytics, and database management, I enjoy building efficient solutions to address real-world needs.
            </p>
            <p className="about-text">
              I thrive on learning new concepts, debugging complex codebases, and collaborating with cross-functional teams. I aim to write clean, performant code and leverage AI to build automated tools that enhance daily workflows and productivity.
            </p>

            {/* Academic stats cards */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <Tilt key={index} className="stat-card glass-card">
                  <div className="stat-icon-wrapper">{stat.icon}</div>
                  <h4 className="stat-value">{stat.value}</h4>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-desc">{stat.desc}</div>
                </Tilt>
              ))}
            </div>

            {/* Certifications Block */}
            <div className="certs-wrapper">
              <h4 className="certs-heading">Professional Certifications</h4>
              <div className="certs-grid">
                {certifications.map((cert, index) => (
                  <Tilt key={index} className="cert-item glass-card">
                    <div className="cert-indicator"></div>
                    <div className="cert-info">
                      <h5 className="cert-title">{cert.title}</h5>
                      <span className="cert-issuer">{cert.issuer}</span>
                    </div>
                  </Tilt>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
