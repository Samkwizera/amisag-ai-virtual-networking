"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, MoreVertical, Plus, Users, MessageSquare, ArrowLeft, ChevronLeft } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

const conversations = [
  {
    id: 1,
    name: "Chioma Adebayo",
    emoji: "👩🏾‍💼",
    lastMessage: "That sounds like a great idea! Let's schedule a call.",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Kwame Osei",
    emoji: "👨🏿‍💻",
    lastMessage: "I've sent you the documents. Please review when you can.",
    time: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Amina Mohammed",
    emoji: "👩🏽‍🔬",
    lastMessage: "Thanks for connecting! Looking forward to collaborating.",
    time: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: "Tech Innovators Africa",
    emoji: "💻",
    lastMessage: "New event: Pan-African Tech Summit 2024",
    time: "1d ago",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: 5,
    name: "Thabo Nkosi",
    emoji: "👨🏾‍💼",
    lastMessage: "Would love to discuss potential partnerships!",
    time: "2d ago",
    unread: 0,
    online: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "Chioma Adebayo",
    content: "Hi! I saw your profile and I'm really impressed with your work in product design.",
    time: "10:30 AM",
    isMine: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Thank you so much! I really appreciate that. Your portfolio is amazing as well!",
    time: "10:32 AM",
    isMine: true,
  },
  {
    id: 3,
    sender: "Chioma Adebayo",
    content: "I'm currently working on a fintech project and I think your expertise could be valuable.",
    time: "10:33 AM",
    isMine: false,
  },
  {
    id: 4,
    sender: "You",
    content: "That sounds interesting! I'd love to hear more about it. What stage is the project at?",
    time: "10:35 AM",
    isMine: true,
  },
  {
    id: 5,
    sender: "Chioma Adebayo",
    content: "We're in the early design phase. Looking for someone who understands both UX and the African market.",
    time: "10:36 AM",
    isMine: false,
  },
  {
    id: 6,
    sender: "You",
    content: "Perfect! I've worked on several fintech projects across West Africa. Would you like to set up a call to discuss further?",
    time: "10:38 AM",
    isMine: true,
  },
  {
    id: 7,
    sender: "Chioma Adebayo",
    content: "That sounds like a great idea! Let's schedule a call.",
    time: "10:40 AM",
    isMine: false,
  },
]

interface Community {
  id: string
  name: string
  icon: string
  members: number
  category: string
  description: string
}

