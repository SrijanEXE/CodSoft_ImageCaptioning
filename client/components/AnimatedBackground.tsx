import React from "react";

export function AnimatedBackground() {
  return (
    <div className="animated-bg">
      {/* Neural Grid Background */}
      <div className="neural-grid" />

      {/* Floating Particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={`particle-${i}`}
          className="bg-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div className="gradient-orb" />
      <div className="gradient-orb" />
      <div className="gradient-orb" />

      {/* Connection Lines */}
      <div className="connection-lines">
        <div className="connection-line" />
        <div className="connection-line" />
        <div className="connection-line" />
      </div>
    </div>
  );
}
