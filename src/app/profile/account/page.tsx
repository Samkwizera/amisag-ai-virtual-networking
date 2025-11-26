"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileCompletenessTracker } from "@/components/profile-completeness-tracker"
import { ProfessionalLinksSection } from "@/components/professional-links-section"
import { 
  Sparkles, 
  Edit2, 
  Save, 
  X, 
  Camera, 
  Loader2,
  MapPin,
  Briefcase,
  Building2,
  User,
  FolderGit2,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Plus
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

const availableSkills = [
  "UI/UX Design", "Frontend Dev", "Backend Dev", "Data Science", 
  "Product Management", "Marketing", "Sales", "Business Development",
  "Content Writing", "Graphic Design", "Mobile Dev", "DevOps"
]

const availableGoals = [
  "Find a Mentor", "Become a Mentor", "Find Co-founder",
  "Career Opportunities", "Collaboration", "Learning",
  "Networking", "Investment"
]

const availableIndustries = [
  "Technology", "Finance", "Healthcare", "Education",
  "E-commerce", "Agriculture", "Energy", "Media"
]

interface UserProfile {
  id: string
  name: string
  email: string
  profileImage?: string | null
  bio?: string | null
  location?: string | null
  role?: string | null
  company?: string | null
  skills?: string[] | null
  goals?: string[] | null
  industries?: string[] | null
  linkedinUrl?: string | null
  portfolioUrl?: string | null
}

interface Project {
  id: number
  name: string
  role: string
  description: string
  link?: string | null
  category: string
  status: string
}

// Helper function to ensure array type
const ensureArray = (value: any): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const projectCategories = ["Tech", "Design", "Startups", "Education", "Marketing", "Finance", "Healthcare", "Other"]

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Design: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Startups: "bg-green-500/10 text-green-500 border-green-500/20",
  Education: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Marketing: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Finance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Healthcare: "bg-red-500/10 text-red-500 border-red-500/20",
  Other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isEditingLinks, setIsEditingLinks] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    location: "",
    role: "",
    company: "",
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    role: "",
    description: "",
    link: "",
    category: "Tech",
    status: "active",
  })

  // Authentication is handled by the profile layout, no need to check here

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return

      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Authentication required")
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Please login again.")
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        
        // Ensure arrays are properly formatted
        const normalizedProfile = {
          ...data,
          skills: ensureArray(data.skills),
          goals: ensureArray(data.goals),
          industries: ensureArray(data.industries),
        }
        
        setProfile(normalizedProfile)
        setEditData({
          name: normalizedProfile.name || "",
          bio: normalizedProfile.bio || "",
          location: normalizedProfile.location || "",
          role: normalizedProfile.role || "",
          company: normalizedProfile.company || "",
        })
        setSelectedSkills(normalizedProfile.skills)
        setSelectedGoals(normalizedProfile.goals)
        setSelectedIndustries(normalizedProfile.industries)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (!isPending) {
      fetchProfile()
    }
  }, [session, isPending, router])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user) return

      const token = localStorage.getItem("bearer_token")
      if (!token) return

      setIsLoadingProjects(true)
      try {
        const response = await fetch("/api/projects?status=active&limit=20", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoadingProjects(false)
      }
    }

    if (!isPending && session?.user) {
      fetchProjects()
    }
  }, [session, isPending])

  const handleSaveInfo = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          bio: editData.bio,
          location: editData.location,
          role: editData.role,
          company: editData.company,
          skills: selectedSkills,
          goals: selectedGoals,
          industries: selectedIndustries,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await response.json()
      
      // Ensure arrays are properly formatted
      const normalizedProfile = {
        ...updatedProfile,
        skills: ensureArray(updatedProfile.skills),
        goals: ensureArray(updatedProfile.goals),
        industries: ensureArray(updatedProfile.industries),
      }
      
      setProfile(normalizedProfile)
      setIsEditingInfo(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLinks = async (data: { linkedinUrl?: string; portfolioUrl?: string }) => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update links")
    }

    const updatedProfile = await response.json()
    
    // Ensure arrays are properly formatted
    const normalizedProfile = {
      ...updatedProfile,
      skills: ensureArray(updatedProfile.skills),
      goals: ensureArray(updatedProfile.goals),
      industries: ensureArray(updatedProfile.industries),
    }
    
    setProfile(normalizedProfile)
    setIsEditingLinks(false)
  }

  const handleAddProject = async () => {
    if (!newProject.name || !newProject.role || !newProject.description || !newProject.category) {
      toast.error("Please fill in all required fields")
      return
    }

    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) {
        throw new Error("Failed to add project")
      }

      const addedProject = await response.json()
      setProjects([addedProject, ...projects])
      setNewProject({
        name: "",
        role: "",
        description: "",
        link: "",
        category: "Tech",
        status: "active",
      })
      setIsAddingProject(false)
      toast.success("Project added successfully!")
    } catch (error) {
      console.error("Error adding project:", error)
      toast.error("Failed to add project")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((p) => p.id !== projectId))
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  const handleOpenLink = (url: string) => {
    const isInIframe = window.self !== window.top
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*")
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const toggleSelection = (array: string[], setArray: (arr: string[]) => void, value: string, max?: number) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value))
    } else {
      if (max && array.length >= max) {
        toast.error(`You can only select up to ${max} items`)
        return
      }
      setArray([...array, value])
    }
  }

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete account")
      }

      toast.success("Account deleted successfully")
      localStorage.removeItem("bearer_token")
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }
      await authClient.signOut()
      router.push("/login")
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast.error(error.message || "Failed to delete account. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.75_0.15_85)]" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[oklch(0.12_0_0)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your Amisag profile</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Completeness Tracker */}
        <ProfileCompletenessTracker 
          profile={profile}
          communities={0}
        />

        {/* Quick Actions Card */}
        <Card className="mb-6 border-border bg-gradient-to-br from-card to-[oklch(0.75_0.15_85)]/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[oklch(0.75_0.15_85)]/20 flex items-center justify-center">
                  <FolderGit2 className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Your Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase your work and active projects
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" className="text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]/30">
                <Link href="/profile/projects">
                  View Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[oklch(0.12_0_0)]" />
                  )}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                <p className="text-muted-foreground mb-3">{profile.email}</p>
                
                <div className="flex flex-wrap gap-3 text-sm">
                  {profile.role && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.role}</span>
                    </div>
                  )}
                  {profile.company && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{profile.company}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Profile Information</TabsTrigger>
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="links">Professional Links</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Basic Information</h3>
                  {!isEditingInfo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingInfo(true)}
                      className="text-[oklch(0.75_0.15_85)]"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {!isEditingInfo ? (
                  <div className="space-y-4">
                    {profile.bio && (
                      <div>
                        <Label className="text-muted-foreground">Bio</Label>
                        <p className="mt-1">{profile.bio}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.location && (
                        <div>
                          <Label className="text-muted-foreground">Location</Label>
                          <p className="mt-1">{profile.location}</p>
                        </div>
                      )}
                      {profile.role && (
                        <div>
                          <Label className="text-muted-foreground">Role</Label>
                          <p className="mt-1">{profile.role}</p>
                        </div>
                      )}
                      {profile.company && (
                        <div>
                          <Label className="text-muted-foreground">Company</Label>
                          <p className="mt-1">{profile.company}</p>
                        </div>
                      )}
                    </div>

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Skills</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.goals && profile.goals.length > 0 && (
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Goals</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.goals.map((goal) => (
                            <Badge key={goal} variant="secondary">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.industries && profile.industries.length > 0 && (
                      <div>
                        <Label className="text-muted-foreground mb-2 block">Industries</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.industries.map((industry) => (
                            <Badge key={industry} variant="secondary">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, Country"
                          value={editData.location}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          placeholder="Your current role"
                          value={editData.role}
                          onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Your company"
                          value={editData.company}
                          onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Skills (Select up to 5)</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedSkills.includes(skill)
                                ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                                : ""
                            }`}
                            onClick={() => toggleSelection(selectedSkills, setSelectedSkills, skill, 5)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Goals</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableGoals.map((goal) => (
                          <Badge
                            key={goal}
                            variant={selectedGoals.includes(goal) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedGoals.includes(goal)
                                ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                                : ""
                            }`}
                            onClick={() => toggleSelection(selectedGoals, setSelectedGoals, goal)}
                          >
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Industries</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableIndustries.map((industry) => (
                          <Badge
                            key={industry}
                            variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedIndustries.includes(industry)
                                ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                                : ""
                            }`}
                            onClick={() => toggleSelection(selectedIndustries, setSelectedIndustries, industry)}
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditData({
                            name: profile.name || "",
                            bio: profile.bio || "",
                            location: profile.location || "",
                            role: profile.role || "",
                            company: profile.company || "",
                          })
                          setSelectedSkills(ensureArray(profile.skills))
                          setSelectedGoals(ensureArray(profile.goals))
                          setSelectedIndustries(ensureArray(profile.industries))
                          setIsEditingInfo(false)
                        }}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveInfo}
                        disabled={isSaving}
                        className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-[oklch(0.75_0.15_85)]" />
                    <h3 className="text-xl font-semibold">My Projects</h3>
                  </div>
                  {!isAddingProject && (
                    <Button
                      onClick={() => setIsAddingProject(true)}
                      className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>

                {isAddingProject && (
                  <Card className="border-[oklch(0.75_0.15_85)] mb-6">
                    <CardContent className="pt-6 space-y-4">
                      <h4 className="font-semibold text-lg">New Project</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name *</Label>
                          <Input
                            id="project-name"
                            placeholder="E-commerce Platform"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-role">Your Role *</Label>
                          <Input
                            id="project-role"
                            placeholder="Lead Developer"
                            value={newProject.role}
                            onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="project-description">Description *</Label>
                        <Textarea
                          id="project-description"
                          rows={3}
                          placeholder="Brief description of the project..."
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-category">Category *</Label>
                          <select
                            id="project-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                          >
                            {projectCategories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-link">Project Link (optional)</Label>
                          <Input
                            id="project-link"
                            placeholder="https://github.com/..."
                            value={newProject.link}
                            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddingProject(false)
                            setNewProject({
                              name: "",
                              role: "",
                              description: "",
                              link: "",
                              category: "Tech",
                              status: "active",
                            })
                          }}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddProject}
                          disabled={isSaving}
                          className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Project"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.75_0.15_85)]" />
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="border-border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{project.name}</h4>
                              <p className="text-sm text-[oklch(0.75_0.15_85)] font-medium">
                                {project.role}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={categoryColors[project.category] || categoryColors.Other}
                              >
                                {project.category}
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderGit2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2">No projects yet</p>
                    <p className="text-sm">Add your first project to showcase your work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Links Tab */}
          <TabsContent value="links">
            <ProfessionalLinksSection
              linkedinUrl={profile.linkedinUrl}
              portfolioUrl={profile.portfolioUrl}
              isEditing={isEditingLinks}
              onEdit={() => setIsEditingLinks(true)}
              onSave={handleSaveLinks}
              onCancel={() => setIsEditingLinks(false)}
            />
          </TabsContent>
        </Tabs>

        {/* Danger Zone - Delete Account */}
        <Card className="mt-8 border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mt-1">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-500 mb-1">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All your data, projects, connections, and messages will be permanently deleted.
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers. This includes:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Your profile and personal information</li>
                        <li>All your projects</li>
                        <li>Your connections and messages</li>
                        <li>Your community memberships</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Yes, delete my account"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}