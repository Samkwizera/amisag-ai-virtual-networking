"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  speed?: number
  colors?: string[]
  children?: React.ReactNode
}

export function ParticleBackground({
  className = "",
  particleCount = 50,
  speed = 1,
  colors = [
    "oklch(0.75 0.15 85)",
    "oklch(0.65 0.15 220)",
    "oklch(0.7 0.12 100)",
  ],
  children,
}: ParticleBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    [particleCount, colors]
  )

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              opacity: 0.4,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            animate={{
              x: [
                0,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                0,
              ],
              y: [
                0,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                0,
              ],
              scale: [1, 1.5, 0.8, 1],
              opacity: [0.4, 0.8, 0.3, 0.4],
            }}
            transition={{
              duration: particle.duration * speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Connecting lines between nearby particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {particles.slice(0, 20).map((particle, i) => {
          const nextParticle = particles[(i + 1) % 20]
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${particle.x}%`}
              y1={`${particle.y}%`}
              x2={`${nextParticle.x}%`}
              y2={`${nextParticle.y}%`}
              stroke={particle.color}
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          )
        })}
      </svg>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

