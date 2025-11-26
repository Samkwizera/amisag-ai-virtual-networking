"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Sparkles, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  ChevronLeft, 
  Trophy,
  Target,
  Flame,
  Star,
  Award,
  Zap,
  Heart,
  UserPlus,
  MessageCircle,
  Globe,
  Calendar,
  Clock,
  ArrowUp,
  Download,
  TrendingDown,
  Lightbulb
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data - replace with real API calls
const overviewStats = [
  {
    label: "Total Connections",
    value: 127,
    change: +15,
    changePercent: "+13%",
    icon: Users,
    color: "text-[oklch(0.75_0.15_85)]",
    bgColor: "bg-[oklch(0.75_0.15_85)]/10",
    trend: "up"
  },
  {
    label: "Messages Sent",
    value: 842,
    change: +68,
    changePercent: "+8%",
    icon: MessageSquare,
    color: "text-[oklch(0.65_0.15_220)]",
    bgColor: "bg-[oklch(0.65_0.15_220)]/10",
    trend: "up"
  },
  {
    label: "Communities Joined",
    value: 12,
    change: +3,
    changePercent: "+25%",
    icon: Globe,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    trend: "up"
  },
  {
    label: "Profile Views",
    value: 1847,
    change: +234,
    changePercent: "+15%",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    trend: "up"
  },
]

const monthlyActivity = [
  { week: "Week 1", connections: 4, messages: 32, communities: 1 },
  { week: "Week 2", connections: 8, messages: 56, communities: 2 },
  { week: "Week 3", connections: 12, messages: 78, communities: 3 },
  { week: "Week 4", connections: 15, messages: 94, communities: 2 },
]

const topConnections = [
  {
    name: "Amara Okafor",
    role: "Software Engineer",
    location: "Lagos, Nigeria",
    avatar: "https://i.pravatar.cc/150?img=1",
    interactions: 45,
    lastContact: "2 hours ago"
  },
  {
    name: "Kwame Mensah",
    role: "Entrepreneur",
    location: "Accra, Ghana",
    avatar: "https://i.pravatar.cc/150?img=2",
    interactions: 38,
    lastContact: "5 hours ago"
  },
  {
    name: "Zainab Hassan",
    role: "Product Designer",
    location: "Nairobi, Kenya",
    avatar: "https://i.pravatar.cc/150?img=3",
    interactions: 32,
    lastContact: "1 day ago"
  },
]

const activeCommunities = [
  {
    name: "Tech Innovators Africa",
    members: 2847,
    yourActivity: "Very Active",
    posts: 23,
    icon: "💻",
    color: "text-blue-500"
  },
  {
    name: "African Entrepreneurs Network",
    members: 5432,
    yourActivity: "Active",
    posts: 15,
    icon: "💼",
    color: "text-[oklch(0.75_0.15_85)]"
  },
  {
    name: "Design & Innovation",
    members: 1923,
    yourActivity: "Moderately Active",
    posts: 8,
    icon: "🎨",
    color: "text-purple-500"
  },
]

const achievements = [
  {
    id: 1,
    name: "Early Adopter",
    description: "Joined Amisag in its first month",
    icon: Sparkles,
    earned: true,
    date: "Jan 2024",
    rarity: "Legendary",
    color: "from-[oklch(0.75_0.15_85)] to-yellow-600"
  },
  {
    id: 2,
    name: "First 10 Connections",
    description: "Built your initial network of 10 connections",
    icon: Users,
    earned: true,
    date: "Jan 2024",
    rarity: "Common",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Active Networker",
    description: "Made 100+ connections",
    icon: UserPlus,
    earned: true,
    date: "Feb 2024",
    rarity: "Rare",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "Community Contributor",
    description: "Posted 50+ times in communities",
    icon: MessageCircle,
    earned: true,
    date: "Mar 2024",
    rarity: "Rare",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 5,
    name: "Conversation Master",
    description: "Send 1000+ messages",
    icon: MessageSquare,
    earned: false,
    progress: 84,
    rarity: "Epic",
    color: "from-[oklch(0.65_0.15_220)] to-blue-600"
  },
  {
    id: 6,
    name: "Super Connector",
    description: "Reach 200 connections",
    icon: Zap,
    earned: false,
    progress: 64,
    rarity: "Epic",
    color: "from-yellow-500 to-orange-500"
  },
]

const aiSuggestions = [
  {
    type: "reconnect",
    title: "Reconnect with inactive contacts",
    description: "You haven't spoken to Thabo Nkosi in 2 weeks. They might appreciate a check-in!",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    type: "community",
    title: "Join more communities in Tech & Innovation",
    description: "Based on your interests, you might enjoy 'AI & Machine Learning Africa' community.",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    type: "engagement",
    title: "Your best engagement time is 10 AM - 12 PM",
    description: "Schedule important networking activities during this window for maximum visibility.",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    type: "milestone",
    title: "You're 13 connections away from 'Super Connector'!",
    description: "Keep building your network to unlock this epic achievement.",
    icon: Target,
    color: "text-[oklch(0.75_0.15_85)]",
    bgColor: "bg-[oklch(0.75_0.15_85)]/10"
  },
]

