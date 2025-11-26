'use client';
import { useState, useEffect, useRef } from 'react';

export function DotsBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10 h-full w-full bg-background"
    >
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 1.5px, transparent 1.5px)',
          backgroundSize: '2rem 2rem',
        }}
      ></div>
       <div
        className="pointer-events-none absolute inset-0 h-full w-full bg-background"
        style={{
          maskImage: `radial-gradient(ellipse at ${mousePosition.x}px ${mousePosition.y}px, black 20%, transparent 50%)`,
          WebkitMaskImage: `radial-gradient(ellipse at ${mousePosition.x}px ${mousePosition.y}px, black 20%, transparent 50%)`,
        }}
      />
    </div>
  );
}
