"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTestEmail = async () => {
    if (!email || !name) {
      toast.error("Please enter both email and name")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Test email sent! Check your inbox (or console if no API key)")
      } else {
        toast.error(data.error || "Failed to send email")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Test Welcome Email</CardTitle>
            <CardDescription>
              Send a test welcome email to verify your email configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTestEmail}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> If you haven't set up RESEND_API_KEY in .env.local,
                the email will be logged to your server console instead of being sent.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

