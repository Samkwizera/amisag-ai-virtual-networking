"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, MessageSquare, LogOut, User, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"

export default function ProfileLayout({
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
    if (pathname?.includes("/connect")) return "connect"
    if (pathname?.includes("/insights")) return "insights"
    if (pathname?.includes("/account")) return "account"
    return "dashboard" // default
  }

  const activeTab = getActiveTab()

  const handleTabChange = (value: string) => {
    router.push(`/profile/${value}`)
  }

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }
      toast.success("Signed out successfully")
      router.push("/login")
    }
  }

  // Redirect to login if not authenticated
  // Only redirect if we've confirmed there's no session AND no token
  useEffect(() => {
    // Don't redirect while still checking
    if (isPending) return
    
    const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
    
    // If no session and no token, redirect to login
    if (!session?.user && !token) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/profile/dashboard"))
      return
    }
    
    // If we have a token but no session after a delay, the token might be invalid
    // But give it more time since session fetching can take a moment
    if (token && !session?.user) {
      const timer = setTimeout(() => {
        // Double-check token still exists and session is still null
        const currentToken = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
        if (currentToken && !session?.user) {
          // Token exists but no session - might be invalid, but don't redirect immediately
          // Let the user try to use the app, API calls will handle auth errors
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isPending, session?.user, router, pathname])

  // Show loading state while checking authentication
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

  // Allow rendering if we have a token, even if session is still loading
  // The individual pages will handle their own data fetching with proper error handling
  const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
  
  // Only block if we're certain there's no session AND no token AND not loading
  if (!isPending && !session?.user && !token) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" href="/profile/dashboard" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-background sticky top-[73px] z-40 overflow-x-auto">
        <div className="container mx-auto px-2 md:px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0 min-w-max">
              <TabsTrigger
                value="dashboard"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="connect"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <Users className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Connect</span>
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger
                value="communities"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Communities</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[oklch(0.75_0.15_85)] data-[state=active]:bg-transparent px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm"
              >
                <Settings className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Account</span>
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

