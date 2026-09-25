import React, { useEffect, useRef } from 'react';

const LIGHT_PALETTE = { node: [37, 99, 235], line: [59, 130, 246], accent: [245, 158, 11] };
const MAROON_PALETTE = { node: [159, 18, 57], line: [225, 29, 72], accent: [245, 158, 11] };
const DARK_PALETTE = { node: [147, 197, 253], line: [96, 165, 250], accent: [251, 191, 36] };
const rgba = (color, alpha) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;

/** A subtle constellation field that responds to the pointer and system theme. */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const darkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: innerWidth / 2, y: innerHeight / 2, targetX: innerWidth / 2, targetY: innerHeight / 2, active: false };
    let nodes = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastTime = performance.now();
    const getActivePalette = () => {
      const isMaroon = document.documentElement.getAttribute('data-theme') === 'maroon';
      if (isMaroon) return MAROON_PALETTE;
      return darkTheme.matches ? DARK_PALETTE : LIGHT_PALETTE;
    };
    let palette = getActivePalette();

    const createNodes = () => {
      const quantity = Math.max(30, Math.min(78, Math.round((width * height) / 19000)));
      nodes = Array.from({ length: quantity }, (_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { x, y, originX: x, originY: y, radius: index % 11 === 0 ? 2.1 : 0.8 + Math.random() * 1.15, phase: Math.random() * Math.PI * 2, driftX: (Math.random() - 0.5) * 0.055, driftY: (Math.random() - 0.5) * 0.045 };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    };

    let isScrolling = false;
    let scrollTimeout = null;
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    const draw = (time) => {
      if (isScrolling) {
        // Skip heavy canvas repaint during active scrolling for buttery smooth 60fps scrolling
        if (!reducedMotion.matches || pointer.active) animationFrame = requestAnimationFrame(draw);
        return;
      }

      const elapsed = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;

      context.beginPath();
      context.strokeStyle = rgba(palette.line, 0.12);
      context.lineWidth = 0.7;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!reducedMotion.matches) {
          node.originX += node.driftX * elapsed;
          node.originY += node.driftY * elapsed;
          if (node.originX < -20) node.originX = width + 20;
          if (node.originX > width + 20) node.originX = -20;
          if (node.originY < -20) node.originY = height + 20;
          if (node.originY > height + 20) node.originY = -20;
        }

        const deltaX = pointer.x - node.originX;
        const deltaY = pointer.y - node.originY;
        const distSqToPointer = deltaX * deltaX + deltaY * deltaY;
        const influence = pointer.active && distSqToPointer < 48400 ? Math.max(0, 1 - Math.sqrt(distSqToPointer) / 220) : 0;
        const wave = reducedMotion.matches ? 0 : Math.sin(time * 0.00035 + node.phase) * 2;
        node.x = node.originX + deltaX * influence * 0.085 + wave;
        node.y = node.originY + deltaY * influence * 0.085 + wave * 0.55;

        // Fast squared distance check
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          if (dx * dx + dy * dy < maxDistSq) {
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
          }
        }
      }
      context.stroke(); // Single batched draw call for all connecting lines!

      // Draw particle dots
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = rgba(i % 17 === 0 ? palette.accent : palette.node, 0.35);
        context.fill();
      }

      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 180);
        glow.addColorStop(0, rgba(palette.line, 0.075));
        glow.addColorStop(1, rgba(palette.line, 0));
        context.fillStyle = glow;
        context.fillRect(pointer.x - 180, pointer.y - 180, 360, 360);
      }

      if (!reducedMotion.matches || pointer.active) animationFrame = requestAnimationFrame(draw);
    };

    const restartAnimation = () => {
      cancelAnimationFrame(animationFrame);
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(draw);
    };
    const handlePointerMove = (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
      if (reducedMotion.matches) restartAnimation();
    };
    const handlePointerLeave = () => {
      pointer.active = false;
      if (reducedMotion.matches) restartAnimation();
    };
    const handleThemeChange = (event) => {
      palette = getActivePalette();
      restartAnimation();
    };

    const handleOlshcoThemeChange = () => {
      palette = getActivePalette();
      restartAnimation();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    darkTheme.addEventListener('change', handleThemeChange);
    reducedMotion.addEventListener('change', restartAnimation);
    window.addEventListener('olshco:themechange', handleOlshcoThemeChange);
    restartAnimation();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      darkTheme.removeEventListener('change', handleThemeChange);
      reducedMotion.removeEventListener('change', restartAnimation);
      window.removeEventListener('olshco:themechange', handleOlshcoThemeChange);
    };
  }, []);

  return (
    <div className="interactive-site-background" aria-hidden="true">
      <div className="interactive-site-background__aurora" />
      <canvas ref={canvasRef} className="interactive-site-background__canvas" />
    </div>
  );
}
