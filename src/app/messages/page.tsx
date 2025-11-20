"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Search, Send, MoreVertical, Phone, Video, ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"

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

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending
      setMessageInput("")
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/connect">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold">Messages</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation.id === conversation.id
                      ? "bg-[oklch(0.22_0_0)]"
                      : "hover:bg-[oklch(0.22_0_0)]/50"
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                        <span className="text-2xl">{conversation.emoji}</span>
                      </div>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold truncate">
                        {conversation.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] text-xs px-2">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                  <span className="text-xl">{selectedConversation.emoji}</span>
                </div>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedConversation.name}</h3>
                {selectedConversation.online && (
                  <span className="text-xs text-green-500">Active now</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-md ${message.isMine ? "flex-row-reverse" : ""}`}>
                    {!message.isMine && (
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-lg">{selectedConversation.emoji}</span>
                        </div>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isMine
                            ? "bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)]"
                            : "bg-[oklch(0.22_0_0)]"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className={`text-xs text-muted-foreground mt-1 block ${message.isMine ? "text-right" : ""}`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}