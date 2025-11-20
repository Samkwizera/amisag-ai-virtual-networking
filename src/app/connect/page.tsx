"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Heart, Bookmark, MapPin, Briefcase, GraduationCap, ChevronLeft, Sparkles, Info } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ExpandedProfileModal } from "@/components/expanded-profile-modal"
import { toast } from "sonner"

const profiles = [
  {
    id: "1",
    name: "Chioma Adebayo",
    age: 28,
    role: "Senior Product Designer",
    company: "Flutterwave",
    location: "Lagos, Nigeria",
    emoji: "👩🏾‍💼",
    bio: "Passionate about creating intuitive digital experiences. Looking to connect with fellow designers and tech entrepreneurs.",
    skills: ["UI/UX Design", "Figma", "Design Systems", "User Research"],
    interests: ["Mentorship", "Collaboration", "Product Development"],
    linkedinUrl: "https://linkedin.com/in/chioma-adebayo",
    portfolioUrl: "https://chioma-design.com",
  },
  {
    id: "2",
    name: "Kwame Osei",
    age: 32,
    role: "Software Engineering Lead",
    company: "Andela",
    location: "Accra, Ghana",
    emoji: "👨🏿‍💻",
    bio: "Building scalable systems and leading engineering teams. Open to sharing knowledge with aspiring developers.",
    skills: ["Python", "React", "Cloud Architecture", "Team Leadership"],
    interests: ["Tech Mentorship", "Startup Advising", "Open Source"],
    linkedinUrl: "https://linkedin.com/in/kwame-osei",
    portfolioUrl: "https://kwame-dev.io",
  },
  {
    id: "3",
    name: "Amina Mohammed",
    age: 25,
    role: "Data Scientist",
    company: "Jumia",
    location: "Nairobi, Kenya",
    emoji: "👩🏽‍🔬",
    bio: "Leveraging data to drive business decisions. Interested in AI/ML collaborations and knowledge sharing.",
    skills: ["Machine Learning", "Python", "SQL", "Data Visualization"],
    interests: ["AI Research", "Data Analytics", "Tech Community"],
    linkedinUrl: "https://linkedin.com/in/amina-mohammed",
  },
  {
    id: "4",
    name: "Thabo Nkosi",
    age: 30,
    role: "Founder & CEO",
    company: "GreenTech Solutions",
    location: "Cape Town, South Africa",
    emoji: "👨🏾‍💼",
    bio: "Building sustainable tech solutions for Africa. Looking for co-founders and strategic partnerships.",
    skills: ["Entrepreneurship", "Business Strategy", "Fundraising", "Sustainability"],
    interests: ["Climate Tech", "Investment", "Networking"],
    portfolioUrl: "https://greentech-solutions.co.za",
  },
  {
    id: "5",
    name: "Fatima Diallo",
    age: 27,
    role: "Marketing Director",
    company: "Wave Mobile Money",
    location: "Dakar, Senegal",
    emoji: "👩🏾‍💼",
    bio: "Digital marketing strategist with expertise in fintech. Seeking collaboration opportunities across West Africa.",
    skills: ["Digital Marketing", "Growth Strategy", "Brand Building", "Analytics"],
    interests: ["Fintech", "Marketing Innovation", "Cross-border Collaboration"],
    linkedinUrl: "https://linkedin.com/in/fatima-diallo",
    portfolioUrl: "https://fatima-marketing.com",
  },
]

export default function ConnectPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedProfiles, setSavedProfiles] = useState<string[]>([])
  const [matchAnimation, setMatchAnimation] = useState(false)
  const [showExpandedProfile, setShowExpandedProfile] = useState(false)

  const currentProfile = profiles[currentIndex]

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setMatchAnimation(true)
      setTimeout(() => {
        setMatchAnimation(false)
        if (currentIndex < profiles.length - 1) {
          setCurrentIndex(currentIndex + 1)
        }
      }, 1500)
    } else {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  const handleSave = () => {
    setSavedProfiles([...savedProfiles, currentProfile.id])
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleConnect = () => {
    toast.success(`Connection request sent to ${currentProfile.name}!`)
  }

  const handleMessage = () => {
    toast.success(`Opening chat with ${currentProfile.name}`)
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card border-border">
          <CardContent className="pt-6 text-center">
            <Sparkles className="w-16 h-16 mx-auto text-[oklch(0.75_0.15_85)] mb-4" />
            <h2 className="text-2xl font-bold mb-2">That&apos;s Everyone!</h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve seen all available profiles. Check back later for new connections!
            </p>
            <Button asChild className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold">Connect</span>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/messages">Messages</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {profiles.length} profiles
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info: PanInfo) => {
              if (info.offset.x > 100) {
                handleSwipe("right")
              } else if (info.offset.x < -100) {
                handleSwipe("left")
              }
            }}
            className="relative"
          >
            <Card className="overflow-hidden border-border bg-card">
              <div className="relative h-96">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[oklch(0.75_0.15_85)]/20 to-[oklch(0.65_0.15_220)]/20">
                  <div className="text-[200px] leading-none">{currentProfile.emoji}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{currentProfile.role} at {currentProfile.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{currentProfile.location}</span>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{currentProfile.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests.map((interest, index) => (
                      <Badge key={index} className="bg-[oklch(0.22_0_0)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* More Button */}
                <Button
                  variant="outline"
                  className="w-full text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)]/30 hover:bg-[oklch(0.75_0.15_85)]/10"
                  onClick={() => setShowExpandedProfile(true)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  View More Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.75_0.15_85)] hover:text-[oklch(0.12_0_0)]"
            onClick={handleSave}
          >
            <Bookmark className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Swipe or use buttons to connect
        </p>
      </div>

      {/* Match Animation */}
      <AnimatePresence>
        {matchAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-[oklch(0.75_0.15_85)] mb-2">
                It&apos;s a Match!
              </h2>
              <p className="text-xl text-white">
                You and {currentProfile.name} can now connect
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Profile Modal */}
      <ExpandedProfileModal
        open={showExpandedProfile}
        onOpenChange={setShowExpandedProfile}
        userId={currentProfile.id}
        userName={currentProfile.name}
        userImage={currentProfile.emoji}
        userRole={currentProfile.role}
        userCompany={currentProfile.company}
        userLocation={currentProfile.location}
        userBio={currentProfile.bio}
        userSkills={currentProfile.skills}
        linkedinUrl={currentProfile.linkedinUrl}
        portfolioUrl={currentProfile.portfolioUrl}
        onConnect={handleConnect}
        onMessage={handleMessage}
        mutualConnections={Math.floor(Math.random() * 10) + 1}
        sharedCommunities={["Tech Innovators Africa", "Startup Founders Network"]}
      />
    </div>
  )
}