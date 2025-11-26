"use client"

import { motion } from "framer-motion"
import { ReactNode, useMemo } from "react"

interface InfiniteMarqueeProps {
  children: ReactNode
  speed?: number
  direction?: "left" | "right"
  className?: string
}

export function InfiniteMarquee({
  children,
  speed = 50,
  direction = "left",
  className = "",
}: InfiniteMarqueeProps) {
  // Duplicate children to create seamless loop
  const duplicatedChildren = useMemo(
    () => [children, children, children],
    [children]
  )

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        animate={{
          x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "300%",
          willChange: "transform",
        }}
      >
        {duplicatedChildren.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center"
            style={{ 
              width: "33.333%",
            }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

