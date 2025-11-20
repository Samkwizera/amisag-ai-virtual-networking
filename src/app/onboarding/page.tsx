"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ChevronRight, ChevronLeft, Camera, Upload, X } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { toast } from "sonner"

const skills = [
  "UI/UX Design", "Frontend Dev", "Backend Dev", "Data Science", 
  "Product Management", "Marketing", "Sales", "Business Development",
  "Content Writing", "Graphic Design", "Mobile Dev", "DevOps"
]

const goals = [
  "Find a Mentor", "Become a Mentor", "Find Co-founder",
  "Career Opportunities", "Collaboration", "Learning",
  "Networking", "Investment"
]

const industries = [
  "Technology", "Finance", "Healthcare", "Education",
  "E-commerce", "Agriculture", "Energy", "Media"
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [step, setStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    role: "",
    company: "",
    bio: "",
    selectedSkills: [] as string[],
    selectedGoals: [] as string[],
    selectedIndustries: [] as string[],
    privacy: "public" as "public" | "private",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent("/onboarding"))
    }
  }, [session, isPending, router])

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleComplete = async () => {
    const token = localStorage.getItem("bearer_token")
    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
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
          name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          role: formData.role,
          company: formData.company,
          skills: formData.selectedSkills,
          goals: formData.selectedGoals,
          industries: formData.selectedIndustries,
          profileImage: profileImage || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      toast.success("Profile created successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleSelection = (field: "selectedSkills" | "selectedGoals" | "selectedIndustries", value: string) => {
    const current = formData[field]
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) })
    } else {
      setFormData({ ...formData, [field]: [...current, value] })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-bold">Amisag</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Amisag</h1>
          <p className="text-muted-foreground">Let&apos;s set up your profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  s <= step ? "bg-[oklch(0.75_0.15_85)]" : "bg-[oklch(0.22_0_0)]"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {step} of 5
          </p>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email is set from your account</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Current Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Product Designer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      placeholder="Where do you work?"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Skills & Interests</h2>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Share a bit about yourself, your experience, and what you're passionate about..."
                      rows={6}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Skills (Select up to 5)</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant={formData.selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.selectedSkills.includes(skill)
                              ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                              : ""
                          }`}
                          onClick={() => {
                            if (formData.selectedSkills.length < 5 || formData.selectedSkills.includes(skill)) {
                              toggleSelection("selectedSkills", skill)
                            }
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4 text-center">Upload Profile Picture</h2>
                  <p className="text-center text-muted-foreground mb-6">
                    Your face helps people recognize you! 😊
                  </p>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div className="w-40 h-40 rounded-full bg-[oklch(0.22_0_0)] border-4 border-[oklch(0.75_0.15_85)] flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-16 h-16 text-muted-foreground" />
                        )}
                      </div>
                      {profileImage && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Recommended: Square image, at least 400x400px
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Your Goals & Interests</h2>
                  <div className="space-y-2">
                    <Label>What are you looking for?</Label>
                    <div className="flex flex-wrap gap-2">
                      {goals.map((goal) => (
                        <Badge
                          key={goal}
                          variant={formData.selectedGoals.includes(goal) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.selectedGoals.includes(goal)
                              ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                              : ""
                          }`}
                          onClick={() => toggleSelection("selectedGoals", goal)}
                        >
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Industries of Interest</Label>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((industry) => (
                        <Badge
                          key={industry}
                          variant={formData.selectedIndustries.includes(industry) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.selectedIndustries.includes(industry)
                              ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                              : ""
                          }`}
                          onClick={() => toggleSelection("selectedIndustries", industry)}
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose how you want to appear on the platform
                  </p>
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.privacy === "public"
                          ? "border-[oklch(0.75_0.15_85)] bg-[oklch(0.22_0_0)]"
                          : "border-border"
                      }`}
                      onClick={() => setFormData({ ...formData, privacy: "public" })}
                    >
                      <h3 className="font-semibold mb-1">Public Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Your profile will be visible to all users and appear in recommendations
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.privacy === "private"
                          ? "border-[oklch(0.75_0.15_85)] bg-[oklch(0.22_0_0)]"
                          : "border-border"
                      }`}
                      onClick={() => setFormData({ ...formData, privacy: "private" })}
                    >
                      <h3 className="font-semibold mb-1">Private Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Only your connections can see your full profile details
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[oklch(0.22_0_0)] rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> You can change these settings anytime from your profile settings.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            {step === 3 && (
              <Button
                variant="ghost"
                onClick={handleNext}
              >
                Skip for now
              </Button>
            )}
            <Button
              onClick={step === 5 ? handleComplete : handleNext}
              disabled={isSaving}
              className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
            >
              {step === 5 ? (isSaving ? "Saving..." : "Complete") : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}