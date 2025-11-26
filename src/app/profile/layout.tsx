"use client"

import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, MessageSquare, LogOut, User, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useSession, authClient } from "@/lib/auth-client"
import { useEffect, useRef, useState } from "react"
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
  const hasCheckedAuth = useRef(false)
  
  // Get token and justSignedIn flag immediately
  const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
  const justSignedIn = typeof window !== 'undefined' ? sessionStorage.getItem('just_signed_in') === 'true' : false
  
  // If just signed in, immediately set state to allow rendering
  const [isInitialLoad, setIsInitialLoad] = useState(!justSignedIn && !token)

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

  // Token and justSignedIn are already defined above
  
  // CRITICAL: If we have a token, we're authenticated - don't check anything else
  // This prevents redirects during navigation between tabs
  // Token is the source of truth
  
  // Check authentication ONLY on mount, not on every navigation
  useEffect(() => {
    // If we already checked, don't check again
    if (hasCheckedAuth.current) return
    
    // CRITICAL: If we just signed in, render IMMEDIATELY - don't wait for anything
    // IMPORTANT: Don't remove the flag immediately - keep it to prevent redirects
    if (justSignedIn) {
      console.log("✅ Just signed in - rendering immediately, keeping flag to prevent redirect")
      hasCheckedAuth.current = true
      setIsInitialLoad(false)
      
      // Don't remove flag yet - keep it for a few seconds to prevent redirect loop
      // Fetch token in background (non-blocking)
      fetch("/api/auth/get-token", {
        method: "POST",
        credentials: "include"
      })
        .then(res => res.ok ? res.json() : null)
        .then((response: any) => {
          if (response?.token && typeof window !== 'undefined') {
            localStorage.setItem("bearer_token", response.token)
            console.log("✅ Token stored after sign-in")
            // Now safe to remove flag after token is stored
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('just_signed_in')
                console.log("✅ Removed just_signed_in flag")
              }
            }, 1000)
          }
        })
        .catch(() => {
          // Even if token fetch fails, keep flag for a bit longer
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('just_signed_in')
            }
          }, 3000)
        })
      return // Don't check further - allow rendering
    }
    
    // If we have a token, render immediately
    if (token) {
      console.log("✅ Token found - rendering immediately")
      hasCheckedAuth.current = true
      setIsInitialLoad(false)
      return
    }
    
    // If we have a session, allow rendering immediately
    if (session?.user) {
      console.log("✅ Session found - rendering immediately")
      hasCheckedAuth.current = true
      setIsInitialLoad(false)
      
      // Try to get token if we don't have it (non-blocking)
      if (!token) {
        fetch("/api/auth/get-token", {
          method: "POST",
          credentials: "include"
        })
          .then(res => res.json())
          .then(data => {
            if (data.token && typeof window !== 'undefined') {
              localStorage.setItem("bearer_token", data.token)
            }
          })
          .catch(() => {}) // Silently fail
      }
      return
    }
    
    // Wait briefly for session to load (only if pending) - but don't wait too long
    if (isPending) {
      console.log("⏳ Waiting for session...")
      const timer = setTimeout(() => {
        console.log("⏳ Session check timeout - checking again")
        if (session?.user) {
          // Session found - allow rendering
          console.log("✅ Session found after wait - rendering")
          hasCheckedAuth.current = true
          setIsInitialLoad(false)
          
          // Try to get token (non-blocking)
          fetch("/api/auth/get-token", {
            method: "POST",
            credentials: "include"
          })
            .then(res => res.json())
            .then(data => {
              if (data.token && typeof window !== 'undefined') {
                localStorage.setItem("bearer_token", data.token)
              }
            })
            .catch(() => {})
        } else {
          // No session - but if we just signed in, allow rendering anyway
          if (justSignedIn) {
            console.log("✅ Just signed in - allowing render despite no session")
            hasCheckedAuth.current = true
            setIsInitialLoad(false)
          } else {
            // No session and didn't just sign in - redirect to login
            console.log("❌ No session - redirecting to login")
            router.push("/login?redirect=" + encodeURIComponent(pathname || "/profile/dashboard"))
            hasCheckedAuth.current = true
            setIsInitialLoad(false)
          }
        }
      }, 300) // Very short timeout - 300ms max
      
      return () => clearTimeout(timer)
    }
    
    // No session and not pending - check if we just signed in
    if (!session?.user && !isPending) {
      if (justSignedIn) {
        // Just signed in - allow rendering even without session (cookies will work)
        console.log("✅ Just signed in - allowing render without session")
        hasCheckedAuth.current = true
        setIsInitialLoad(false)
      } else {
        // No session and didn't just sign in - redirect to login
        console.log("❌ No session and not just signed in - redirecting")
        router.push("/login?redirect=" + encodeURIComponent(pathname || "/profile/dashboard"))
        hasCheckedAuth.current = true
        setIsInitialLoad(false)
      }
    }
  }, [token, justSignedIn, session?.user, isPending, router, pathname])
  
  // Timeout effect for loading screen - must be called unconditionally (hooks rule)
  useEffect(() => {
    // Only set timeout if we're showing loading screen
    if (!justSignedIn && !token && !session?.user && isInitialLoad && !hasCheckedAuth.current) {
      const timer = setTimeout(() => {
        console.log("⏰ Loading timeout - allowing render anyway")
        hasCheckedAuth.current = true
        setIsInitialLoad(false)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [justSignedIn, token, session?.user, isInitialLoad])
  
  // CRITICAL: If just signed in OR have token OR have session, render immediately
  // Check this FIRST before any loading screen logic
  // IMPORTANT: Don't redirect if justSignedIn is true - allow rendering
  if (justSignedIn || token || session?.user) {
    console.log("✅ Rendering immediately - auth detected:", { justSignedIn, hasToken: !!token, hasSession: !!session?.user })
    // Continue to render - don't show loading screen or redirect
  }
  // Only show loading if we don't have any auth indicators AND we're still checking
  else if (isInitialLoad && !hasCheckedAuth.current) {
    console.log("⏳ Showing loading screen - no auth detected yet")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  // No auth and we've checked - redirect ONLY if we didn't just sign in
  else if (!token && !session?.user && hasCheckedAuth.current && !justSignedIn) {
    console.log("❌ No auth and not just signed in - redirecting to login")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
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

