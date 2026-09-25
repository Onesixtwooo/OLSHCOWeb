import React, { useEffect, useRef } from 'react';

/**
 * Particles Background Component
 * Inspired by shadcn.io/view/backgrounds/particles & Magic UI Particles
 * High-performance HTML5 canvas particle system with interactive cursor dynamics.
 */
export default function Particles({
  className = '',
  quantity = 120,
  staticity = 50,
  ease = 50,
  size = 1.2,
  refresh = false,
  color = '#93c5fd',
  vx = 0,
  vy = 0,
  style = {},
}) {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const context = useRef(null);
  const circles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  // Convert hex color to RGB
  const hexToRgb = (hex) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(color);

  const isVisible = useRef(true);
  const animFrameId = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();

    // Only animate when the hero particles container is visible on screen!
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animFrameId.current);
      }
    }, { threshold: 0 });

    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }

    const handleWindowResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });

    return () => {
      cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.current.x, mousePosition.current.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = (e) => {
    if (canvasRef.current && e) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const inside = x < canvasSize.current.w && x > 0 && y < canvasSize.current.h && y > 0;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.15).toFixed(2));
    const dx = (Math.random() - 0.5) * 0.2 + vx;
    const dy = (Math.random() - 0.5) * 0.2 + vy;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawParticles = () => {
    circles.current.length = 0;
    for (let i = 0; i < quantity; i++) {
      const circle = circleParams();
      circles.current.push(circle);
    }
  };

  const drawCircle = (circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size: pSize, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, pSize, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle, i) => {
      // Handle the alpha fade in
      const edge = [
        circle.x + circle.translateX - circle.size, // distance from left
        canvasSize.current.w - (circle.x + circle.translateX) - circle.size, // distance from right
        circle.y + circle.translateY - circle.size, // distance from top
        canvasSize.current.h - (circle.y + circle.translateY) - circle.size, // distance from bottom
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }

      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

      // Wrap-around boundary conditions
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        // Replace with new particle
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      } else {
        drawCircle(
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha,
          },
          true
        );
      }
    });
    if (isVisible.current) {
      animFrameId.current = window.requestAnimationFrame(animate);
    }
  };

  const remapValue = (value, start1, stop1, start2, stop2) => {
    const rel = (value - start1) / (stop1 - start1);
    return start2 + rel * (stop2 - start2);
  };

  return (
    <div
      className={`particles-container ${className}`}
      ref={canvasContainerRef}
      onMouseMove={onMouseMove}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Subtle bottom gradient glow */}
      <div
        style={{
          position: 'absolute',
          insetInline: 0,
          bottom: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(4, 18, 45, 0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
