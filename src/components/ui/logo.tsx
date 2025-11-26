"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  href?: string
  asLink?: boolean
}

export function Logo({ className, size = "md", href = "/", asLink = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const content = (
    <div className={cn("flex items-center gap-0 font-sans", className)}>
      <span className="text-white dark:text-white lowercase">amis</span>
      <span className="text-yellow-500 dark:text-yellow-500 lowercase">ag</span>
    </div>
  )

  if (asLink) {
    return (
      <Link href={href} className={cn("inline-flex items-center", sizeClasses[size])}>
        {content}
      </Link>
    )
  }

  return <div className={cn(sizeClasses[size])}>{content}</div>
}

