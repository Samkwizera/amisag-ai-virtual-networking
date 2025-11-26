"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Camera, Loader2, Trash2, AlertTriangle, Save, User } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { ProfileCompletenessTracker } from "@/components/profile-completeness-tracker"

// Validation schema using Zod
const accountFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  industry: z.string().max(100, "Industry must be less than 100 characters").optional(),
  role: z.string().max(100, "Role must be less than 100 characters").optional(),
  interests: z.string().optional(), // Comma-separated or tags - stored as string, can be parsed later
  linkedinUrl: z.string().refine(
    (val) => !val || val === "" || z.string().url().safeParse(val).success,
    { message: "Please enter a valid LinkedIn URL" }
  ).optional(),
  portfolioUrl: z.string().refine(
    (val) => !val || val === "" || z.string().url().safeParse(val).success,
    { message: "Please enter a valid portfolio URL" }
  ).optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  username?: string
  profileImage?: string | null
  bio?: string | null
  location?: string | null
  role?: string | null
  company?: string | null
  industries?: string[] | null
  skills?: string[] | null
  linkedinUrl?: string | null
  portfolioUrl?: string | null
}

export default function AccountPage() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      bio: "",
      location: "",
      industry: "",
      role: "",
      interests: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  })

  // Fetch user profile data
  // Note: Auth protection is handled by the profile layout, so we don't need to redirect here
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Step 1: Try to get token first (if not in localStorage)
        let token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
        
        if (!token) {
          try {
            const tokenResponse = await fetch("/api/auth/get-token", {
              method: "POST",
              credentials: "include"
            })
            
            if (tokenResponse.ok) {
              const tokenData = await tokenResponse.json()
              if (tokenData?.token && typeof window !== 'undefined') {
                localStorage.setItem("bearer_token", tokenData.token)
                token = tokenData.token
              }
            }
          } catch (err) {
            console.debug("Token fetch failed, will try with cookies:", err)
          }
        }

        // Step 2: Fetch profile with token (or cookies as fallback)
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }
        
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
        
        const response = await fetch("/api/profile", {
          headers,
          credentials: "include", // Always include cookies for fallback
        })

        if (!response.ok) {
          // If 401 and we have a token, try refreshing it
          if (response.status === 401 && token) {
            try {
              const tokenResponse = await fetch("/api/auth/get-token", {
                method: "POST",
                credentials: "include"
              })
              
              if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json()
                if (tokenData?.token && typeof window !== 'undefined') {
                  localStorage.setItem("bearer_token", tokenData.token)
                  
                  // Retry with new token
                  const retryResponse = await fetch("/api/profile", {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${tokenData.token}`,
                    },
                    credentials: "include",
                  })
                  
                  if (retryResponse.ok) {
                    const retryData = await retryResponse.json()
                    if (retryData && retryData.id) {
                      // Success with retry
                      const username = retryData.username || retryData.email?.split("@")[0] || ""
                      const interests = retryData.skills?.join(", ") || retryData.interests || ""
                      const industry = retryData.industries?.[0] || retryData.company || ""

                      setProfile(retryData)
                      form.reset({
                        fullName: retryData.name || "",
                        username: username,
                        email: retryData.email || "",
                        bio: retryData.bio || "",
                        location: retryData.location || "",
                        industry: industry,
                        role: retryData.role || "",
                        interests: interests,
                        linkedinUrl: retryData.linkedinUrl || "",
                        portfolioUrl: retryData.portfolioUrl || "",
                      })
                      setIsLoading(false)
                      return
                    }
                  }
                }
              }
            } catch (refreshErr) {
              console.error("Failed to refresh token:", refreshErr)
            }
          }
          
          const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
          throw new Error(errorData.error || `Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data || !data.id) {
          throw new Error("Invalid profile data received")
        }

        setProfile(data)
        
        // Populate form with fetched data
        const username = data.username || data.email?.split("@")[0] || ""
        const interests = data.skills?.join(", ") || data.interests || ""
        const industry = data.industries?.[0] || data.company || ""

        form.reset({
          fullName: data.name || "",
          username: username,
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          industry: industry,
          role: data.role || "",
          interests: interests,
          linkedinUrl: data.linkedinUrl || "",
          portfolioUrl: data.portfolioUrl || "",
        })
        setError(null) // Clear any previous errors
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        const errorMessage = error?.message || "Failed to load profile"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure token is available
    const timer = setTimeout(() => {
      fetchProfile()
    }, 200)
    
    return () => clearTimeout(timer)
  }, [form]) // Only depend on form, not session

  // Handle form submission
  const onSubmit = async (values: AccountFormValues) => {
    setIsSaving(true)
    
    const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
    if (!token) {
      toast.error("Authentication required")
      setIsSaving(false)
      return
    }

    try {
      // Parse interests from comma-separated string to array
      const interestsArray = values.interests
        ? values.interests.split(",").map(i => i.trim()).filter(i => i.length > 0)
        : []

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: values.fullName,
          bio: values.bio || null,
          location: values.location || null,
          role: values.role || null,
          company: values.industry || null, // Using company field for industry
          skills: interestsArray, // Storing interests as skills for now
          linkedinUrl: values.linkedinUrl || null,
          portfolioUrl: values.portfolioUrl || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update profile" }))
        throw new Error(errorData.error || "Failed to update profile")
      }

      const updatedData = await response.json()
      setProfile(updatedData)
      
      toast.success("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error?.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    setIsDeleting(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
    
    if (!token) {
      toast.error("Authentication required")
      setIsDeleting(false)
      return
    }

    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to delete account" }))
        throw new Error(errorData.error || "Failed to delete account")
      }

      toast.success("Account deleted successfully")
      
      // Clear auth/session
      localStorage.removeItem("bearer_token")
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }
      await authClient.signOut()
      
      // Redirect to landing page (or /goodbye if you create that route)
      router.push("/")
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast.error(error?.message || "Failed to delete account")
    } finally {
      setIsDeleting(false)
      setDeleteConfirmText("")
    }
  }

  // Show loading state
  // Note: We don't check isSessionPending here because the layout handles auth
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.75_0.15_85)] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show error if no profile after loading
  if (!profile && !isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-bold">Unable to Load Profile</h2>
            {error && (
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {error}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              We couldn't load your profile information. Please try again.
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsLoading(true)
                  setError(null)
                  // Retry fetching
                  const fetchProfile = async () => {
                    try {
                      // Get token first
                      let token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
                      
                      if (!token) {
                        const tokenResponse = await fetch("/api/auth/get-token", {
                          method: "POST",
                          credentials: "include"
                        })
                        if (tokenResponse.ok) {
                          const tokenData = await tokenResponse.json()
                          if (tokenData?.token && typeof window !== 'undefined') {
                            localStorage.setItem("bearer_token", tokenData.token)
                            token = tokenData.token
                          }
                        }
                      }

                      const headers: HeadersInit = {
                        "Content-Type": "application/json",
                      }
                      if (token) {
                        headers.Authorization = `Bearer ${token}`
                      }

                      const response = await fetch("/api/profile", {
                        headers,
                        credentials: "include",
                      })

                      if (response.ok) {
                        const data = await response.json()
                        if (data && data.id) {
                          const username = data.username || data.email?.split("@")[0] || ""
                          const interests = data.skills?.join(", ") || data.interests || ""
                          const industry = data.industries?.[0] || data.company || ""

                          setProfile(data)
                          form.reset({
                            fullName: data.name || "",
                            username: username,
                            email: data.email || "",
                            bio: data.bio || "",
                            location: data.location || "",
                            industry: industry,
                            role: data.role || "",
                            interests: interests,
                            linkedinUrl: data.linkedinUrl || "",
                            portfolioUrl: data.portfolioUrl || "",
                          })
                          setError(null)
                        }
                      } else {
                        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
                        setError(errorData.error || `Failed to load: ${response.status}`)
                      }
                    } catch (err: any) {
                      setError(err?.message || "Failed to load profile")
                    } finally {
                      setIsLoading(false)
                    }
                  }
                  fetchProfile()
                }}
              >
                Retry
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account settings
          </p>
        </div>

        {/* Profile Completeness Tracker */}
        {profile && (
          <ProfileCompletenessTracker 
            profile={{
              profileImage: profile.profileImage,
              skills: profile.skills || [],
              bio: profile.bio,
              location: profile.location,
              linkedinUrl: profile.linkedinUrl,
              portfolioUrl: profile.portfolioUrl,
            }}
            communities={0}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Picture Upload Placeholder */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled
                        >
                          <Camera className="w-4 h-4" />
                          Upload Photo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          {/* TODO: Implement profile picture upload functionality */}
                          Profile picture upload coming soon. Maximum file size: 5MB. Supported formats: JPG, PNG.
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your display name as it appears to other users
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your unique username (letters, numbers, underscores, and hyphens only)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field}
                              readOnly
                              className="bg-muted cursor-not-allowed"
                            />
                          </FormControl>
                          <FormDescription>
                            {/* Email is read-only for security. Contact support to change your email. */}
                            Email cannot be changed for security reasons. Contact support if you need to update it.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bio */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about yourself..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A short description about yourself (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your current location
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Role */}
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your current job title or role
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Industry */}
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input placeholder="Technology" {...field} />
                          </FormControl>
                          <FormDescription>
                            The industry you work in
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Interests */}
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interests</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="React, TypeScript, Design, Music..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your interests or skills, separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* LinkedIn URL */}
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://linkedin.com/in/yourprofile"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your LinkedIn profile URL (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Portfolio URL */}
                    <FormField
                      control={form.control}
                      name="portfolioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio/Website</FormLabel>
                          <FormControl>
                            <Input 
                              type="url"
                              placeholder="https://yourportfolio.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your portfolio or personal website URL (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone - Right Column or Bottom */}
          <div className="lg:col-span-1">
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Account Deletion</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive mb-1">
                        Warning: This action is permanent
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Once you delete your account, all your data, connections, and messages will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="delete-confirm" className="text-sm font-medium">
                          Type <span className="font-mono font-bold">DELETE</span> to confirm:
                        </Label>
                        <Input
                          id="delete-confirm"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          className="mt-2"
                          disabled={isDeleting}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirmText !== "DELETE"}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Account"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
