"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  MapPin, 
  Briefcase, 
  Building2,
  Linkedin,
  Globe,
  ExternalLink,
  MessageSquare,
  UserPlus,
  Users,
  Loader2,
  FolderGit2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Project {
  id: number
  name: string
  role: string
  description: string
  link?: string | null
  category: string
  status: string
}

interface ExpandedProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  onConnect?: () => void
  onMessage?: () => void
  isConnected?: boolean
  mutualConnections?: number
  sharedCommunities?: string[]
}

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Design: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Startups: "bg-green-500/10 text-green-500 border-green-500/20",
  Education: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Default: "bg-[oklch(0.75_0.15_85)]/10 text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]/20",
}

export function ExpandedProfileModal({
  open,
  onOpenChange,
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
  onConnect,
  onMessage,
  isConnected = false,
  mutualConnections = 0,
  sharedCommunities = [],
}: ExpandedProfileModalProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)

  useEffect(() => {
    if (open && userId) {
      fetchProjects()
    }
  }, [open, userId])

  const fetchProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const response = await fetch(`/api/projects/user/${userId}?status=active&limit=6`)
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to load projects")
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleOpenLink = (url: string) => {
    // Handle iframe compatibility
    const isInIframe = window.self !== window.top
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*")
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <h2>Profile Details</h2>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center overflow-hidden flex-shrink-0">
                {userImage ? (
                  <span className="text-5xl">{userImage}</span>
                ) : (
                  <User className="w-12 h-12 text-[oklch(0.12_0_0)]" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{userName}</h2>
                  {userEmail && (
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {userRole && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{userRole}</span>
                    </div>
                  )}
                  {userCompany && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{userCompany}</span>
                    </div>
                  )}
                  {userLocation && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{userLocation}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {onConnect && (
                    <Button
                      size="sm"
                      onClick={onConnect}
                      disabled={isConnected}
                      className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isConnected ? "Connected" : "Connect"}
                    </Button>
                  )}
                  {onMessage && (
                    <Button size="sm" variant="outline" onClick={onMessage}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* About Section */}
            {userBio && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="text-muted-foreground leading-relaxed">{userBio}</p>
              </div>
            )}

            {/* Skills */}
            {userSkills && userSkills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Active Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[oklch(0.75_0.15_85)]" />
                <h3 className="text-lg font-semibold">Active Projects</h3>
              </div>

              {isLoadingProjects ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.75_0.15_85)]" />
                </div>
              ) : projects.length > 0 ? (
                <div className="grid gap-4">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-border hover:border-[oklch(0.75_0.15_85)] transition-colors">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{project.name}</h4>
                              <p className="text-sm text-[oklch(0.75_0.15_85)] font-medium">
                                {project.role}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={categoryColors[project.category] || categoryColors.Default}
                            >
                              {project.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description}
                          </p>
                          {project.link && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[oklch(0.65_0.15_220)] hover:text-[oklch(0.65_0.15_220)] h-8 px-2"
                              onClick={() => handleOpenLink(project.link!)}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Project
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FolderGit2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active projects yet</p>
                </div>
              )}
            </div>

            {/* Professional Links */}
            {(linkedinUrl || portfolioUrl) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Links</h3>
                <div className="flex flex-wrap gap-3">
                  {linkedinUrl && (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenLink(linkedinUrl)}
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4 text-[#0077B5]" />
                      LinkedIn Profile
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  {portfolioUrl && (
                    <Button
                      variant="outline"
                      onClick={() => handleOpenLink(portfolioUrl)}
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-[oklch(0.65_0.15_220)]" />
                      Portfolio / Website
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Mutual Connections & Shared Communities */}
            {(mutualConnections > 0 || sharedCommunities.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Connections</h3>
                <div className="space-y-3">
                  {mutualConnections > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-[oklch(0.75_0.15_85)]" />
                      <span>
                        {mutualConnections} mutual connection{mutualConnections !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {sharedCommunities.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Shared communities:</p>
                      <div className="flex flex-wrap gap-2">
                        {sharedCommunities.map((community) => (
                          <Badge key={community} variant="outline">
                            {community}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}