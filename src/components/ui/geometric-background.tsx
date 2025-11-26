"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface GeometricBackgroundProps {
  className?: string
  shapeCount?: number
  speed?: number
  colors?: string[]
  children?: React.ReactNode
}

export function GeometricBackground({
  className = "",
  shapeCount = 12,
  speed = 1,
  colors = [
    "oklch(0.75 0.15 85 / 0.2)",
    "oklch(0.65 0.15 220 / 0.2)",
    "oklch(0.7 0.12 100 / 0.15)",
  ],
  children,
}: GeometricBackgroundProps) {
  const shapes = useMemo(
    () =>
      Array.from({ length: shapeCount }, (_, i) => {
        const type = i % 3 // 0: circle, 1: triangle, 2: square
        return {
          id: i,
          type,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 40,
          rotation: Math.random() * 360,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 2,
          color: colors[i % colors.length],
        }
      }),
    [shapeCount, colors]
  )

  const renderShape = (shape: typeof shapes[0]) => {
    const baseProps = {
      fill: shape.color,
      stroke: shape.color,
      strokeWidth: "1",
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: [0, 0.6, 0.3, 0.6, 0],
        scale: [0, 1.2, 0.8, 1, 0],
        rotate: [shape.rotation, shape.rotation + 360],
      },
      transition: {
        duration: shape.duration / speed,
        repeat: Infinity,
        delay: shape.delay,
        ease: "easeInOut",
      },
    }

    switch (shape.type) {
      case 0: // Circle
        return (
          <motion.circle
            key={shape.id}
            cx={`${shape.x}%`}
            cy={`${shape.y}%`}
            r={shape.size / 2}
            {...baseProps}
          />
        )
      case 1: // Triangle
        const triangleSize = shape.size
        return (
          <motion.polygon
            key={shape.id}
            points={`${shape.x}%,${shape.y - triangleSize / 2}% ${shape.x - triangleSize / 2}%,${shape.y + triangleSize / 2}% ${shape.x + triangleSize / 2}%,${shape.y + triangleSize / 2}%`}
            {...baseProps}
          />
        )
      case 2: // Square
        return (
          <motion.rect
            key={shape.id}
            x={`${shape.x - shape.size / 2}%`}
            y={`${shape.y - shape.size / 2}%`}
            width={`${shape.size}%`}
            height={`${shape.size}%`}
            {...baseProps}
          />
        )
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {shapes.map(renderShape)}
      </svg>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

