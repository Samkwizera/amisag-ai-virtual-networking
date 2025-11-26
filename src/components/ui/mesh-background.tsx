"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface MeshBackgroundProps {
  className?: string
  gridSize?: number
  speed?: number
  color?: string
  children?: React.ReactNode
}

export function MeshBackground({
  className = "",
  gridSize = 20,
  speed = 1,
  color = "oklch(0.75 0.15 85 / 0.1)",
  children,
}: MeshBackgroundProps) {
  const gridPoints = useMemo(() => {
    const points: Array<{ x: number; y: number; id: string }> = []
    for (let x = 0; x <= gridSize; x++) {
      for (let y = 0; y <= gridSize; y++) {
        points.push({
          x: (x / gridSize) * 100,
          y: (y / gridSize) * 100,
          id: `${x}-${y}`,
        })
      }
    }
    return points
  }, [gridSize])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Grid lines */}
        {Array.from({ length: gridSize + 1 }, (_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0%"
            y1={`${(i / gridSize) * 100}%`}
            x2="100%"
            y2={`${(i / gridSize) * 100}%`}
            stroke={color}
            strokeWidth="0.5"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              pathLength: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3 / speed,
              repeat: Infinity,
              delay: (i % 3) * 0.5,
            }}
          />
        ))}
        {Array.from({ length: gridSize + 1 }, (_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${(i / gridSize) * 100}%`}
            y1="0%"
            x2={`${(i / gridSize) * 100}%`}
            y2="100%"
            stroke={color}
            strokeWidth="0.5"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              pathLength: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3 / speed,
              repeat: Infinity,
              delay: (i % 3) * 0.5,
            }}
          />
        ))}

        {/* Animated nodes */}
        {gridPoints.map((point, index) => (
          <motion.circle
            key={point.id}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="2"
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 / speed,
              repeat: Infinity,
              delay: (index % 10) * 0.1,
            }}
          />
        ))}
      </svg>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

