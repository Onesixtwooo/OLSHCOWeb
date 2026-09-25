import React, { useEffect, useRef, useState } from 'react';

/**
 * RainBackground Component
 * Atmospheric rain animation with realistic falling droplets, multi-layer depth,
 * splash ripples, and subtle lightning flash effects.
 * Inspired by shadcn.io/view/backgrounds/rain
 */
export default function RainBackground({
  dropCount = 160,
  speed = 1.0,
  angle = 12, // degrees
  enableLightning = true,
  enableSplashes = true,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [lightningActive, setLightningActive] = useState(false);
  const [lightningIntensity, setLightningIntensity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Convert angle to radians and calculate dx/dy vectors
    const rad = (angle * Math.PI) / 180;
    const sinAngle = Math.sin(rad);
    const cosAngle = Math.cos(rad);

    // Drops definition with 3 depth layers
    const createDrop = (initialY = null) => {
      const z = 0.2 + Math.random() * 0.8; // Depth factor (0.2 to 1.0)
      const baseSpeed = (14 + Math.random() * 16) * speed * z;
      const baseLength = (16 + Math.random() * 24) * z;
      
      return {
        x: Math.random() * (width + Math.tan(rad) * height + 100) - 50,
        y: initialY !== null ? initialY : Math.random() * height,
        length: baseLength,
        speed: baseSpeed,
        thickness: Math.max(0.6, 1.6 * z),
        opacity: Math.min(0.85, (0.25 + Math.random() * 0.5) * z),
        z: z,
      };
    };

    const drops = Array.from({ length: dropCount }, () => createDrop());

    // Splashes on bottom impact
    const splashes = [];
    const createSplash = (x, y, z) => {
      if (!enableSplashes || Math.random() > 0.4) return;
      splashes.push({
        x: x,
        y: y,
        radius: 1 + Math.random() * 2,
        maxRadius: (4 + Math.random() * 8) * z,
        opacity: (0.4 + Math.random() * 0.4) * z,
        speed: 0.4 + Math.random() * 0.6,
      });
    };

    // Handle canvas resizing with high DPI support
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Animation Loop
    let lastTime = performance.now();

    const render = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2.0);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update drops
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        // Draw drop streak
        ctx.beginPath();
        ctx.lineWidth = drop.thickness;
        ctx.strokeStyle = `rgba(215, 235, 255, ${drop.opacity})`;

        const tailX = drop.x - drop.length * sinAngle;
        const tailY = drop.y - drop.length * cosAngle;

        ctx.moveTo(tailX, tailY);
        ctx.lineTo(drop.x, drop.y);
        ctx.stroke();

        // Update position
        drop.x += drop.speed * sinAngle * deltaTime;
        drop.y += drop.speed * cosAngle * deltaTime;

        // Reset if out of bounds
        if (drop.y > height + 20 || drop.x > width + 100) {
          createSplash(drop.x, height - 2, drop.z);
          // Recycle drop to top
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * (width + Math.tan(rad) * height + 100) - 50;
        }
      }

      // 2. Draw and update splash ripples
      if (enableSplashes && splashes.length > 0) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const splash = splashes[i];

          ctx.beginPath();
          ctx.ellipse(
            splash.x,
            splash.y,
            splash.radius * 1.8,
            splash.radius * 0.6,
            0,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(200, 230, 255, ${splash.opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          splash.radius += splash.speed * deltaTime;
          splash.opacity -= 0.025 * deltaTime;

          if (splash.opacity <= 0 || splash.radius >= splash.maxRadius) {
            splashes.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Lightning Flash Scheduler
    let lightningTimer;
    if (enableLightning) {
      const scheduleLightning = () => {
        // Random interval between 6 and 14 seconds
        const nextFlashIn = 6000 + Math.random() * 8000;
        lightningTimer = setTimeout(() => {
          triggerLightningFlash();
          scheduleLightning();
        }, nextFlashIn);
      };

      const triggerLightningFlash = () => {
        // Double-strike lightning effect
        setLightningActive(true);
        setLightningIntensity(0.35 + Math.random() * 0.25);

        setTimeout(() => {
          setLightningIntensity(0.08); // dip
          setTimeout(() => {
            setLightningIntensity(0.45 + Math.random() * 0.3); // second strike
            setTimeout(() => {
              setLightningIntensity(0);
              setTimeout(() => {
                setLightningActive(false);
              }, 200);
            }, 80);
          }, 60);
        }, 90);
      };

      scheduleLightning();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (lightningTimer) clearTimeout(lightningTimer);
      resizeObserver.disconnect();
    };
  }, [dropCount, speed, angle, enableLightning, enableSplashes]);

  return (
    <div
      ref={containerRef}
      className={`rain-background-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* HTML5 Canvas for falling droplets and splashes */}
      <canvas
        ref={canvasRef}
        className="rain-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric lightning flash overlay */}
      {enableLightning && (
        <div
          className="rain-lightning-flash"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(215, 235, 255, 1)',
            opacity: lightningIntensity,
            transition: 'opacity 70ms ease-out',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Atmospheric bottom ambient fog/gradient overlay */}
      <div
        className="rain-bottom-fog"
        style={{
          position: 'absolute',
          insetInline: 0,
          bottom: 0,
          height: '35%',
          background: 'linear-gradient(to top, rgba(4, 18, 45, 0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric vignette */}
      <div
        className="rain-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(3, 12, 30, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
