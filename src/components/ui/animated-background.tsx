"use client"

import { motion } from "framer-motion"

interface AnimatedBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedBackground({ children, className = "" }: AnimatedBackgroundProps) {
  // Create multiple floating orbs with different sizes, positions, and animations
  const orbs = [
    { size: 400, x: "10%", y: "20%", delay: 0, duration: 20, gradient: "radial-gradient(circle, oklch(0.75 0.15 85 / 0.2) 0%, transparent 70%)" },
    { size: 300, x: "80%", y: "10%", delay: 2, duration: 25, gradient: "radial-gradient(circle, oklch(0.65 0.15 220 / 0.2) 0%, transparent 70%)" },
    { size: 500, x: "70%", y: "60%", delay: 4, duration: 30, gradient: "radial-gradient(circle, oklch(0.75 0.15 85 / 0.15) 0%, transparent 70%)" },
    { size: 350, x: "20%", y: "70%", delay: 1, duration: 22, gradient: "radial-gradient(circle, oklch(0.65 0.15 220 / 0.15) 0%, transparent 70%)" },
    { size: 250, x: "50%", y: "40%", delay: 3, duration: 28, gradient: "radial-gradient(circle, oklch(0.75 0.15 85 / 0.1) 0%, transparent 70%)" },
  ]

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: orb.gradient,
            }}
            animate={{
              x: [0, 50, -30, 40, 0],
              y: [0, -40, 30, -20, 0],
              scale: [1, 1.1, 0.9, 1.05, 1],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(to right, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}