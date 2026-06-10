import React from 'react';
import { Terminal, Cpu, Database, BookOpen, Heart } from 'lucide-react';

export const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Languages",
      icon: <Terminal className="category-icon" />,
      color: "cyan",
      skills: ["Java", "C", "Python", "JavaScript", "HTML & CSS", "SQL"]
    },
    {
      title: "Tools & Frameworks",
      icon: <Cpu className="category-icon" />,
      color: "purple",
      skills: ["React", "Flask", "Git", "GitHub", "VS Code", "Figma", "Canva", "Power BI", "Excel", "Jupyter", "Antigravity"]
    },
    {
      title: "Databases & Cloud",
      icon: <Database className="category-icon" />,
      color: "blue",
      skills: ["MySQL", "Firebase", "MongoDB", "Relational Databases"]
    },
    {
      title: "Relevant Coursework",
      icon: <BookOpen className="category-icon" />,
      color: "green",
      skills: ["Data Structures & Algorithms", "Database Management Systems", "Object Oriented Programming (OOPs)", "Operating Systems", "Data Mining & Machine Learning"]
    },
    {
      title: "Soft Skills",
      icon: <Heart className="category-icon" />,
      color: "pink",
      skills: ["Problem Solving", "Teamwork", "Time Management", "Emotional Intelligence", "Adaptability"]
    }
  ];

  return (
    <section id="skills" className="skills-section reveal">
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Technical Expertise</h2>
          <p className="section-subtitle">
            A comprehensive list of programming languages, tools, databases, coursework, and personal soft skills.
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div 
              key={index} 
              className={`skills-card glass-card border-${category.color}`}
            >
              <div className="category-header">
                <div className={`icon-circle bg-${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
              </div>
              <div className="skills-tag-cloud">
                {category.skills.map((skill, sIndex) => (
                  <span 
                    key={sIndex} 
                    className={`skill-tag tag-${category.color}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
