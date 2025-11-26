"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useSession } from "@/lib/auth-client"

export default function NetworkPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=" + encodeURIComponent("/network"))
    }
  }, [session, isPending, router])

  // Redirect to Connect tab by default
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/network/connect")
    }
  }, [session, isPending, router])

  // Show loading state while checking auth
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

