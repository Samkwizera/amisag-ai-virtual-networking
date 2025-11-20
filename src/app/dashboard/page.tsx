"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ProfileCardWithMore } from "@/components/profile-card-with-more"
import { Sparkles, Users, MessageSquare, TrendingUp, ChevronLeft, Download, UserPlus, Heart, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"
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
    bio: "Passionate software engineer building scalable solutions for African businesses. Love mentoring junior developers and contributing to open source.",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    linkedinUrl: "https://linkedin.com/in/amara-okafor",
    portfolioUrl: "https://amara-portfolio.com",
    matchPercentage: 94,
    mutualConnections: 12,
    sharedCommunities: ["Tech Community", "Software Engineers"],
  },
  {
    userId: "user_2",
    name: "Kwame Mensah",
    role: "Entrepreneur & Founder",
    company: "StartHub Ghana",
    location: "Accra, Ghana",
    emoji: "👨🏾‍💼",
    bio: "Serial entrepreneur focused on solving African challenges through technology. Founded 3 startups in fintech and e-commerce.",
    skills: ["Entrepreneurship", "Business Strategy", "Fundraising", "Product Management"],
    linkedinUrl: "https://linkedin.com/in/kwame-mensah",
    portfolioUrl: null,
    matchPercentage: 87,
    mutualConnections: 8,
    sharedCommunities: ["Entrepreneurs Network"],
  },
  {
    userId: "user_3",
    name: "Zainab Hassan",
    role: "Product Designer",
    company: "Design Studio KE",
    location: "Nairobi, Kenya",
    emoji: "👩🏽‍🎨",
    bio: "Award-winning product designer specializing in user-centered design for African markets. Featured in Design Africa 2024.",
    skills: ["UI/UX Design", "Figma", "Product Strategy", "Design Systems"],
    linkedinUrl: "https://linkedin.com/in/zainab-hassan",
    portfolioUrl: "https://behance.net/zainab-design",
    matchPercentage: 91,
    mutualConnections: 15,
    sharedCommunities: ["Design Community", "UX Professionals"],
  },
  {
    userId: "user_4",
    name: "Thabo Nkosi",
    role: "Founder & CEO",
    company: "ImpactTech SA",
    location: "Cape Town, South Africa",
    emoji: "🧑🏾‍💼",
    bio: "Building technology solutions that create social impact. Previously VP of Engineering at major tech company. Angel investor.",
    skills: ["Leadership", "Social Impact", "Tech Strategy", "Venture Capital"],
    linkedinUrl: "https://linkedin.com/in/thabo-nkosi",
    portfolioUrl: "https://impacttech.co.za",
    matchPercentage: 89,
    mutualConnections: 20,
    sharedCommunities: ["Social Impact", "Tech Leaders"],
  },
]

const goals = [
  { name: "Monthly Connections", current: 18, target: 25, percentage: 72 },
  { name: "Community Engagement", current: 42, target: 50, percentage: 84 },
  { name: "Profile Completeness", current: 90, target: 100, percentage: 90 },
]

const activityData = [
  { day: "Mon", connections: 5, messages: 23 },
  { day: "Tue", connections: 8, messages: 31 },
  { day: "Wed", connections: 3, messages: 18 },
  { day: "Thu", connections: 12, messages: 45 },
  { day: "Fri", connections: 7, messages: 28 },
  { day: "Sat", connections: 4, messages: 15 },
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">Analytics Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/insights">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Insights
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                  <span className="text-sm text-green-500 font-semibold">
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex gap-4 text-muted-foreground">
                        <span>{day.connections} connections</span>
                        <span>{day.messages} messages</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-2 rounded-full bg-[oklch(0.75_0.15_85)]"
                        style={{ width: `${(day.connections / 12) * 100}%` }}
                      />
                      <div
                        className="h-2 rounded-full bg-[oklch(0.65_0.15_220)]"
                        style={{ width: `${(day.messages / 45) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.15_85)]" />
                  <span className="text-sm text-muted-foreground">Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.15_220)]" />
                  <span className="text-sm text-muted-foreground">Messages</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {goal.percentage}% complete
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Connections with Enhanced Profile Cards */}
        <Card className="mt-6 border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Connections</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/connect">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentConnections.map((connection) => (
                <ProfileCardWithMore
                  key={connection.userId}
                  userId={connection.userId}
                  userName={connection.name}
                  userImage={connection.emoji}
                  userRole={connection.role}
                  userCompany={connection.company}
                  userLocation={connection.location}
                  userBio={connection.bio}
                  userSkills={connection.skills}
                  linkedinUrl={connection.linkedinUrl}
                  portfolioUrl={connection.portfolioUrl}
                  matchPercentage={connection.matchPercentage}
                  mutualConnections={connection.mutualConnections}
                  sharedCommunities={connection.sharedCommunities}
                  onConnect={() => handleConnect(connection.name)}
                  onMessage={() => handleMessage(connection.name)}
                  variant="grid"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Peak Activity Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekday Mornings</span>
                  <span className="text-sm font-semibold text-[oklch(0.75_0.15_85)]">
                    High
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekday Evenings</span>
                  <span className="text-sm font-semibold text-[oklch(0.65_0.15_220)]">
                    Medium
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekends</span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    Low
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Top Skills Matched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Design</span>
                  <span className="text-sm font-semibold">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Software Development</span>
                  <span className="text-sm font-semibold">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketing</span>
                  <span className="text-sm font-semibold">18%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇳🇬 Nigeria</span>
                  <span className="text-sm font-semibold">38%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇰🇪 Kenya</span>
                  <span className="text-sm font-semibold">24%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">🇿🇦 South Africa</span>
                  <span className="text-sm font-semibold">22%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}