"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Sparkles, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  FolderGit2,
  ExternalLink,
  ChevronLeft
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

interface Project {
  id: number
  name: string
  role: string
  description: string
  link?: string | null
  category: string
  status: string
  createdAt: string
  updatedAt: string
}

const categories = ["Tech", "Design", "Education", "Startups", "Finance", "Healthcare", "Marketing", "Other"]
const statuses = ["active", "completed", "archived"]

const categoryColors: Record<string, string> = {
  Tech: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Design: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Startups: "bg-green-500/10 text-green-500 border-green-500/20",
  Education: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Finance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Healthcare: "bg-red-500/10 text-red-500 border-red-500/20",
  Marketing: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Other: "bg-[oklch(0.75_0.15_85)]/10 text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]/20",
}

export default function ProjectsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    link: "",
    category: "Tech",
    status: "active",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent("/profile/projects"))
    }
  }, [session, isPending, router])

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user) return

      const token = localStorage.getItem("bearer_token")
      if (!token) {
        toast.error("Authentication required")
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/projects/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
        toast.error("Failed to load projects")
      } finally {
        setIsLoading(false)
      }
    }

    if (!isPending) {
      fetchProjects()
    }
  }, [session, isPending, router])

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        role: project.role,
        description: project.description,
        link: project.link || "",
        category: project.category,
        status: project.status,
      })
    } else {
      setEditingProject(null)
      setFormData({
        name: "",
        role: "",
        description: "",
        link: "",
        category: "Tech",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    if (!formData.name || !formData.role || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects"
      
      const method = editingProject ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          description: formData.description,
          link: formData.link || null,
          category: formData.category,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }

      const savedProject = await response.json()

      if (editingProject) {
        setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p))
        toast.success("Project updated successfully!")
      } else {
        setProjects([savedProject, ...projects])
        toast.success("Project created successfully!")
      }

      setIsDialogOpen(false)
      setEditingProject(null)
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (projectId: number) => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      return
    }

    if (!confirm("Are you sure you want to delete this project?")) {
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

      setProjects(projects.filter(p => p.id !== projectId))
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.75_0.15_85)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                  <FolderGit2 className="w-6 h-6 text-[oklch(0.12_0_0)]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">My Projects</h1>
                  <p className="text-sm text-muted-foreground">Manage your active projects</p>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., AI-Powered Learning Platform"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Lead Developer, Co-Founder"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Brief description of the project..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Project Link (optional)</Label>
                    <Input
                      id="link"
                      placeholder="https://github.com/username/project"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>{editingProject ? "Update" : "Create"} Project</>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {projects.length === 0 ? (
          <Card className="border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <FolderGit2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start showcasing your work by adding your first project!
              </p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-border hover:border-[oklch(0.75_0.15_85)] transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={categoryColors[project.category] || categoryColors.Other}
                          >
                            {project.category}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[oklch(0.75_0.15_85)] font-medium">
                          {project.role}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenDialog(project)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[oklch(0.65_0.15_220)] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Project
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
