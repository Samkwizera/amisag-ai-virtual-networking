"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: "Test User",
        }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        toast.success("Test email sent successfully!")
      } else {
        toast.error(data.error || "Failed to send email")
      }
    } catch (error: any) {
      toast.error("Error: " + error.message)
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test Email Sending</CardTitle>
            <CardDescription>
              Test if Resend email is configured correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleTestEmail}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send Test Email"}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Configuration Check:</h3>
              <ul className="text-sm space-y-1">
                <li>
                  ✅ Check server console for detailed logs
                </li>
                <li>
                  ✅ Make sure RESEND_API_KEY is set in .env.local
                </li>
                <li>
                  ✅ Use onboarding@resend.dev for testing (no domain verification needed)
                </li>
                <li>
                  ✅ Check Resend dashboard for email logs
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



