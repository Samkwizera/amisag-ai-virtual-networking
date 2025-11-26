"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Sparkles, 
  Send, 
  MoreVertical, 
  ChevronLeft, 
  Plus,
  Smile,
  Paperclip,
  Users,
  Search,
  Bell,
  BellOff,
  Settings,
  Hash
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/ui/logo"

// Mock data for communities
const communities = [
  {
    id: "1",
    name: "Tech Innovators",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=200&fit=crop",
    members: 12500,
    unread: 3,
  },
  {
    id: "2",
    name: "Women in Business",
    banner: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=200&fit=crop",
    members: 8300,
    unread: 0,
  },
  {
    id: "3",
    name: "Climate Action",
    banner: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=200&fit=crop",
    members: 5600,
    unread: 1,
  },
  {
    id: "4",
    name: "Startups",
    banner: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=200&fit=crop",
    members: 11200,
    unread: 0,
  },
]

const messages = [
  {
    id: 1,
    author: "Chioma Adebayo",
    emoji: "👩🏾‍💼",
    content: "Hey everyone! Just launched our new fintech platform. Would love your feedback! 🚀",
    time: "10:30 AM",
    isOnline: true,
  },
  {
    id: 2,
    author: "Kwame Osei",
    emoji: "👨🏿‍💻",
    content: "Congratulations Chioma! That's exciting. What markets are you targeting?",
    time: "10:32 AM",
    isOnline: true,
  },
  {
    id: 3,
    author: "Amina Mohammed",
    emoji: "👩🏽‍🔬",
    content: "This looks amazing! Are you looking for beta testers?",
    time: "10:35 AM",
    isOnline: false,
  },
  {
    id: 4,
    author: "Thabo Nkosi",
    emoji: "👨🏾‍💼",
    content: "I'd be interested in learning more about the tech stack you used",
    time: "10:40 AM",
    isOnline: true,
  },
  {
    id: 5,
    author: "Chioma Adebayo",
    emoji: "👩🏾‍💼",
    content: "Thanks everyone! We're focusing on West Africa initially. @Amina yes, we're looking for beta testers! DM me 😊",
    time: "10:45 AM",
    isOnline: true,
  },
  {
    id: 6,
    author: "Zainab Hassan",
    emoji: "👩🏽‍🎨",
    content: "Love the UI design! Very clean and accessible",
    time: "11:00 AM",
    isOnline: false,
  },
]

const onlineMembers = [
  { id: 1, name: "Chioma Adebayo", emoji: "👩🏾‍💼", role: "Founder" },
  { id: 2, name: "Kwame Osei", emoji: "👨🏿‍💻", role: "Developer" },
  { id: 3, name: "Thabo Nkosi", emoji: "👨🏾‍💼", role: "Designer" },
  { id: 4, name: "Fatima Al-Rashid", emoji: "👩🏽‍💼", role: "Product Manager" },
  { id: 5, name: "Oluwaseun Balogun", emoji: "👨🏾‍💻", role: "Entrepreneur" },
]

export default function CommunityChatPage({ params }: { params: { id: string } }) {
  const [messageInput, setMessageInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMembers, setShowMembers] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentCommunity = communities.find(c => c.id === params.id) || communities[0]

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending
      setMessageInput("")
    }
  }

  const emojis = ["😊", "👍", "❤️", "🎉", "🚀", "💡", "👏", "🔥"]

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Logo size="md" href="/communities" className="hidden sm:flex" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowMembers(!showMembers)}
          >
            <Users className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Community Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-72 border-r border-border bg-card flex-shrink-0 flex flex-col absolute lg:relative h-full z-20 lg:z-0"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-lg mb-3">Communities</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 h-9" />
                </div>
              </div>

              {/* Communities List */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {communities.map((community) => (
                    <Link
                      key={community.id}
                      href={`/communities/${community.id}/chat`}
                      onClick={() => setShowSidebar(false)}
                    >
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          community.id === params.id
                            ? "bg-[oklch(0.22_0_0)] border border-[oklch(0.75_0.15_85)]"
                            : "hover:bg-[oklch(0.22_0_0)]/50"
                        }`}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img 
                              src={community.banner} 
                              alt={community.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {community.unread > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] text-xs px-1.5 h-5 min-w-5 flex items-center justify-center">
                              {community.unread}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-semibold text-sm truncate">
                              {community.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {community.members.toLocaleString()} members
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>

              {/* Create Community Button */}
              <div className="p-3 border-t border-border">
                <Button className="w-full bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Community
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Community Header */}
          <div className="border-b border-border bg-card flex-shrink-0">
            <div className="relative h-24 overflow-hidden">
              <img 
                src={currentCommunity.banner} 
                alt={currentCommunity.name}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-5 h-5 text-[oklch(0.75_0.15_85)]" />
                  <h1 className="text-xl font-bold">{currentCommunity.name}</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{currentCommunity.members.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{onlineMembers.length} online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3 hover:bg-[oklch(0.22_0_0)]/30 p-2 rounded-lg transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-10 h-10">
                      <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                        <span className="text-xl">{message.emoji}</span>
                      </div>
                    </Avatar>
                    {message.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{message.author}</span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Input
                    placeholder={`Message #${currentCommunity.name}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf,.doc,.docx"
                    />
                  </div>
                </div>
                <Button
                  className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2 p-2 bg-[oklch(0.22_0_0)] rounded-lg border border-border flex gap-2"
                  >
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        className="text-2xl hover:scale-125 transition-transform"
                        onClick={() => {
                          setMessageInput(messageInput + emoji)
                          setShowEmojiPicker(false)
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Online Members Sidebar */}
        <AnimatePresence>
          {showMembers && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-64 border-l border-border bg-card flex-shrink-0 absolute lg:relative right-0 h-full z-20 lg:z-0"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Online Members ({onlineMembers.length})
                </h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {onlineMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[oklch(0.22_0_0)]/50 cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="w-9 h-9">
                          <div className="w-full h-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                            <span className="text-lg">{member.emoji}</span>
                          </div>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 lg:right-80"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}