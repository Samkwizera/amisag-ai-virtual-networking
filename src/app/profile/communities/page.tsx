"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, MessageSquare, TrendingUp, Plus, Filter, MapPin, Brain } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

const communities = [
  {
    id: "1",
    name: "Tech Innovators Africa",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=200&fit=crop",
    icon: "💻",
    members: 12500,
    category: "Technology",
    description: "A community for tech entrepreneurs, developers, and innovators across Africa to share ideas and collaborate.",
    isJoined: false,
    mutualConnections: 8,
    location: "Pan-African",
    trending: true,
  },
  {
    id: "2",
    name: "African Design Collective",
    banner: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=200&fit=crop",
    icon: "🎨",
    members: 8300,
    category: "Design",
    description: "Connect with designers, learn about African design principles, and showcase your creative work.",
    isJoined: true,
    mutualConnections: 5,
    location: "Kenya, Nigeria",
    trending: false,
  },
  {
    id: "3",
    name: "FinTech Leaders Network",
    banner: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=200&fit=crop",
    icon: "💰",
    members: 15600,
    category: "Finance",
    description: "Explore the future of finance in Africa. Connect with fintech founders, investors, and industry experts.",
    isJoined: false,
    mutualConnections: 12,
    location: "Pan-African",
    trending: true,
  },
  {
    id: "4",
    name: "AgriTech Revolution",
    banner: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=200&fit=crop",
    icon: "🌱",
    members: 6700,
    category: "Agriculture",
    description: "Transforming African agriculture through technology and innovation.",
    isJoined: false,
    mutualConnections: 3,
    location: "East Africa",
    trending: false,
  },
  {
    id: "5",
    name: "Women in Tech Africa",
    banner: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=200&fit=crop",
    icon: "👩‍💻",
    members: 9400,
    category: "Technology",
    description: "Empowering women in technology across the African continent through mentorship and community.",
    isJoined: false,
    mutualConnections: 6,
    location: "Pan-African",
    trending: true,
  },
  {
    id: "6",
    name: "Startup Founders Circle",
    banner: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=200&fit=crop",
    icon: "🚀",
    members: 11200,
    category: "Entrepreneurship",
    description: "A support network for startup founders to share challenges, wins, and resources.",
    isJoined: true,
    mutualConnections: 9,
    location: "Lagos, Nairobi",
    trending: false,
  },
  {
    id: "7",
    name: "Health Tech Innovators",
    banner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=200&fit=crop",
    icon: "🏥",
    members: 5200,
    category: "Health",
    description: "Building the future of healthcare in Africa through technology and innovation.",
    isJoined: false,
    mutualConnections: 4,
    location: "South Africa",
    trending: false,
  },
  {
    id: "8",
    name: "Sustainability Champions",
    banner: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=200&fit=crop",
    icon: "🌍",
    members: 7800,
    category: "Sustainability",
    description: "Driving sustainable development and environmental conservation across Africa.",
    isJoined: false,
    mutualConnections: 7,
    location: "Pan-African",
    trending: true,
  },
  {
    id: "9",
    name: "EdTech Africa",
    banner: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=200&fit=crop",
    icon: "📚",
    members: 10300,
    category: "Education",
    description: "Revolutionizing education through technology and innovative teaching methods.",
    isJoined: false,
    mutualConnections: 11,
    location: "Pan-African",
    trending: true,
  },
]

const discussions = [
  {
    id: 1,
    community: "Tech Innovators Africa",
    author: "Kwame Mensah",
    emoji: "👨🏾‍💼",
    title: "What are the best practices for scaling a SaaS product in Africa?",
    replies: 24,
    likes: 56,
    time: "2 hours ago",
  },
  {
    id: 2,
    community: "African Design Collective",
    author: "Zainab Hassan",
    emoji: "👩🏽‍🎨",
    title: "Incorporating African patterns in modern UI design",
    replies: 18,
    likes: 43,
    time: "4 hours ago",
  },
  {
    id: 3,
    community: "Tech Innovators Africa",
    author: "Chioma Adebayo",
    emoji: "👩🏾‍💼",
    title: "Looking for feedback on my new mobile app concept",
    replies: 12,
    likes: 28,
    time: "1 day ago",
  },
]

const categories = [
  { name: "All", icon: "✨", count: 9 },
  { name: "Technology", icon: "💻", count: 2 },
  { name: "Design", icon: "🎨", count: 1 },
  { name: "Finance", icon: "💰", count: 1 },
  { name: "Entrepreneurship", icon: "🚀", count: 1 },
  { name: "Health", icon: "🏥", count: 1 },
  { name: "Sustainability", icon: "🌍", count: 1 },
  { name: "Education", icon: "📚", count: 1 },
  { name: "Agriculture", icon: "🌱", count: 1 },
]

const mutualAvatars = [
  { id: 1, emoji: "👨🏾‍💼" },
  { id: 2, emoji: "👩🏾‍💼" },
  { id: 3, emoji: "👨🏿‍💻" },
]

