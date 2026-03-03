import React, { useMemo } from "react";

const generatePieces = (active) => {
  if (!active) return [];
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1}s`,
    duration: `${0.8 + Math.random() * 0.8}s`,
    size: `${12 + Math.random() * 16}px`,
    y: `${Math.random() * 100}vh`,
    emoji: ["🎉", "⭐", "✨", "🎊", "💫", "🌟"][Math.floor(Math.random() * 6)],
  }));
};

const Confetti = ({ active }) => {
  const pieces = useMemo(() => generatePieces(active), [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-bounce"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            transform: `translateY(${p.y})`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
