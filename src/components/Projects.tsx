import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Cpu, Leaf } from 'lucide-react';
import { Tilt } from './Tilt';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-github ${className}`}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  title: string;
  category: 'web' | 'ai';
  categoryLabel: string;
  icon: React.ReactNode;
  tags: string[];
  description: string[];
  github: string;
  demo: string; // URL link to the video or live website demo
  gradient: string;
}

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'web' | 'ai'>('all');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleDemoClick = (e: React.MouseEvent, demoUrl: string) => {
    if (demoUrl.endsWith('.mp4') || demoUrl.endsWith('.webm') || demoUrl.endsWith('.mov')) {
      e.preventDefault();
      setActiveVideo(demoUrl);
    }
  };

  const projectsData: Project[] = [
    {
      title: "Cyber Hygiene & Password Vault",
      category: "web",
      categoryLabel: "Web Application",
      icon: <ShieldCheck size={28} className="project-header-icon" />,
      tags: ["React", "Flask", "SQL", "APIs", "Cryptography"],
      description: [
        "Developed a secure credential management system using encryption techniques and database storage for safe password handling.",
        "Implemented biometric authentication and autofill features to enhance security and improve user convenience."
      ],
      github: "https://github.com/bhatshakir11/Cyber_Hygeine_Password_Manager",
      demo: "./cyberhygiene.mp4",
      gradient: "linear-gradient(135deg, #0d9488, #2563eb)"
    },
    {
      title: "Multi-Agent AI Productivity System",
      category: "ai",
      categoryLabel: "AI & ML",
      icon: <Cpu size={28} className="project-header-icon" />,
      tags: ["Python", "NVIDIA APIs", "Google API", "Telegram", "AI Agents"],
      description: [
        "Developed a multi-agent AI productivity system with Email, Calendar, Reminder, and News agents for task automation and workflow management.",
        "Implemented AI-powered email summarization, smart reminders, calendar scheduling, and daily productivity reports via WhatsApp and Telegram."
      ],
      github: "https://github.com/bhatshakir11/Multi_Agent_Productivity_AI",
      demo: "#", // <-- Insert your Multi-Agent AI demo video link here if available
      gradient: "linear-gradient(135deg, #7c3aed, #a855f7)"
    },
    {
      title: "Smart Crop AI System",
      category: "ai",
      categoryLabel: "AI & ML / Web App",
      icon: <Leaf size={28} className="project-header-icon" />,
      tags: ["React", "Flask", "SQL", "LLMs", "Image Analysis"],
      description: [
        "Developed a system to analyze soil nutrient data and detect crop diseases, providing actionable insights for better farming decisions.",
        "Implemented data processing and basic image analysis techniques to ensure accurate soil reports and disease identification."
      ],
      github: "https://github.com/bhatshakir11/Agro_Sense",
      demo: "#", // <-- Insert your Smart Crop AI demo video link here if available
      gradient: "linear-gradient(135deg, #10b981, #065f46)"
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <section id="projects" className="projects-section reveal">
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Personal Projects</h2>
          <p className="section-subtitle">
            A selection of key technical projects I have built, spanning secure web apps and multi-agent AI ecosystems.
          </p>
        </div>

        {/* Project Filters */}
        <div className="filter-wrapper">
          <button 
            onClick={() => setFilter('all')} 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Work
          </button>
          <button 
            onClick={() => setFilter('web')} 
            className={`filter-btn ${filter === 'web' ? 'active' : ''}`}
          >
            Web Apps
          </button>
          <button 
            onClick={() => setFilter('ai')} 
            className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}
          >
            AI & Automation
          </button>
        </div>

        {/* Projects Cards Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <Tilt key={index} className="project-card glass-card">
              <div 
                className="project-banner" 
                style={{ background: project.gradient }}
              >
                <div className="banner-overlay"></div>
                <div className="project-header">
                  <span className="project-category">{project.categoryLabel}</span>
                  {project.icon}
                </div>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                
                <ul className="project-bullets">
                  {project.description.map((bullet, bIndex) => (
                    <li key={bIndex}>{bullet}</li>
                  ))}
                </ul>

                <div className="project-tags">
                  {project.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="project-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link-btn clickable"
                  >
                    <GithubIcon size={16} /> Code
                  </a>
                  {project.demo && project.demo !== "#" && (
                    <a 
                      href={project.demo} 
                      onClick={(e) => handleDemoClick(e, project.demo)}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-link-btn clickable"
                    >
                      <ExternalLink size={16} /> Demo
                    </a>
                  )}
                </div>
              </div>
            </Tilt>
          ))}
        </div>
        {activeVideo && (
          <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
            <div className="video-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <button className="video-modal-close" onClick={() => setActiveVideo(null)}>
                &times;
              </button>
              <video src={activeVideo} controls autoPlay className="modal-video-player" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
