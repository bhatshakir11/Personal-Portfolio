import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [transformStyle, setTransformStyle] = useState('translate(-50%, -50%) scale(1)');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchMode, setIsTouchMode] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  // Store previous ring coordinates to calculate relative frame speed
  const prevRingPos = useRef({ x: 0, y: 0 });
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Mouse Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
      setIsTouchMode(false);
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    // Touch Event Handlers for Mobile/Tablet
    const handleTouchStart = (e: TouchEvent) => {
      setIsTouchMode(true);
      setIsTouchActive(true);
      setIsHidden(false);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const targetX = touch.clientX;
        const targetY = touch.clientY - 50; // Offset Y by -50px so it floats above the finger and is clearly visible!
        setPosition({ x: targetX, y: targetY });
        setRingPosition({ x: targetX, y: targetY });
        prevRingPos.current = { x: targetX, y: targetY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      setIsTouchMode(true);
      setIsTouchActive(true);
      setIsHidden(false);
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const targetX = touch.clientX;
        const targetY = touch.clientY - 50; // Offset Y by -50px so it floats above the finger and is clearly visible!
        setPosition({ x: targetX, y: targetY });
      }
    };

    const handleTouchEnd = () => {
      setIsTouchActive(false);
      // Wait for fadeout animation before completely hiding
      touchTimeoutRef.current = setTimeout(() => {
        setIsHidden(true);
      }, 400);
    };

    // Register Mouse Listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Register Touch Listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Smooth animation loop for the outer trailing ring and fluid stretch calculation
  useEffect(() => {
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

        // Account for hover state scale or touch state scale
        const currentScale = (isTouchMode && isTouchActive) ? 2.2 : (isHovered ? 1.6 : 1.0);

        if (velocity > 0.5) {
          // Elongate (scaleX > 1) in direction of travel, squash (scaleY < 1) orthogonally
          setTransformStyle(
            `translate(-50%, -50%) rotate(${angle}deg) scale(${(1 + stretch) * currentScale}, ${(1 - stretch * 0.25) * currentScale})`
          );
        } else {
          setTransformStyle(`translate(-50%, -50%) scale(${currentScale})`);
        }

        return { x: nextX, y: nextY };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    animationFrameId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [position, isHovered, isTouchMode, isTouchActive]);

  // Track hover status on clickable objects
  useEffect(() => {
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
  }, []);

  if (isHidden) return null;

  // Opacity handling
  const ringOpacity = isTouchMode ? (isTouchActive ? 0.85 : 0) : 1;
  const dotOpacity = isTouchMode ? (isTouchActive ? 1 : 0) : 1;

  return (
    <div className={isHovered ? 'cursor-hover' : ''}>
      {/* Center tracking point */}
      <div
        className="custom-cursor-dot"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: dotOpacity,
          transition: 'opacity 0.4s ease, width 0.2s ease, height 0.2s ease, background-color 0.2s ease'
        }}
      />
      {/* Morphing fluid droplet ring */}
      <div
        className="custom-cursor-ring"
        style={{ 
          left: `${ringPosition.x}px`, 
          top: `${ringPosition.y}px`,
          transform: transformStyle,
          opacity: ringOpacity,
          transition: 'opacity 0.4s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease'
        }}
      />
    </div>
  );
};
