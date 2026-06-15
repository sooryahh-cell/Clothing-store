"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const FloatingTshirts = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tshirts = [
    { id: 1, top: '15%', left: '10%', size: 350, delay: '0s', depth: 0.5 },
    { id: 2, top: '40%', left: '75%', size: 300, delay: '2s', depth: 0.8 },
    { id: 3, top: '70%', left: '20%', size: 400, delay: '4s', depth: 0.3 },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      perspective: '1000px'
    }}>
      {tshirts.map((t) => (
        <div
          key={t.id}
          style={{
            position: 'absolute',
            top: t.top,
            left: t.left,
            width: t.size,
            height: t.size,
            opacity: 0.15,
            filter: 'blur(2px)',
            transition: 'transform 0.1s ease-out',
            transform: `
              translate3d(
                ${mousePos.x * 30 * t.depth}px, 
                ${mousePos.y * 30 * t.depth}px, 
                0
              ) 
              rotateY(${mousePos.x * 15}deg)
              rotateX(${-mousePos.y * 15}deg)
            `
          }}
        >
          <Image
            src="/assets/tshirt.png"
            alt="Floating T-shirt"
            fill
            sizes="400px"
            style={{ objectFit: 'contain', animation: `float ${10 + t.id * 2}s infinite ease-in-out ${t.delay}` }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingTshirts;
