import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor Component: Sacred Heart / Flame Sparkle Theme
 * Optimized with direct hardware-accelerated transform updates and throttled hover detection.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const haloRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const [sparkles, setSparkles] = useState([]);

  const mousePosRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });
  const animationFrameRef = useRef(null);
  const sparkleIdRef = useRef(0);

  useEffect(() => {
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice()) return;

    let hoverCheckTimeout = null;

    const onMouseMove = (e) => {
      if (!isVisible) setIsVisible(true);
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;

      // Direct DOM transform update — avoids React reconciliation overhead
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Throttled target check to eliminate layout querying during rapid movement
      if (!hoverCheckTimeout) {
        hoverCheckTimeout = setTimeout(() => {
          hoverCheckTimeout = null;
          const target = e.target;
          if (!target || !target.closest) return;
          const interactive = target.closest(
            'a, button, .btn-enroll-pill, .hero-discount-badge, .feature-card, .academic-card, .tab-btn, [role="button"]'
          );
          if (interactive) {
            setIsHovered(true);
            if (target.closest('.btn-enroll-pill, .btn-primary')) {
              setCursorType('button');
            } else {
              setCursorType('pointer');
            }
          } else if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.getAttribute?.('contenteditable') === 'true'
          ) {
            setIsHovered(true);
            setCursorType('text');
          } else {
            setIsHovered(false);
            setCursorType('default');
          }
        }, 40);
      }
    };

    const updateTrail = () => {
      const ease = 0.18;
      trailPosRef.current.x += (mousePosRef.current.x - trailPosRef.current.x) * ease;
      trailPosRef.current.y += (mousePosRef.current.y - trailPosRef.current.y) * ease;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${trailPosRef.current.x}px, ${trailPosRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationFrameRef.current = requestAnimationFrame(updateTrail);
    };

    const onMouseDown = (e) => {
      setIsClicked(true);

      const newSparkles = Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const dist = 18 + Math.random() * 20;
        return {
          id: ++sparkleIdRef.current,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 3 + Math.random() * 3,
        };
      });

      setSparkles((prev) => [...prev.slice(-10), ...newSparkles]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => !newSparkles.some((ns) => ns.id === s.id)));
      }, 500);
    };

    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animationFrameRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (hoverCheckTimeout) clearTimeout(hoverCheckTimeout);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="olshco-custom-cursor-wrapper" aria-hidden="true">
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className={`olshco-cursor-dot ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        }}
      />

      {/* Sacred Heart Radiant Flame Halo Ring */}
      <div
        ref={haloRef}
        className={`olshco-sacred-halo type-${cursorType} ${isHovered ? 'hovered' : ''} ${
          isClicked ? 'clicked' : ''
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        }}
      >
        {/* Flame Crown Sparkle */}
        <div className="sacred-flame-sparkle" />
        {/* Radiant Inner Glow Ring */}
        <div className="sacred-halo-inner-glow" />
      </div>

      {/* Click Sparkle Particles */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sacred-sparkle-burst"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            '--dx': `${sparkle.dx}px`,
            '--dy': `${sparkle.dy}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        />
      ))}
    </div>
  );
}
