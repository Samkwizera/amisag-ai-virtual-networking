"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAuthPage() {
  const [authTest, setAuthTest] = useState<any>(null)
  const [dbTest, setDbTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/test")
      const data = await res.json()
      setAuthTest({ success: res.ok, status: res.status, data })
    } catch (error: any) {
      setAuthTest({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testDb = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/test-db")
      const data = await res.json()
      setDbTest({ success: res.ok, status: res.status, data })
    } catch (error: any) {
      setDbTest({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Auth Debugging Tools</CardTitle>
            <CardDescription>Test your authentication setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Environment Info</h3>
              <div className="bg-muted p-4 rounded-md space-y-1 text-sm">
                <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
                <p><strong>Expected baseURL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</p>
                <p><strong>Bearer Token:</strong> {typeof window !== 'undefined' ? (localStorage.getItem('bearer_token') ? 'Present' : 'Missing') : 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Button onClick={testAuth} disabled={loading} className="mb-2">
                  Test Auth API
                </Button>
                {authTest && (
                  <div className={`mt-2 p-4 rounded-md ${authTest.success ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
                    <pre className="text-xs overflow-auto">{JSON.stringify(authTest, null, 2)}</pre>
                  </div>
                )}
              </div>

              <div>
                <Button onClick={testDb} disabled={loading} className="mb-2">
                  Test Database
                </Button>
                {dbTest && (
                  <div className={`mt-2 p-4 rounded-md ${dbTest.success ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
                    <pre className="text-xs overflow-auto">{JSON.stringify(dbTest, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-md">
              <h4 className="font-semibold mb-2">📝 What to Check:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Auth API should return `"success": true`</li>
                <li>Database should show connection status</li>
                <li>Current URL should match Expected baseURL</li>
                <li>Check browser console (F12) for detailed errors</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

