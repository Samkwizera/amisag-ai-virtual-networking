"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Mark page as dynamic to avoid static generation issues with useSearchParams
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { Logo } from "@/components/ui/logo"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/profile/dashboard"
  const registered = searchParams.get("registered")

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const startTime = Date.now()
    console.log("🔐 Sign-in started")

    try {
      // Sign in - measure timing
      const signInStart = Date.now()
      console.log("📡 Calling signIn.email API...")
      
      const response = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      const signInEnd = Date.now()
      const signInDuration = signInEnd - signInStart
      console.log(`✅ Sign-in API completed in ${signInDuration}ms`)

      const { data, error } = response

      if (error?.code) {
        console.error("❌ Sign-in error:", error)
        toast.error("Invalid email or password. Please make sure you have already registered an account and try again.")
        setIsLoading(false)
        return
      }

      // CRITICAL: Redirect IMMEDIATELY - do absolutely nothing before redirect
      const redirectStart = Date.now()
      const timeBeforeRedirect = redirectStart - startTime
      console.log(`🚀 Redirecting at ${timeBeforeRedirect}ms (API took ${signInDuration}ms)`)
      
      // Set flag before redirect (very fast)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_signed_in', 'true')
      }
      
      // Use Next.js router for faster client-side navigation (no full page reload)
      router.replace("/profile/dashboard")
      
      // Everything below executes in parallel with redirect (or doesn't execute)
      // These operations happen AFTER redirect starts
      
      // Set flag (may not execute due to redirect)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_signed_in', 'true')
      }
      
      // Update loading state (may not execute)
      setIsLoading(false)
      
      // Everything below may not execute due to redirect, but that's fine
      // These are fire-and-forget operations
      
      // Show success toast (non-blocking, may not show due to redirect)
      toast.success("Welcome back!")
      
      // Start token fetch in background (completely non-blocking)
      fetch("/api/auth/get-token", {
        method: "POST",
        credentials: "include"
      })
        .then(res => res.ok ? res.json() : null)
        .then((tokenData: any) => {
          if (tokenData?.token && typeof window !== 'undefined') {
            localStorage.setItem("bearer_token", tokenData.token)
            console.log("✅ Token stored in localStorage")
          }
        })
        .catch((err) => {
          console.debug("Token fetch failed (non-blocking):", err)
        })
    } catch (error: any) {
      const errorTime = Date.now()
      console.error(`❌ Sign-in error after ${errorTime - startTime}ms:`, error)
      const errorMessage = error?.message || "An unexpected error occurred. Please try again."
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  if (registered) {
    toast.success("Account created successfully! Please sign in.")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
          <p className="text-muted-foreground mt-2">Networking made fun</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue networking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[oklch(0.75_0.15_85)] hover:underline font-semibold"
              >
                Create one now
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" href="/" />
            <p className="text-muted-foreground mt-2">Networking made fun</p>
          </div>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
