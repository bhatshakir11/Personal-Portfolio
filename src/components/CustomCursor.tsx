import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [transformStyle, setTransformStyle] = useState('translate(-50%, -50%) scale(1)');
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Store previous ring coordinates to calculate relative frame speed
  const prevRingPos = useRef({ x: 0, y: 0 });

  // Detect touch devices on mount
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouchDevice]);

  // Smooth animation loop for the outer trailing ring and fluid stretch calculation
  useEffect(() => {
    if (isTouchDevice) return;
    let animationFrameId: number;

    const updateRing = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        
        // Lerp speed factor
        const lerpSpeed = 0.14;
        const nextX = prev.x + dx * lerpSpeed;
        const nextY = prev.y + dy * lerpSpeed;

        // Calculate velocity (distance traveled in this frame)
        const rx = nextX - prevRingPos.current.x;
        const ry = nextY - prevRingPos.current.y;
        prevRingPos.current = { x: nextX, y: nextY };

        const velocity = Math.sqrt(rx * rx + ry * ry);
        const angle = Math.atan2(ry, rx) * (180 / Math.PI);

        // Map velocity to stretch scale (capped to prevent extreme distortion)
        const stretch = Math.min(velocity * 0.04, 0.45); 

        // Account for hover state scale
        const hoverScale = isHovered ? 1.6 : 1.0;

        if (velocity > 0.5) {
          // Elongate (scaleX > 1) in direction of travel, squash (scaleY < 1) orthogonally
          setTransformStyle(
            `translate(-50%, -50%) rotate(${angle}deg) scale(${(1 + stretch) * hoverScale}, ${(1 - stretch * 0.25) * hoverScale})`
          );
        } else {
          setTransformStyle(`translate(-50%, -50%) scale(${hoverScale})`);
        }

        return { x: nextX, y: nextY };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    animationFrameId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [position, isHovered, isTouchDevice]);

  // Track hover status on clickable objects
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.glass-card') ||
        target.closest('.clickable') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovered(!!isClickable);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isTouchDevice]);

  if (isTouchDevice || isHidden) return null;

  return (
    <div className={isHovered ? 'cursor-hover' : ''}>
      {/* Center tracking point */}
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Morphing fluid droplet ring */}
      <div
        className="custom-cursor-ring"
        style={{ 
          left: `${ringPosition.x}px`, 
          top: `${ringPosition.y}px`,
          transform: transformStyle
        }}
      />
    </div>
  );
};
