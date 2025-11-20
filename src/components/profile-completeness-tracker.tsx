"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProfileCompletenessTrackerProps {
  profile: {
    profileImage?: string | null
    skills?: string[] | null
    bio?: string | null
    location?: string | null
    linkedinUrl?: string | null
    portfolioUrl?: string | null
  }
  communities?: number
}

export function ProfileCompletenessTracker({ profile, communities = 0 }: ProfileCompletenessTrackerProps) {
  // Calculate completion status for each item
  const checks = {
    hasProfilePhoto: !!profile.profileImage,
    hasSkills: (profile.skills && profile.skills.length >= 3) || false,
    hasBioAndLocation: !!profile.bio && !!profile.location,
    hasLinkedIn: !!profile.linkedinUrl,
    hasPortfolio: !!profile.portfolioUrl,
    hasJoinedCommunity: communities > 0,
  }

  const completedItems = Object.values(checks).filter(Boolean).length
  const totalItems = Object.keys(checks).length
  const percentage = Math.round((completedItems / totalItems) * 100)

  const checklistItems = [
    { label: "Added profile photo", checked: checks.hasProfilePhoto },
    { label: "Listed 3+ skills", checked: checks.hasSkills },
    { label: "Added bio and location", checked: checks.hasBioAndLocation },
    { label: "Added LinkedIn link", checked: checks.hasLinkedIn },
    { label: "Added portfolio/website", checked: checks.hasPortfolio },
    { label: "Joined at least one community", checked: checks.hasJoinedCommunity },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[oklch(0.75_0.15_85)]/10 to-[oklch(0.65_0.15_220)]/10 border border-[oklch(0.75_0.15_85)]/20 rounded-xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Profile Completeness</h3>
          <p className="text-sm text-muted-foreground">
            {percentage === 100 
              ? "🌟 Your profile is complete!" 
              : "Complete your profile to get more accurate matches!"}
          </p>
        </div>
        <div className="text-3xl font-bold text-[oklch(0.75_0.15_85)]">
          {percentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={percentage} className="h-3" />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checklistItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            {item.checked ? (
              <div className="w-5 h-5 rounded-full bg-[oklch(0.75_0.15_85)] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[oklch(0.12_0_0)]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3 text-muted-foreground/50" />
              </div>
            )}
            <span className={`text-sm ${item.checked ? "text-foreground" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
