import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable refs to hold coordinate state without triggering React renders
  const targetPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 }); // Current dot position
  const ringPos = useRef({ x: 0, y: 0 }); // Current ring position
  const prevRingPos = useRef({ x: 0, y: 0 });

  const isTouchMode = useRef(false);
  const isTouchActive = useRef(false);
  const isHovered = useRef(false);
  const isHidden = useRef(true);
  const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const containerEl = containerRef.current;
    if (!dotEl || !ringEl || !containerEl) return;

    // Helper to update cursor visibility instantly in the DOM
    const updateVisibility = () => {
      if (isHidden.current) {
        containerEl.style.opacity = '0';
        containerEl.style.visibility = 'hidden';
      } else {
        containerEl.style.opacity = '1';
        containerEl.style.visibility = 'visible';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      isTouchMode.current = false;
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (isHidden.current) {
        isHidden.current = false;
        updateVisibility();
      }
    };

    const handleMouseLeave = () => {
      isHidden.current = true;
      updateVisibility();
    };

    const handleMouseEnter = () => {
      isHidden.current = false;
      updateVisibility();
    };

    // Touch Event Handlers: Disable cursor on touchscreens to prevent drag/scroll lag
    const handleTouchStart = (e: TouchEvent) => {
      isTouchMode.current = true;
      isTouchActive.current = true;
      // Hide cursor on touch devices to ensure 100% smooth scrolling
      isHidden.current = true;
      updateVisibility();

      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
        touchTimeout.current = null;
      }

      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const targetX = touch.clientX;
        const targetY = touch.clientY - 50; // offset above finger
        targetPos.current = { x: targetX, y: targetY };
        ringPos.current = { x: targetX, y: targetY };
        dotPos.current = { x: targetX, y: targetY };
        prevRingPos.current = { x: targetX, y: targetY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      isTouchMode.current = true;
      isTouchActive.current = true;
      isHidden.current = true; // Keep hidden on touch movement to save layout resources
      updateVisibility();

      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
        touchTimeout.current = null;
      }
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const targetX = touch.clientX;
        const targetY = touch.clientY - 50;
        targetPos.current = { x: targetX, y: targetY };
      }
    };

    const handleTouchEnd = () => {
      isTouchActive.current = false;
      touchTimeout.current = setTimeout(() => {
        isHidden.current = true;
        updateVisibility();
      }, 400);
    };

    // Hover detection over links, buttons, and clickable containers
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

      isHovered.current = !!isClickable;
      if (isHovered.current) {
        containerEl.classList.add('cursor-hover');
      } else {
        containerEl.classList.remove('cursor-hover');
      }
    };

    // Register event listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    // Initial visibility state
    updateVisibility();

    // requestAnimationFrame animation loop
    let animationFrameId: number;

    const animate = () => {
      // Smoothly slide dot to target position
      const dotDx = targetPos.current.x - dotPos.current.x;
      const dotDy = targetPos.current.y - dotPos.current.y;
      dotPos.current.x += dotDx * 0.45;
      dotPos.current.y += dotDy * 0.45;

      dotEl.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;

      // Smoothly slide trailing ring (lerping)
      const ringDx = targetPos.current.x - ringPos.current.x;
      const ringDy = targetPos.current.y - ringPos.current.y;
      const lerpSpeed = 0.14;
      const nextX = ringPos.current.x + ringDx * lerpSpeed;
      const nextY = ringPos.current.y + ringDy * lerpSpeed;

      // Calculate velocity and stretch aspect ratio
      const rx = nextX - prevRingPos.current.x;
      const ry = nextY - prevRingPos.current.y;
      prevRingPos.current = { x: nextX, y: nextY };
      ringPos.current = { x: nextX, y: nextY };

      const velocity = Math.sqrt(rx * rx + ry * ry);
      const angle = Math.atan2(ry, rx) * (180 / Math.PI);
      const stretch = Math.min(velocity * 0.04, 0.45);

      const currentScale = (isTouchMode.current && isTouchActive.current) ? 2.2 : (isHovered.current ? 1.6 : 1.0);

      let transformStr = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
      if (velocity > 0.5) {
        transformStr += ` rotate(${angle}deg) scale(${(1 + stretch) * currentScale}, ${(1 - stretch * 0.25) * currentScale})`;
      } else {
        transformStr += ` scale(${currentScale})`;
      }

      ringEl.style.transform = transformStr;

      // Calculate opacity targets dynamically
      const ringOpacity = isTouchMode.current ? (isTouchActive.current ? 0.85 : 0) : 1;
      const dotOpacity = isTouchMode.current ? (isTouchActive.current ? 1 : 0) : 1;
      
      ringEl.style.opacity = String(ringOpacity);
      dotEl.style.opacity = String(dotOpacity);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 9999, 
        transition: 'opacity 0.4s ease, visibility 0.4s ease' 
      }}
    >
      {/* Center tracking point */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          willChange: 'transform, opacity'
        }}
      />
      {/* Morphing fluid droplet ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          willChange: 'transform, opacity'
        }}
      />
    </div>
  );
};
