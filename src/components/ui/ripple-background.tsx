"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface RippleBackgroundProps {
  className?: string
  rippleCount?: number
  speed?: number
  color?: string
  children?: React.ReactNode
}

export function RippleBackground({
  className = "",
  rippleCount = 5,
  speed = 1,
  color = "oklch(0.75 0.15 85 / 0.3)",
  children,
}: RippleBackgroundProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number; startTime: number }>
  >([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prev) => {
        const newRipple = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          startTime: Date.now(),
        }
        return [...prev.slice(-rippleCount), newRipple]
      })
    }, 2000 / speed)

    return () => clearInterval(interval)
  }, [rippleCount, speed])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border-2"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              borderColor: color,
              width: 0,
              height: 0,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              width: ["0px", "600px", "800px"],
              height: ["0px", "600px", "800px"],
              opacity: [0.8, 0.4, 0],
            }}
            transition={{
              duration: 3 / speed,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

