import React, { useEffect, useRef } from 'react';

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120, // Proximity radius for mouse interaction
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4; // very slow drift
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1; // small particles
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update() {
        // Drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction: subtle push away
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Push particle away from mouse
          this.x -= Math.cos(angle) * force * 1.2;
          this.y -= Math.sin(angle) * force * 1.2;
        }
      }

      draw(context: CanvasRenderingContext2D, color: string) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      }
    }

    // Initialize particles
    // Count scales with screen size to keep density consistent
    const particleCount = Math.min(Math.floor((width * height) / 14000), 100);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Helper to extract theme colors from document body computed style
    const getThemeColors = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      
      return {
        particleColor: isDark ? 'rgba(100, 255, 218, 0.25)' : 'rgba(13, 148, 136, 0.2)',
        lineColorPrefix: isDark ? '100, 255, 218' : '13, 148, 136',
        isDark,
      };
    };


    let themeColors = getThemeColors();

    // Listen to theme change via AttributeObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          themeColors = getThemeColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Animation loop
    const draw = () => {
      if (document.hidden) {
        // Skip animation rendering if tab is in background to save battery
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw connections first
      const connectionDist = 135;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12; // faint connections
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${themeColors.lineColorPrefix}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx, themeColors.particleColor);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -9,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  );
};
