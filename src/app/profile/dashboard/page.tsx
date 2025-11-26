"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ProfileCardWithMore } from "@/components/profile-card-with-more"
import { Sparkles, Users, MessageSquare, TrendingUp, Download, UserPlus, Heart, Calendar, BarChart3 } from "lucide-react"
import { toast } from "sonner"

const stats = [
  {
    label: "Total Connections",
    value: "248",
    change: "+12%",
    icon: Users,
    color: "text-[oklch(0.75_0.15_85)]",
  },
  {
    label: "Messages Sent",
    value: "1,524",
    change: "+8%",
    icon: MessageSquare,
    color: "text-[oklch(0.65_0.15_220)]",
  },
  {
    label: "Profile Views",
    value: "3,847",
    change: "+23%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "Match Rate",
    value: "67%",
    change: "+5%",
    icon: Heart,
    color: "text-pink-500",
  },
]

const recentConnections = [
  {
    userId: "user_1",
    name: "Amara Okafor",
    role: "Software Engineer",
    company: "TechCorp Africa",
    location: "Lagos, Nigeria",
    emoji: "👨🏿‍💻",
    skills: ["React", "Node.js", "TypeScript"],
    mutualConnections: 3,
    sharedCommunities: ["Tech Innovators Africa"],
  },
  {
    userId: "user_2",
    name: "Zainab Hassan",
    role: "Product Designer",
    company: "Design Studio",
    location: "Nairobi, Kenya",
    emoji: "👩🏽‍🎨",
    skills: ["UI/UX", "Figma", "Design Systems"],
    mutualConnections: 5,
    sharedCommunities: ["African Design Collective"],
  },
]

const activityData = [
  { day: "Mon", connections: 8, messages: 45 },
  { day: "Tue", connections: 12, messages: 52 },
  { day: "Wed", connections: 6, messages: 38 },
  { day: "Thu", connections: 15, messages: 67 },
  { day: "Fri", connections: 10, messages: 43 },
  { day: "Sat", connections: 4, messages: 28 },
  { day: "Sun", connections: 2, messages: 12 },
]

export default function DashboardPage() {
  const handleConnect = (name: string) => {
    toast.success(`Connection request sent to ${name}!`)
  }

  const handleMessage = (name: string) => {
    toast.success(`Opening chat with ${name}...`)
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Here's what's happening with your network today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Connections */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Recent Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConnections.map((connection) => (
                    <ProfileCardWithMore
                      key={connection.userId}
                      userId={connection.userId}
                      userName={connection.name}
                      userRole={connection.role}
                      userCompany={connection.company}
                      userLocation={connection.location}
                      userEmoji={connection.emoji}
                      userSkills={connection.skills}
                      mutualConnections={connection.mutualConnections}
                      sharedCommunities={connection.sharedCommunities}
                      onConnect={() => handleConnect(connection.name)}
                      onMessage={() => handleMessage(connection.name)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <div>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.map((activity, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{activity.day}</span>
                        <span className="text-muted-foreground">{activity.connections} connections</span>
                      </div>
                      <Progress value={(activity.connections / 15) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

