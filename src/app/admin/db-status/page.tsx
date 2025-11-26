"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DbStatus {
  success: boolean
  database: string
  stats: {
    totalUsers: number
    totalAccounts: number
    totalSessions: number
  }
  recentUsers: Array<{
    id: string
    name: string
    email: string
    createdAt: string
    emailVerified: boolean
  }>
  accounts: Array<{
    id: string
    userId: string
    providerId: string
    createdAt: string
  }>
  sessions: Array<{
    id: string
    userId: string
    expiresAt: string | null
    createdAt: string | null
  }>
  error?: string
}

export default function DbStatusPage() {
  const [status, setStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/test-db")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading database status...</p>
        </div>
      </div>
    )
  }

  if (error || !status?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Database Connection Error</CardTitle>
            <CardDescription>
              {error || status?.error || "Failed to connect to database"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Database Status</h1>
            <p className="text-muted-foreground mt-2">Check if users are being saved to the database</p>
          </div>
          <Badge className="bg-green-500 text-white">
            {status.database === "connected" ? "✓ Connected" : "✗ Disconnected"}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Registered users in database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.75_0.15_85)]">
                {status.stats.totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Accounts</CardTitle>
              <CardDescription>Authentication accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.75_0.15_85)]">
                {status.stats.totalAccounts}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Current user sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.75_0.15_85)]">
                {status.stats.totalSessions}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Users registered in the database</CardDescription>
          </CardHeader>
          <CardContent>
            {status.recentUsers.length === 0 ? (
              <p className="text-muted-foreground">No users found. Try registering a new user!</p>
            ) : (
              <div className="space-y-4">
                {status.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Registered: {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {user.id.substring(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Accounts</CardTitle>
            <CardDescription>Account records linked to users</CardDescription>
          </CardHeader>
          <CardContent>
            {status.accounts.length === 0 ? (
              <p className="text-muted-foreground">No accounts found.</p>
            ) : (
              <div className="space-y-2">
                {status.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <Badge variant="outline">{account.providerId}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(account.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {account.userId.substring(0, 8)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