const timeStats = {
  totalHoursThisMonth: 24,
  averageSessionTime: "32 min",
  mostActiveDay: "Thursday",
  peakHour: "10 AM - 11 AM"
}

export default function InsightsPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  // Authentication is handled by the profile layout, no need to check here

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">Your Insights</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Progress Tracker Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-border bg-gradient-to-r from-[oklch(0.75_0.15_85)]/10 via-[oklch(0.65_0.15_220)]/10 to-purple-500/10 border-[oklch(0.75_0.15_85)]/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[oklch(0.75_0.15_85)] flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6 text-[oklch(0.12_0_0)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">
                    🎉 Amazing progress! You've made 15 new connections this month!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're in the top 10% of networkers this month. Keep up the great work!
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={60} className="h-2" />
                    </div>
                    <span className="text-sm font-semibold text-[oklch(0.75_0.15_85)]">
                      15/25 Monthly Goal
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border bg-card hover:border-[oklch(0.75_0.15_85)] transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                          <ArrowUp className="w-4 h-4" />
                          {stat.changePercent}
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">
                        +{stat.change} this month
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Activity Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Networking Activity (Last 4 Weeks)</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.15_85)]" />
                      <span className="text-muted-foreground">Connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.15_220)]" />
                      <span className="text-muted-foreground">Messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Communities</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyActivity.map((week, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{week.week}</span>
                        <div className="flex gap-6 text-muted-foreground">
                          <span>{week.connections} connections</span>
                          <span>{week.messages} messages</span>
                          <span>{week.communities} communities</span>
                        </div>
                      </div>
                      <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                        <div
                          className="bg-[oklch(0.75_0.15_85)] rounded-sm transition-all hover:opacity-80"
                          style={{ width: `${(week.connections / 15) * 100}%` }}
                        />
                        <div
                          className="bg-[oklch(0.65_0.15_220)] rounded-sm transition-all hover:opacity-80"
                          style={{ width: `${(week.messages / 100) * 100}%` }}
                        />
                        <div
                          className="bg-green-500 rounded-sm transition-all hover:opacity-80"
                          style={{ width: `${(week.communities / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Connection Requests */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Connection Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-muted-foreground">Received</div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">76</div>
                      <div className="text-sm text-muted-foreground">Accepted</div>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-sm text-muted-foreground">Accept Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Time Spent Networking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{timeStats.totalHoursThisMonth}h</div>
                      <div className="text-sm text-muted-foreground">This Month</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{timeStats.averageSessionTime}</div>
                      <div className="text-sm text-muted-foreground">Avg Session</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{timeStats.mostActiveDay}</div>
                      <div className="text-xs text-muted-foreground">Most Active Day</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{timeStats.peakHour}</div>
                      <div className="text-xs text-muted-foreground">Peak Hour</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            {/* Top Connections */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Top 3 Most Interacted Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topConnections.map((connection, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-[oklch(0.75_0.15_85)] transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={connection.avatar}
                          alt={connection.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[oklch(0.75_0.15_85)] flex items-center justify-center text-xs font-bold text-[oklch(0.12_0_0)]">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{connection.name}</div>
                        <div className="text-sm text-muted-foreground mb-1">{connection.role}</div>
                        <div className="text-xs text-muted-foreground">📍 {connection.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[oklch(0.75_0.15_85)] mb-1">
                          {connection.interactions}
                        </div>
                        <div className="text-xs text-muted-foreground">interactions</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {connection.lastContact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Communities */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Most Active Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCommunities.map((community, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-[oklch(0.75_0.15_85)] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {community.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{community.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {community.members.toLocaleString()} members
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2" variant="secondary">
                          {community.yourActivity}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {community.posts} posts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[oklch(0.75_0.15_85)]" />
                  <CardTitle>AI-Powered Suggestions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border border-border ${suggestion.bgColor} hover:border-[oklch(0.75_0.15_85)] transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center flex-shrink-0`}>
                          <suggestion.icon className={`w-5 h-5 ${suggestion.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Achievements</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      You've unlocked {achievements.filter(a => a.earned).length} out of {achievements.length} achievements
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-[oklch(0.75_0.15_85)]" />
                    <div>
                      <div className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-6 rounded-lg border-2 ${
                        achievement.earned
                          ? "border-[oklch(0.75_0.15_85)] bg-gradient-to-br from-[oklch(0.22_0_0)] to-[oklch(0.16_0_0)]"
                          : "border-border bg-card opacity-60"
                      }`}
                    >
                      {achievement.earned && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]">
                            {achievement.rarity}
                          </Badge>
                        </div>
                      )}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 mx-auto`}>
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-center mb-2">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <div className="text-center">
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Earned {achievement.date}
                          </Badge>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <div className="text-xs text-center text-muted-foreground">
                            {achievement.progress}% Complete
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones Timeline */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {achievements
                    .filter(a => a.earned)
                    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
                    .map((achievement, index) => (
                      <div key={achievement.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                            <achievement.icon className="w-5 h-5 text-white" />
                          </div>
                          {index < achievements.filter(a => a.earned).length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {achievement.date}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}