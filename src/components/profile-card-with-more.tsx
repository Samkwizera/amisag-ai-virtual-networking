"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  MapPin, 
  Briefcase,
  MoreHorizontal,
  Sparkles
} from "lucide-react"
import { ExpandedProfileModal } from "@/components/expanded-profile-modal"

interface ProfileCardWithMoreProps {
  userId: string
  userName: string
  userEmail?: string
  userImage?: string | null
  userRole?: string | null
  userCompany?: string | null
  userLocation?: string | null
  userBio?: string | null
  userSkills?: string[]
  linkedinUrl?: string | null
  portfolioUrl?: string | null
  matchPercentage?: number
  onConnect?: () => void
  onMessage?: () => void
  isConnected?: boolean
  mutualConnections?: number
  sharedCommunities?: string[]
  variant?: "swipe" | "grid" | "list"
}

export function ProfileCardWithMore({
  userId,
  userName,
  userEmail,
  userImage,
  userRole,
  userCompany,
  userLocation,
  userBio,
  userSkills = [],
  linkedinUrl,
  portfolioUrl,
  matchPercentage,
  onConnect,
  onMessage,
  isConnected = false,
  mutualConnections = 0,
  sharedCommunities = [],
  variant = "grid",
}: ProfileCardWithMoreProps) {
  const [showExpandedProfile, setShowExpandedProfile] = useState(false)

  return (
    <>
      <Card className="border-border hover:border-[oklch(0.75_0.15_85)] transition-all duration-300 h-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center overflow-hidden">
                {userImage ? (
                  <span className="text-4xl">{userImage}</span>
                ) : (
                  <User className="w-10 h-10 text-[oklch(0.12_0_0)]" />
                )}
              </div>
              {matchPercentage && matchPercentage > 0 && (
                <div className="absolute -top-2 -right-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold border-2 border-background">
                  {matchPercentage}%
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-2 w-full">
              <h3 className="font-semibold text-lg truncate">{userName}</h3>
              
              {userRole && (
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  <span className="truncate">{userRole}</span>
                </div>
              )}
              
              {userLocation && (
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{userLocation}</span>
                </div>
              )}
            </div>

            {/* Skills Preview */}
            {userSkills && userSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {userSkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {userSkills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{userSkills.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Mutual Connections */}
            {mutualConnections > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-[oklch(0.75_0.15_85)]" />
                <span>{mutualConnections} mutual connection{mutualConnections !== 1 ? "s" : ""}</span>
              </div>
            )}

            {/* More Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExpandedProfile(true)}
              className="w-full text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]/30 hover:bg-[oklch(0.75_0.15_85)]/10"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Profile Modal */}
      <ExpandedProfileModal
        open={showExpandedProfile}
        onOpenChange={setShowExpandedProfile}
        userId={userId}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        userRole={userRole}
        userCompany={userCompany}
        userLocation={userLocation}
        userBio={userBio}
        userSkills={userSkills}
        linkedinUrl={linkedinUrl}
        portfolioUrl={portfolioUrl}
        onConnect={onConnect}
        onMessage={onMessage}
        isConnected={isConnected}
        mutualConnections={mutualConnections}
        sharedCommunities={sharedCommunities}
      />
    </>
  )
}