export default function NetworkMessagesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const isMobile = useIsMobile()
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([])
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true)
  const [showChat, setShowChat] = useState(false) // For mobile: true = show chat, false = show list

  // Fetch user's joined communities
  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      const token = localStorage.getItem("bearer_token")
      if (!token) {
        setIsLoadingCommunities(false)
        return
      }

      try {
        // For now, we'll use the hardcoded communities list and filter by isJoined
        // In a real app, you'd fetch from an API endpoint
        const mockCommunities: Community[] = [
          {
            id: "2",
            name: "African Design Collective",
            icon: "🎨",
            members: 8300,
            category: "Design",
            description: "Connect with designers, learn about African design principles, and showcase your creative work.",
          },
          {
            id: "6",
            name: "Startup Founders Circle",
            icon: "🚀",
            members: 11200,
            category: "Entrepreneurship",
            description: "A support network for startup founders to share challenges, wins, and resources.",
          },
        ]
        setJoinedCommunities(mockCommunities)
      } catch (error) {
        console.error("Error fetching communities:", error)
        toast.error("Failed to load communities")
      } finally {
        setIsLoadingCommunities(false)
      }
    }

    if (session?.user) {
      fetchJoinedCommunities()
    }
  }, [session])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending
      setMessageInput("")
    }
  }

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation)
    if (isMobile) {
      setShowChat(true)
    }
  }

  const handleBackToList = () => {
    setShowChat(false)
  }

  // Combine conversations and communities for display
  const allConversations = [
    ...conversations,
    ...joinedCommunities.map(community => ({
      id: `community-${community.id}`,
      name: community.name,
      emoji: community.icon,
      lastMessage: `${community.members.toLocaleString()} members`,
      time: "",
      unread: 0,
      online: false,
      isGroup: true,
      isCommunity: true,
      communityId: community.id,
    }))
  ]

  const filteredConversations = allConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-[calc(100vh-140px)] bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Conversations List */}
        <div className={`${
          isMobile 
            ? showChat ? "hidden" : "w-full" 
            : "w-full md:w-80 lg:w-96"
        } border-r border-border flex flex-col bg-card absolute md:relative inset-0 md:inset-auto z-10 md:z-auto`}>
          {/* Search */}
          <div className="p-3 md:p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 text-sm md:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {/* Communities Section */}
              {joinedCommunities.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <Users className="w-3 h-3" />
                      My Communities
                    </div>
                  </div>
                  {joinedCommunities
                    .filter(community => 
                      community.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((community) => (
                      <Link
                        key={community.id}
                        href={`/communities/${community.id}/chat`}
                        className="block"
                      >
                        <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-colors hover:bg-[oklch(0.22_0_0)]/50 group">
                          <div className="relative shrink-0">
                            <Avatar className="w-10 h-10 md:w-12 md:h-12">
                              <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                                <span className="text-xl md:text-2xl">{community.icon}</span>
                              </div>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[oklch(0.75_0.15_85)] rounded-full border-2 border-card flex items-center justify-center">
                              <Users className="w-1.5 h-1.5 md:w-2 md:h-2 text-[oklch(0.12_0_0)]" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 md:mb-1">
                              <span className="font-semibold text-sm md:text-base truncate">
                                {community.name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs md:text-sm text-muted-foreground truncate">
                                {community.members.toLocaleString()} members
                              </p>
                              <Badge variant="outline" className="ml-2 text-xs border-[oklch(0.75_0.15_85)]/30 text-[oklch(0.75_0.15_85)] shrink-0">
                                Community
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}

              {/* Individual Conversations Section */}
              <div>
                <div className="px-3 py-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <MessageSquare className="w-3 h-3" />
                    Conversations
                  </div>
                </div>
                {filteredConversations
                  .filter(conv => !conv.isCommunity)
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation.id === conversation.id
                          ? "bg-[oklch(0.22_0_0)]"
                          : "hover:bg-[oklch(0.22_0_0)]/50"
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12">
                          <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                            <span className="text-xl md:text-2xl">{conversation.emoji}</span>
                          </div>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5 md:mb-1">
                          <span className="font-semibold text-sm md:text-base truncate">
                            {conversation.name}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {conversation.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge className="ml-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] text-xs px-1.5 md:px-2 shrink-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${
          isMobile 
            ? showChat ? "w-full" : "hidden"
            : "flex-1"
        } flex flex-col bg-background absolute md:relative inset-0 md:inset-auto z-20 md:z-auto`}>
          {/* Chat Header */}
          <div className="p-3 md:p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBackToList}
                  className="shrink-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <Avatar className="w-8 h-8 md:w-10 md:h-10 shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                  <span className="text-lg md:text-xl">{selectedConversation.emoji}</span>
                </div>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm md:text-base truncate">{selectedConversation.name}</h3>
                {selectedConversation.online && (
                  <span className="text-xs text-green-500">Active now</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Video className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="space-y-3 md:space-y-4 p-3 md:p-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] sm:max-w-md ${message.isMine ? "flex-row-reverse" : ""}`}>
                    {!message.isMine && (
                      <Avatar className="w-6 h-6 md:w-8 md:h-8 shrink-0 mt-1">
                        <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-sm md:text-lg">{selectedConversation.emoji}</span>
                        </div>
                      </Avatar>
                    )}
                    <div className="min-w-0 flex-1">
                      <div
                        className={`px-3 py-2 md:px-4 md:py-2 rounded-2xl break-words ${
                          message.isMine
                            ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] rounded-tr-sm"
                            : "bg-[oklch(0.22_0_0)] rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground mt-1 block px-1 ${message.isMine ? "text-right" : ""}`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-3 md:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-card">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm md:text-base"
              />
              <Button
                className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] shrink-0"
                onClick={handleSendMessage}
                size={isMobile ? "icon" : "default"}
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                {!isMobile && <span className="ml-2">Send</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



