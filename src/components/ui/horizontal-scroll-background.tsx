"use client"

import { motion } from "framer-motion"

interface HorizontalScrollBackgroundProps {
  className?: string
  speed?: number
  children?: React.ReactNode
}

export function HorizontalScrollBackground({ 
  className = "", 
  speed = 20,
  children 
}: HorizontalScrollBackgroundProps) {
  // Create repeating pattern elements
  const patternElements = Array.from({ length: 3 }, (_, i) => i)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Horizontal scrolling background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="flex h-full"
          animate={{
            x: ["0%", "-33.333%"],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "300%",
          }}
        >
          {patternElements.map((set) => (
            <div key={set} className="flex h-full" style={{ width: "33.333%" }}>
              {/* Gradient orbs */}
              <div className="relative w-full h-full">
                <motion.div
                  className="absolute rounded-full blur-3xl opacity-30"
                  style={{
                    width: "400px",
                    height: "400px",
                    left: "10%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "radial-gradient(circle, oklch(0.75 0.15 85 / 0.4) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute rounded-full blur-3xl opacity-20"
                  style={{
                    width: "300px",
                    height: "300px",
                    right: "15%",
                    top: "20%",
                    background: "radial-gradient(circle, oklch(0.65 0.15 220 / 0.4) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute rounded-full blur-3xl opacity-25"
                  style={{
                    width: "350px",
                    height: "350px",
                    left: "60%",
                    bottom: "10%",
                    background: "radial-gradient(circle, oklch(0.75 0.15 85 / 0.3) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.25, 0.45, 0.25],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Overlay gradient for smooth edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      {/* Content */}
      {children && (
        <div className="relative z-20">
          {children}
        </div>
      )}
    </div>
  )
}

