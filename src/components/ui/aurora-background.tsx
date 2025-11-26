"use client"

import { motion } from "framer-motion"

interface AuroraBackgroundProps {
  className?: string
  colors?: string[]
  speed?: number
  children?: React.ReactNode
}

export function AuroraBackground({
  className = "",
  colors = [
    "oklch(0.75 0.15 85 / 0.4)",
    "oklch(0.65 0.15 220 / 0.4)",
    "oklch(0.7 0.12 100 / 0.3)",
  ],
  speed = 1,
  children,
}: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
          {colors.map((color, index) => (
            <motion.path
              key={index}
              d={`M0,${200 + index * 150} Q200,${150 + index * 150} 400,${200 + index * 150} T800,${200 + index * 150} T1200,${200 + index * 150} L1200,${300 + index * 150} Q1000,${350 + index * 150} 800,${300 + index * 150} T400,${300 + index * 150} T0,${300 + index * 150} Z`}
              fill={color}
              initial={{ opacity: 0 }}
              animate={{
                d: [
                  `M0,${200 + index * 150} Q200,${150 + index * 150} 400,${200 + index * 150} T800,${200 + index * 150} T1200,${200 + index * 150} L1200,${300 + index * 150} Q1000,${350 + index * 150} 800,${300 + index * 150} T400,${300 + index * 150} T0,${300 + index * 150} Z`,
                  `M0,${200 + index * 150} Q200,${250 + index * 150} 400,${200 + index * 150} T800,${200 + index * 150} T1200,${200 + index * 150} L1200,${300 + index * 150} Q1000,${250 + index * 150} 800,${300 + index * 150} T400,${300 + index * 150} T0,${300 + index * 150} Z`,
                  `M0,${200 + index * 150} Q200,${150 + index * 150} 400,${200 + index * 150} T800,${200 + index * 150} T1200,${200 + index * 150} L1200,${300 + index * 150} Q1000,${350 + index * 150} 800,${300 + index * 150} T400,${300 + index * 150} T0,${300 + index * 150} Z`,
                ],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: (8 + index * 2) / speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Overlay gradient for smooth blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

