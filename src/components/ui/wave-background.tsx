"use client"

import { motion } from "framer-motion"

interface WaveBackgroundProps {
  className?: string
  waveCount?: number
  speed?: number
  colors?: string[]
  children?: React.ReactNode
}

export function WaveBackground({
  className = "",
  waveCount = 3,
  speed = 1,
  colors = [
    "oklch(0.75 0.15 85 / 0.3)",
    "oklch(0.65 0.15 220 / 0.3)",
    "oklch(0.7 0.12 100 / 0.2)",
  ],
  children,
}: WaveBackgroundProps) {
  const waves = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: i * 0.5,
    duration: 8 + i * 2,
  }))

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          {waves.map((wave) => (
            <motion.path
              key={wave.id}
              d={`M0,${400 + wave.id * 100} Q300,${350 + wave.id * 100} 600,${400 + wave.id * 100} T1200,${400 + wave.id * 100} L1200,800 L0,800 Z`}
              fill={wave.color}
              initial={{ d: `M0,${400 + wave.id * 100} Q300,${350 + wave.id * 100} 600,${400 + wave.id * 100} T1200,${400 + wave.id * 100} L1200,800 L0,800 Z` }}
              animate={{
                d: [
                  `M0,${400 + wave.id * 100} Q300,${350 + wave.id * 100} 600,${400 + wave.id * 100} T1200,${400 + wave.id * 100} L1200,800 L0,800 Z`,
                  `M0,${400 + wave.id * 100} Q300,${450 + wave.id * 100} 600,${400 + wave.id * 100} T1200,${400 + wave.id * 100} L1200,800 L0,800 Z`,
                  `M0,${400 + wave.id * 100} Q300,${350 + wave.id * 100} 600,${400 + wave.id * 100} T1200,${400 + wave.id * 100} L1200,800 L0,800 Z`,
                ],
              }}
              transition={{
                duration: wave.duration / speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: wave.delay,
              }}
            />
          ))}
        </svg>
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