export default function NetworkCommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || community.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const recommendedCommunities = communities
    .filter(c => !c.isJoined && c.trending)
    .sort((a, b) => b.mutualConnections - a.mutualConnections)
    .slice(0, 3)

  return (
    <div className="min-h-[calc(100vh-140px)] bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search communities by name, topic, or interest..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Community</span>
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={
                  selectedCategory === category.name
                    ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] whitespace-nowrap"
                    : "whitespace-nowrap"
                }
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-communities">
              My Communities
              <Badge className="ml-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]">
                {communities.filter(c => c.isJoined).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="discussions">Recent Discussions</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover">
            {/* AI Recommended Section */}
            {recommendedCommunities.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
                  <h2 className="text-2xl font-bold">Recommended for You</h2>
                  <Badge className="bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] text-[oklch(0.12_0_0)]">
                    AI Powered
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {recommendedCommunities.map((community) => (
                    <motion.div
                      key={community.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/communities/${community.id}`}>
                        <Card className="overflow-hidden border-2 border-[oklch(0.75_0.15_85)]/30 bg-gradient-to-br from-card to-[oklch(0.22_0_0)] hover:border-[oklch(0.75_0.15_85)] transition-all cursor-pointer h-full">
                          <div className="relative h-32">
                            <img
                              src={community.banner}
                              alt={community.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                            <div className="absolute top-2 left-2 text-3xl">
                              {community.icon}
                            </div>
                            <Badge className="absolute top-2 right-2 bg-[oklch(0.12_0_0)]/80 backdrop-blur-sm">
                              {community.category}
                            </Badge>
                            {community.trending && (
                              <Badge className="absolute bottom-2 right-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <CardHeader>
                            <CardTitle className="text-lg">{community.name}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{community.members.toLocaleString()} members</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {community.description}
                            </p>
                            
                            {/* Mutual Connections */}
                            {community.mutualConnections > 0 && (
                              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                                <div className="flex -space-x-2">
                                  {mutualAvatars.slice(0, 3).map((avatar) => (
                                    <Avatar key={avatar.id} className="w-6 h-6 border-2 border-card">
                                      <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                                        <span className="text-xs">{avatar.emoji}</span>
                                      </div>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-xs text-[oklch(0.75_0.15_85)] font-semibold">
                                  {community.mutualConnections} people you know
                                </span>
                              </div>
                            )}

                            <Button className="w-full bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]">
                              View Community
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Communities */}
            <div>
              <h2 className="text-2xl font-bold mb-6">All Communities</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community, index) => (
                  <motion.div
                    key={community.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link href={`/communities/${community.id}`}>
                      <Card className="overflow-hidden border-border bg-card hover:border-[oklch(0.75_0.15_85)] transition-all cursor-pointer h-full">
                        <div className="relative h-32">
                          <img
                            src={community.banner}
                            alt={community.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                          <div className="absolute top-2 left-2 text-3xl">
                            {community.icon}
                          </div>
                          <Badge className="absolute top-2 right-2 bg-[oklch(0.12_0_0)]/80 backdrop-blur-sm">
                            {community.category}
                          </Badge>
                          {community.trending && (
                            <Badge className="absolute bottom-2 right-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{community.name}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{community.members.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{community.location}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {community.description}
                          </p>
                          
                          {/* Mutual Connections */}
                          {community.mutualConnections > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex -space-x-2">
                                {mutualAvatars.slice(0, 3).map((avatar) => (
                                  <Avatar key={avatar.id} className="w-6 h-6 border-2 border-card">
                                    <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                                      <span className="text-xs">{avatar.emoji}</span>
                                    </div>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-[oklch(0.75_0.15_85)] font-semibold">
                                {community.mutualConnections} people you know
                              </span>
                            </div>
                          )}

                          <Button
                            className={
                              community.isJoined
                                ? "w-full border-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]"
                                : "w-full bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                            }
                            variant={community.isJoined ? "outline" : "default"}
                          >
                            {community.isJoined ? "Joined ✓" : "View Community"}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Communities Tab */}
          <TabsContent value="my-communities">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities
                .filter((c) => c.isJoined)
                .map((community) => (
                  <Card key={community.id} className="overflow-hidden border-border bg-card">
                    <div className="relative h-32">
                      <img
                        src={community.banner}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <div className="absolute top-2 left-2 text-3xl">
                        {community.icon}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{community.members.toLocaleString()} members</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button className="flex-1" variant="outline" asChild>
                          <Link href={`/communities/${community.id}/chat`}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Link>
                        </Button>
                        <Button className="flex-1 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]" asChild>
                          <Link href={`/communities/${community.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <div className="space-y-4 max-w-4xl">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="border-border bg-card hover:border-[oklch(0.75_0.15_85)] transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12">
                        <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-2xl">{discussion.emoji}</span>
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{discussion.author}</span>
                          <span className="text-muted-foreground text-sm">in</span>
                          <Badge variant="outline" className="text-xs">
                            {discussion.community}
                          </Badge>
                          <span className="text-muted-foreground text-sm ml-auto">
                            {discussion.time}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-3">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



