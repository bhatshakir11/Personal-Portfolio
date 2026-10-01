import React, { useState, useEffect, useRef } from 'react';
import { Calendar, GraduationCap } from 'lucide-react';
import { Tilt } from './Tilt';

interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  grade: string;
  description: string;
}

export const Education: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progressHeight, setProgressHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance from top trigger (75% viewport height) to top of timeline
      const startTrigger = windowHeight * 0.75;
      const relativeScroll = startTrigger - rect.top;
      const timelineHeight = rect.height;

      if (relativeScroll < 0) {
        setProgressHeight(0);
      } else {
        const percent = Math.min((relativeScroll / timelineHeight) * 100, 100);
        setProgressHeight(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const educationData: EducationItem[] = [
    {
      degree: "Bachelor of Computer Science and Engineering",
      institution: "New Horizon College of Engineering (Affiliated to Visvesvaraya Technological University)",
      period: "2023 - 2027",
      grade: "CGPA: 9.35 / 10 (93.5% Equivalent)",
      description: "Focusing on core computer science subjects including Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems, and Machine Learning."
    },
    {
      degree: "XII Standard (JKBOSE)",
      institution: "Govt. Boys Higher Secondary School, Anantnag J&K",
      period: "2021 - 2022",
      grade: "Percentage: 93.6%",
      description: "Specialized in Science stream (Physics, Chemistry, Mathematics, Biotechnology) with a solid academic track record."
    },
    {
      degree: "X Standard (JKBOSE)",
      institution: "Govt. Boys Higher Secondary School, Anantnag J&K",
      period: "2019 - 2020",
      grade: "Percentage: 84.2%",
      description: "Completed general secondary education with strong fundamentals in Mathematics, Science, and Social Sciences."
    }
  ];

  return (
    <section id="education" className="education-section">
      <div className="container">
        <div className="section-title-wrapper reveal">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            My academic path and grades from secondary school to my current engineering degree.
          </p>
        </div>

        <div className="timeline-container" ref={timelineRef}>
          <div className="timeline-line">
            <div 
              className="timeline-line-progress"
              style={{ height: `${progressHeight}%` }}
            />
          </div>
          
          {educationData.map((item, index) => (
            <div 
              key={index} 
              className={`timeline-item ${index % 2 === 0 ? 'left reveal-left' : 'right reveal-right'}`}
              style={{ '--reveal-delay': `${index * 150}ms` } as React.CSSProperties}
            >
              <div className="timeline-dot">
                <GraduationCap size={16} />
              </div>
              
              <Tilt className="timeline-content glass-card">
                <div className="timeline-date">
                  <Calendar size={14} /> <span>{item.period}</span>
                </div>
                <h3 className="timeline-degree">{item.degree}</h3>
                <h4 className="timeline-institution">{item.institution}</h4>
                <div className="timeline-grade-badge">
                  <span>{item.grade}</span>
                </div>
                <p className="timeline-desc">{item.description}</p>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>

  );
};
