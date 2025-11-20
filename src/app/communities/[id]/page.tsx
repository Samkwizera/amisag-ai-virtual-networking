"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Sparkles, 
  ChevronLeft, 
  Users, 
  MessageSquare,
  Heart,
  Share2,
  MoreVertical,
  MapPin,
  Calendar,
  TrendingUp,
  Pin,
  Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

// Mock data
const communityData = {
  "1": {
    id: "1",
    name: "Tech Innovators Africa",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop",
    icon: "💻",
    category: "Technology",
    members: 12500,
    description: "A vibrant community for tech entrepreneurs, developers, and innovators across Africa to share ideas, collaborate on projects, and build the future together.",
    location: "Pan-African",
    founded: "January 2023",
    tags: ["Startups", "AI/ML", "Web3", "Mobile Dev", "SaaS"],
  },
  "2": {
    id: "2",
    name: "African Design Collective",
    banner: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop",
    icon: "🎨",
    category: "Design",
    members: 8300,
    description: "Connect with designers, learn about African design principles, and showcase your creative work.",
    location: "Pan-African",
    founded: "March 2023",
    tags: ["UI/UX", "Branding", "Animation", "3D Design"],
  },
  "3": {
    id: "3",
    name: "FinTech Leaders Network",
    banner: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=400&fit=crop",
    icon: "💰",
    category: "Finance",
    members: 15600,
    description: "Explore the future of finance in Africa. Connect with fintech founders, investors, and industry experts.",
    location: "Pan-African",
    founded: "February 2023",
    tags: ["Payments", "Banking", "Blockchain", "Investment"],
  },
}

const mutualConnections = [
  { id: 1, name: "Kwame Mensah", emoji: "👨🏾‍💼" },
  { id: 2, name: "Chioma Adebayo", emoji: "👩🏾‍💼" },
  { id: 3, name: "Amina Hassan", emoji: "👩🏽‍🔬" },
  { id: 4, name: "Thabo Nkosi", emoji: "🧑🏾‍💼" },
  { id: 5, name: "Zainab Ali", emoji: "👩🏽‍🎨" },
]

const members = [
  { id: 1, name: "Kwame Mensah", emoji: "👨🏾‍💼", role: "Founder & Admin", isMutual: true, isOnline: true },
  { id: 2, name: "Chioma Adebayo", emoji: "👩🏾‍💼", role: "Community Manager", isMutual: true, isOnline: true },
  { id: 3, name: "Amina Hassan", emoji: "👩🏽‍🔬", role: "Member", isMutual: true, isOnline: false },
  { id: 4, name: "Thabo Nkosi", emoji: "🧑🏾‍💼", role: "Moderator", isMutual: true, isOnline: true },
  { id: 5, name: "Zainab Ali", emoji: "👩🏽‍🎨", role: "Member", isMutual: true, isOnline: false },
  { id: 6, name: "Oluwaseun Balogun", emoji: "👨🏿‍💻", role: "Member", isMutual: false, isOnline: true },
  { id: 7, name: "Fatima Al-Rashid", emoji: "👩🏽‍💼", role: "Member", isMutual: false, isOnline: false },
  { id: 8, name: "Ibrahim Kamara", emoji: "👨🏾‍🎨", role: "Member", isMutual: false, isOnline: true },
]

const discussions = [
  {
    id: 1,
    author: "Kwame Mensah",
    emoji: "👨🏾‍💼",
    title: "What are the best practices for scaling a SaaS product in Africa?",
    content: "I've been working on my SaaS product for the past 6 months and we're starting to see good traction. Looking for advice from those who've scaled successfully...",
    replies: 24,
    likes: 56,
    time: "2 hours ago",
    isPinned: true,
    hasImage: false,
  },
  {
    id: 2,
    author: "Chioma Adebayo",
    emoji: "👩🏾‍💼",
    title: "Looking for feedback on my new mobile app concept",
    content: "Just finished the prototype for a new fintech app targeting small businesses. Would love your thoughts! Screenshots attached 📱",
    replies: 12,
    likes: 28,
    time: "5 hours ago",
    isPinned: false,
    hasImage: true,
  },
  {
    id: 3,
    author: "Thabo Nkosi",
    emoji: "🧑🏾‍💼",
    title: "Anyone attending Tech Summit Lagos next month?",
    content: "Planning to attend and would love to connect with community members there!",
    replies: 8,
    likes: 15,
    time: "1 day ago",
    isPinned: false,
    hasImage: false,
  },
]

const suggestedConnections = [
  { id: 1, name: "Oluwaseun Balogun", emoji: "👨🏿‍💻", role: "Full Stack Developer", mutualFriends: 3 },
  { id: 2, name: "Fatima Al-Rashid", emoji: "👩🏽‍💼", role: "Product Manager", mutualFriends: 5 },
  { id: 3, name: "Ibrahim Kamara", emoji: "👨🏾‍🎨", role: "UX Designer", mutualFriends: 2 },
]

