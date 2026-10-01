import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Positions
  const targetPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const prevRingPos = useRef({ x: 0, y: 0 });

  // Sizing tracking
  const ringWidth = useRef(36);
  const ringHeight = useRef(36);

  // States
  const isTouchMode = useRef(false);
  const isTouchActive = useRef(false);
  const isHovered = useRef(false);
  const isHidden = useRef(true);
  const isSnapped = useRef(false);
  const snapTarget = useRef<HTMLElement | null>(null);
  const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const containerEl = containerRef.current;
    if (!dotEl || !ringEl || !containerEl) return;

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

    // Touch support (hides cursor to save scrolling frames)
    const handleTouchStart = (e: TouchEvent) => {
      isTouchMode.current = true;
      isTouchActive.current = true;
      isHidden.current = true;
      updateVisibility();

      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
        touchTimeout.current = null;
      }

      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const targetX = touch.clientX;
        const targetY = touch.clientY - 40;
        targetPos.current = { x: targetX, y: targetY };
        ringPos.current = { x: targetX, y: targetY };
        dotPos.current = { x: targetX, y: targetY };
        prevRingPos.current = { x: targetX, y: targetY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      isTouchMode.current = true;
      isTouchActive.current = true;
      isHidden.current = true;
      updateVisibility();

      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        targetPos.current = { x: touch.clientX, y: touch.clientY - 40 };
      }
    };

    const handleTouchEnd = () => {
      isTouchActive.current = false;
      touchTimeout.current = setTimeout(() => {
        isHidden.current = true;
        updateVisibility();
      }, 300);
    };

    // Hover & snap detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const clickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('.clickable');

      if (clickable) {
        isHovered.current = true;
        containerEl.classList.add('cursor-hover');

        // Check eligibility for snapping (navbar options, cards badges, controls buttons)
        const isEligibleForSnap = 
          clickable.classList.contains('nav-link-btn') || 
          clickable.classList.contains('theme-toggle-btn') || 
          clickable.classList.contains('console-tab') ||
          clickable.classList.contains('console-action-btn') ||
          clickable.classList.contains('project-link-btn') ||
          clickable.classList.contains('btn-hero') ||
          clickable.classList.contains('filter-btn') ||
          clickable.classList.contains('floating-badge');

        const rect = clickable.getBoundingClientRect();
        // Limit snaps to moderately-sized elements to avoid cursor distortion
        if (isEligibleForSnap && rect.width < 240 && rect.height < 100) {
          isSnapped.current = true;
          snapTarget.current = clickable as HTMLElement;
        } else {
          isSnapped.current = false;
          snapTarget.current = null;
        }
      } else {
        isHovered.current = false;
        containerEl.classList.remove('cursor-hover');
        isSnapped.current = false;
        snapTarget.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    updateVisibility();

    let animationFrameId: number;

    const animate = () => {
      // 1. Move dot (tracks mouse coordinates directly)
      const dotDx = targetPos.current.x - dotPos.current.x;
      const dotDy = targetPos.current.y - dotPos.current.y;
      dotPos.current.x += dotDx * 0.45;
      dotPos.current.y += dotDy * 0.45;

      dotEl.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;

      // 2. Resolve snapping targets or standard coordinates
      let ringTargetX = targetPos.current.x;
      let ringTargetY = targetPos.current.y;
      let targetW = 36;
      let targetH = 36;

      if (isSnapped.current && snapTarget.current) {
        const rect = snapTarget.current.getBoundingClientRect();
        // Center the ring on the element
        ringTargetX = rect.left + rect.width / 2;
        ringTargetY = rect.top + rect.height / 2;
        targetW = rect.width + 10;
        targetH = rect.height + 8;

        // Custom shape updates
        ringEl.style.borderRadius = '16px'; 
        ringEl.style.animation = 'none'; // pause morphing
      } else {
        targetW = isHovered.current ? 48 : 36;
        targetH = isHovered.current ? 48 : 36;
        
        ringEl.style.borderRadius = ''; 
        ringEl.style.animation = 'fluid-morph 4s infinite alternate ease-in-out';
      }

      // 3. Smooth size changes (lerping)
      ringWidth.current += (targetW - ringWidth.current) * 0.16;
      ringHeight.current += (targetH - ringHeight.current) * 0.16;

      ringEl.style.width = `${ringWidth.current}px`;
      ringEl.style.height = `${ringHeight.current}px`;

      // 4. Smooth motion (lerping coordinates)
      const ringDx = ringTargetX - ringPos.current.x;
      const ringDy = ringTargetY - ringPos.current.y;
      const lerpSpeed = isSnapped.current ? 0.22 : 0.15; // Snaps pull in faster
      const nextX = ringPos.current.x + ringDx * lerpSpeed;
      const nextY = ringPos.current.y + ringDy * lerpSpeed;

      const rx = nextX - prevRingPos.current.x;
      const ry = nextY - prevRingPos.current.y;
      prevRingPos.current = { x: nextX, y: nextY };
      ringPos.current = { x: nextX, y: nextY };

      // Calculate trailing stretch
      const velocity = Math.sqrt(rx * rx + ry * ry);
      const angle = Math.atan2(ry, rx) * (180 / Math.PI);
      const stretch = isSnapped.current ? 0 : Math.min(velocity * 0.04, 0.4);

      let transformStr = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
      if (velocity > 0.5 && !isSnapped.current) {
        transformStr += ` rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.25})`;
      }

      ringEl.style.transform = transformStr;

      // 5. Visibility and opacity updates
      const ringOpacity = isTouchMode.current ? 0 : 1;
      const dotOpacity = isTouchMode.current ? 0 : (isSnapped.current ? 0.2 : 1);
      
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
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          willChange: 'transform, opacity, width, height'
        }}
      />
    </div>
  );
};
