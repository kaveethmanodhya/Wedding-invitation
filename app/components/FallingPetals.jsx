'use client';
import React, { useState } from 'react';

const FallingPetals = ({ color = '#C9956A' }) => {
  const [petals] = useState(() =>
    [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      fallDuration: 10 + Math.random() * 15,
      delay: -(Math.random() * 20),
      opacity: 0.4 + Math.random() * 0.4,
      swayA: (20 + Math.random() * 30),
      swayB: -(20 + Math.random() * 30),
    }))
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 40 }}
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="css-petal"
          style={{
            color,
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.fallDuration}s`,
            animationDelay: `${p.delay}s`,
            '--p-sway-a': `${p.swayA}px`,
            '--p-sway-b': `${p.swayB}px`,
            '--p-opacity': p.opacity,
          }}
        >
          <div className="css-petal-shape" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(FallingPetals, () => true);