export default function CommunityDetailsPage({ params }: { params: { id: string } }) {
  const [isJoined, setIsJoined] = useState(false)
  const community = communityData[params.id as keyof typeof communityData] || communityData["1"]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/communities">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">Amisag</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Community Header */}
      <div className="relative">
        <div className="h-64 overflow-hidden">
          <img 
            src={community.banner} 
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-20">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center text-6xl border-4 border-background shadow-xl">
                {community.icon}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{community.name}</h1>
                  <Badge className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]">
                    {community.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{community.members.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{community.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {community.founded}</span>
                  </div>
                </div>

                {/* Mutual Connections */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {mutualConnections.slice(0, 4).map((connection) => (
                      <Avatar key={connection.id} className="w-8 h-8 border-2 border-background">
                        <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-sm">{connection.emoji}</span>
                        </div>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    <span className="text-[oklch(0.75_0.15_85)] font-semibold">{mutualConnections.length} people you know</span> are here
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setIsJoined(!isJoined)}
                    className={
                      isJoined
                        ? "bg-[oklch(0.22_0_0)] text-foreground border border-border hover:bg-[oklch(0.25_0_0)]"
                        : "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                    }
                  >
                    {isJoined ? "Joined ✓" : "Join Community"}
                  </Button>
                  {isJoined && (
                    <Button variant="outline" asChild>
                      <Link href={`/communities/${community.id}/chat`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Go to Chat
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <Card className="border-border bg-card mb-6">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">About this community</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {community.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-[oklch(0.75_0.15_85)]">•</span>
                        <span>Be respectful and constructive in all interactions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[oklch(0.75_0.15_85)]">•</span>
                        <span>Share knowledge and help others grow</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[oklch(0.75_0.15_85)]">•</span>
                        <span>No spam or self-promotion without context</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-[oklch(0.75_0.15_85)]">•</span>
                        <span>Respect privacy and confidentiality</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Discussions Tab */}
              <TabsContent value="discussions">
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <motion.div
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="border-border bg-card hover:border-[oklch(0.75_0.15_85)] transition-all cursor-pointer">
                        <CardContent className="pt-6">
                          {discussion.isPinned && (
                            <div className="flex items-center gap-2 mb-3">
                              <Pin className="w-4 h-4 text-[oklch(0.75_0.15_85)] fill-current" />
                              <span className="text-xs font-semibold text-[oklch(0.75_0.15_85)] uppercase">Pinned</span>
                            </div>
                          )}
                          <div className="flex gap-4">
                            <Avatar className="w-12 h-12">
                              <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                                <span className="text-2xl">{discussion.emoji}</span>
                              </div>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{discussion.author}</span>
                                <span className="text-xs text-muted-foreground">{discussion.time}</span>
                              </div>
                              <h4 className="font-semibold text-lg mb-2">{discussion.title}</h4>
                              <p className="text-muted-foreground mb-4">{discussion.content}</p>
                              {discussion.hasImage && (
                                <div className="flex items-center gap-1 text-sm text-[oklch(0.75_0.15_85)] mb-3">
                                  <ImageIcon className="w-4 h-4" />
                                  <span>Contains images</span>
                                </div>
                              )}
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-[oklch(0.75_0.15_85)] transition-colors">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{discussion.replies} replies</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-[oklch(0.75_0.15_85)] transition-colors">
                                  <Heart className="w-4 h-4" />
                                  <span>{discussion.likes} likes</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-[oklch(0.75_0.15_85)] transition-colors">
                                  <Share2 className="w-4 h-4" />
                                  <span>Share</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members">
                <div className="grid sm:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <Card key={member.id} className="border-border bg-card hover:border-[oklch(0.75_0.15_85)] transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                                <span className="text-2xl">{member.emoji}</span>
                              </div>
                            </Avatar>
                            {member.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{member.name}</h4>
                              {member.isMutual && (
                                <Badge variant="outline" className="text-xs border-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]">
                                  Mutual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                            <Button size="sm" variant="outline" className="w-full">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* People You May Know */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[oklch(0.75_0.15_85)]" />
                  People You May Know Here
                </h3>
                <div className="space-y-4">
                  {suggestedConnections.map((person) => (
                    <div key={person.id} className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-lg">{person.emoji}</span>
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{person.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{person.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.mutualFriends} mutual connections
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Community Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <span className="font-semibold">{community.members.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Today</span>
                    <span className="font-semibold text-green-500">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Posts This Week</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Growth Rate</span>
                    <span className="font-semibold text-[oklch(0.75_0.15_85)]">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}