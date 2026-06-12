import React from 'react';
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
    <section id="education" className="education-section reveal">
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            My academic path and grades from secondary school to my current engineering degree.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {educationData.map((item, index) => (
            <div 
              key={index} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
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
