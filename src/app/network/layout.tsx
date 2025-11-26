"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, MessageSquare, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"

export default function NetworkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname?.includes("/messages")) return "messages"
    if (pathname?.includes("/communities")) return "communities"
    return "connect" // default
  }

  const activeTab = getActiveTab()

  const handleTabChange = (value: string) => {
    router.push(`/network/${value}`)
  }

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      toast.success("Signed out successfully")
      router.push("/")
    }
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/network"))
    }
  }, [isPending, session?.user]) // Only depend on isPending and session.user, not pathname

  // Check if profile needs completion - only check once per session, not on every navigation
  useEffect(() => {
    // Only check profile completion when first entering network section (connect page)
    // Use sessionStorage to remember we've already checked
    const profileCheckKey = 'profile_completion_checked'
    const hasCheckedProfile = typeof window !== 'undefined' ? sessionStorage.getItem(profileCheckKey) === 'true' : false
    
    if (session?.user && !hasCheckedProfile && (pathname === "/network" || pathname === "/network/connect")) {
      const checkProfile = async () => {
        const token = localStorage.getItem("bearer_token")
        if (!token) return

        try {
          const profileResponse = await fetch("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (profileResponse.ok) {
            const profile = await profileResponse.json()
            // Check if profile is incomplete (missing essential fields)
            const isProfileIncomplete = !profile.bio || !profile.location || !profile.skills || 
              (Array.isArray(profile.skills) ? profile.skills.length === 0 : !profile.skills)
            
            // Mark as checked
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(profileCheckKey, 'true')
            }
            
            // Only redirect if profile is incomplete AND we're on the connect page (entry point)
            if (isProfileIncomplete && (pathname === "/network" || pathname === "/network/connect")) {
              router.push("/onboarding")
            }
          }
        } catch (error) {
          console.error("Profile check error:", error)
          // Mark as checked even on error to prevent retry loops
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(profileCheckKey, 'true')
          }
        }
      }

      checkProfile()
    }
  }, [session?.user, pathname, router])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" href="/network" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="gap-2"
            >
              <Link href="/profile">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0">
              <TabsTrigger
                value="connect"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-6 py-4"
              >
                <Users className="w-5 h-5 mr-2" />
                Connect
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-6 py-4"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="communities"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-6 py-4"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Communities
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

