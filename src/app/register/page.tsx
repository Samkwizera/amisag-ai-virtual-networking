"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { Logo } from "@/components/ui/logo"

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>
const errorCodes = {
  USER_ALREADY_EXISTS: "User already registered",
} satisfies ErrorTypes

const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes]
  }
  return "Registration failed"
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      console.log("📝 Starting registration for:", formData.email)
      
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password
      })

      console.log("📝 Registration response:", { data, error })

      if (error) {
        console.error("❌ Registration error:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        
        let errorMessage = getErrorMessage(error.code || "")
        if (error.code === "INVALID_ORIGIN") {
          errorMessage = "Configuration error. Please check server configuration."
          console.error("⚠️ INVALID_ORIGIN error - Check baseURL configuration. Visit /api/auth/diagnose for details.")
        } else if (error.message && !error.code) {
          errorMessage = error.message
        }
        
        toast.error(errorMessage)
        setIsLoading(false)
        return
      }

      if (!data) {
        console.error("❌ No data returned from registration")
        toast.error("Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Send welcome email after successful registration
      // Note: better-auth may not return user data immediately, so we'll send email using the form data
      try {
        const emailResponse = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: formData.email,
            name: formData.name 
          }),
        })
        
        const emailResult = await emailResponse.json()
        
        if (emailResult.success) {
          console.log('✅ Welcome email sent successfully')
        } else {
          console.warn('⚠️ Welcome email failed:', emailResult.error || emailResult.warning)
          // Don't show error to user - registration succeeded
        }
      } catch (emailError) {
        // Don't fail registration if email fails
        console.error('❌ Failed to send welcome email:', emailError)
        // Don't show error to user - registration succeeded
      }

      toast.success("Account created successfully!")
      
      // Auto-login after registration
      try {
        const { data: signInData, error: signInError } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          rememberMe: false,
          callbackURL: "/onboarding"
        })

        if (signInError?.code) {
          // If auto-login fails, redirect to login page
          router.push("/login?registered=true")
          return
        }

        // Redirect to onboarding to complete profile, then to dashboard
        router.push("/onboarding")
      } catch (error) {
        // If auto-login fails, redirect to login page
        router.push("/login?registered=true")
      }
    } catch (error: any) {
      console.error("❌ Registration exception:", error)
      console.error("Error stack:", error?.stack)
      console.error("Error details:", JSON.stringify(error, null, 2))
      
      // Check if it's a network error
      if (error?.message?.includes("fetch") || error?.message?.includes("network") || error?.message?.includes("Failed to fetch")) {
        toast.error("Network error. Please check your internet connection and try again.")
      } else {
        const errorMessage = error?.message || error?.toString() || "An unexpected error occurred. Please try again."
        toast.error(errorMessage)
      }
      setIsLoading(false)
    }
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join Amisag and start networking across Africa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

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
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[oklch(0.75_0.15_85)] hover:underline font-semibold"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
