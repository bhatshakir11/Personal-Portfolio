import React, { useRef } from 'react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (default: 8)
  scale?: number;   // hover scale (default: 1.03)
  style?: React.CSSProperties;
}

export const Tilt: React.FC<TiltProps> = ({ 
  children, 
  className = '', 
  maxTilt = 8, 
  scale = 1.03,
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768) return;
    const card = ref.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    
    // Mouse position relative to the element
    const x = e.clientX - box.left; 
    const y = e.clientY - box.top;  
    
    // Center point coordinates
    const xc = box.width / 2;
    const yc = box.height / 2;
    
    // Calculate rotation angle based on distance from center
    const rotateY = ((x - xc) / xc) * maxTilt; 
    const rotateX = -((y - yc) / yc) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {children}
    </div>
  );
};
