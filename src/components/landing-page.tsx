"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RippleBackground } from "@/components/ui/ripple-background"
import { HorizontalScrollBackground } from "@/components/ui/horizontal-scroll-background"
import { InfiniteMarquee } from "@/components/ui/infinite-marquee"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import { Sparkles, Users, Globe, Zap, Shield, Target, ChevronRight, Star, MessageSquare, TrendingUp, LogOut, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"

export function LandingPage() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  // Redirect authenticated users to profile dashboard
  // Check for both session and token (token might exist before session is loaded)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
    
    // If we have a token or session, redirect to dashboard
    if (!isPending && (session?.user || token)) {
      router.push("/profile/dashboard")
    }
  }, [session?.user, isPending, router])

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
      }
      refetch()
      toast.success("Signed out successfully")
      router.push("/login")
    }
  }

  // Show loading or redirecting if we have session or token
  const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : null
  if (!isPending && (session?.user || token)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <RippleBackground className="min-h-screen bg-background relative overflow-hidden" rippleCount={8} speed={1.5} color="oklch(0.75 0.15 85 / 0.2)">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" className="text-foreground" />
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-sm hover:text-primary transition-all duration-300 relative group cursor-pointer"
            >
              Features
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10 blur-sm -z-10"></span>
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-sm hover:text-primary transition-all duration-300 relative group cursor-pointer"
            >
              How It Works
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10 blur-sm -z-10"></span>
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('testimonials');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="text-sm hover:text-primary transition-all duration-300 relative group cursor-pointer"
            >
              Testimonials
              <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/10 blur-sm -z-10"></span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-8 h-8 border-2 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 button-glow-ghost">
                    <User className="w-4 h-4" />
                    {session.user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/insights">Insights</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/connect">Connect</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="button-glow-ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] button-glow-custom" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 z-10 min-h-[600px] overflow-hidden">
        <BackgroundRippleEffect rows={6} cols={20} cellSize={60} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Badge className="bg-[oklch(0.22_0_0)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)] mb-4 px-4 py-2">
                <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                AI-Powered Networking
              </Badge>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              Connect Across Africa
              <br />
              <motion.span 
                className="bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] bg-clip-text text-transparent relative inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Without Borders
                <motion.svg 
                  className="absolute w-full h-3 -bottom-2 left-0 text-[oklch(0.65_0.15_220)] opacity-50" 
                  viewBox="0 0 100 10" 
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </motion.svg>
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Meet students, professionals, and entrepreneurs across Africa. Build meaningful connections powered by AI matching—no physical meetings required.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] text-lg px-8 h-14 rounded-full button-glow-custom transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href={session?.user ? "/connect" : "/register"}>
                    Start Connecting <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-white/10 bg-black/10 hover:bg-white/10 hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.2),0_0_40px_-5px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/communities">Explore Communities</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 border-y border-border bg-background/50 backdrop-blur-sm overflow-hidden">
        <section className="py-16">
          <InfiniteMarquee speed={30} direction="left" className="w-full">
            <div className="flex">
              {[
                { label: "Success Rate", value: "94%" },
                { label: "Active Users", value: "50K+" },
                { label: "Connections Made", value: "200K+" },
                { label: "Countries", value: "54" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 text-center min-w-[350px] md:min-w-[400px] px-12 md:px-16"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[oklch(0.75_0.15_85)] whitespace-nowrap">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 whitespace-nowrap">{stat.label}</div>
                </div>
              ))}
            </div>
          </InfiniteMarquee>
        </section>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 bg-background relative z-10" id="how-it-works">
        <div className="container mx-auto max-w-6xl relative z-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Simple, fast, and intelligent networking
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us about your skills, goals, and what you're looking for in a connection.",
                icon: Users,
                direction: "left",
              },
              {
                step: "02",
                title: "AI Smart Matching",
                description: "Our AI analyzes profiles and suggests the best matches based on your interests and goals.",
                icon: Sparkles,
                direction: "up",
              },
              {
                step: "03",
                title: "Connect & Grow",
                description: "Swipe, connect, and start meaningful conversations that drive your career forward.",
                icon: TrendingUp,
                direction: "right",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: item.direction === "left" ? -50 : item.direction === "right" ? 50 : 0,
                  y: item.direction === "up" ? 50 : 0,
                  rotate: item.direction === "left" ? -5 : item.direction === "right" ? 5 : 0,
                  scale: 0.9
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  rotate: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="h-full bg-card border-border hover:border-[oklch(0.75_0.15_85)] transition-colors">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-[oklch(0.22_0_0)] flex items-center justify-center mb-6"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      <item.icon className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
                    </motion.div>
                    <motion.div 
                      className="text-sm text-[oklch(0.75_0.15_85)] font-semibold mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      STEP {item.step}
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-bold mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                      viewport={{ once: true }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      {item.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-[oklch(0.16_0_0)] relative z-10">
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Powerful Features
              </motion.h2>
              <motion.p 
                className="text-xl text-white/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Everything you need to build your network
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "AI Matching",
                  description: "Smart algorithms connect you with the right people based on your profile and goals.",
                },
                {
                  icon: Users,
                  title: "Community Spaces",
                  description: "Join industry-specific groups and engage with like-minded professionals.",
                },
                {
                  icon: MessageSquare,
                  title: "Real-time Chat",
                  description: "Instant messaging with one-on-one and group conversation support.",
                },
                {
                  icon: Globe,
                  title: "Pan-African Reach",
                  description: "Connect with professionals across all 54 African countries.",
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  description: "Your data is protected with enterprise-grade security and privacy controls.",
                },
                {
                  icon: Target,
                  title: "Goal Tracking",
                  description: "Set networking goals and track your progress with detailed analytics.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8,
                    rotateY: -15,
                    filter: "blur(10px)"
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    filter: "blur(0px)"
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="h-full bg-white/5 border-white/10 hover:border-[oklch(0.75_0.15_85)] transition-colors">
                    <CardContent className="pt-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                        viewport={{ once: true }}
                        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                      >
                        <feature.icon className="w-10 h-10 text-[oklch(0.75_0.15_85)] mb-4" />
                      </motion.div>
                      <motion.h3 
                        className="text-lg font-bold mb-2 text-white"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className="text-white/60 text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                        viewport={{ once: true }}
                      >
                        {feature.description}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 bg-background">
        <section id="testimonials" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                What Users Say
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Real stories from our community
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Amara Okafor",
                  role: "Software Engineer, Nigeria",
                  emoji: "👨🏿‍💻",
                  content: "Amisag helped me find a mentor who guided me through my career transition. The AI matching is incredibly accurate!",
                },
                {
                  name: "Kwame Mensah",
                  role: "Entrepreneur, Ghana",
                  emoji: "👨🏾‍💼",
                  content: "I've built partnerships across 5 African countries through Amisag. It's revolutionized how I network.",
                },
                {
                  name: "Zainab Hassan",
                  role: "Product Designer, Kenya",
                  emoji: "👩🏽‍🎨",
                  content: "The community spaces feature is amazing. I've learned so much from the design community here.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ 
                    opacity: 0, 
                    y: 50,
                    scale: 0.9,
                    filter: "blur(10px)"
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)"
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className="h-full bg-card border-border hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <motion.div 
                        className="flex gap-1 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.15 + 0.2 + i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <Star className="w-4 h-4 fill-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]" />
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.p 
                        className="text-foreground mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                        viewport={{ once: true }}
                      >
                        &quot;{testimonial.content}&quot;
                      </motion.p>
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                        viewport={{ once: true }}
                      >
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.15 + 0.5, type: "spring" }}
                          viewport={{ once: true }}
                          whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                        >
                          <span className="text-2xl">{testimonial.emoji}</span>
                        </motion.div>
                        <div>
                          <motion.div 
                            className="font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
                            viewport={{ once: true }}
                          >
                            {testimonial.name}
                          </motion.div>
                          <motion.div 
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.15 + 0.7 }}
                            viewport={{ once: true }}
                          >
                            {testimonial.role}
                          </motion.div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Section below CTA with Background Ripple Effect */}
      <div className="relative z-10 min-h-screen overflow-hidden bg-background">
        <BackgroundRippleEffect rows={12} cols={25} cellSize={60} />
        
        {/* CTA Section */}
        <div className="relative z-10 overflow-hidden">
          <motion.section 
            className="py-20 px-4 bg-gradient-to-r from-[oklch(0.75_0.15_85/0.85)] to-[oklch(0.65_0.15_220/0.85)] relative backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
              }}
            />
            <div className="container mx-auto max-w-4xl text-center relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6 text-[oklch(0.12_0_0)]"
              >
                Ready to Expand Your Network?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-xl mb-8 text-[oklch(0.12_0_0)]/80"
              >
                Join thousands of professionals connecting across Africa today.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-[oklch(0.12_0_0)] text-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.16_0_0)] hover:shadow-[0_0_30px_-5px_oklch(0.75_0.15_85/0.6),0_0_60px_-10px_oklch(0.75_0.15_85/0.4)] text-lg px-8 rounded-full h-14 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href={session?.user ? "/connect" : "/register"}>
                    {session?.user ? "Start Connecting" : "Get Started Free"} <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <div className="border-t border-border py-16 px-4 pb-32 bg-background/80 backdrop-blur-sm relative z-10">
          <div className="container mx-auto max-w-6xl relative z-20">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Logo size="lg" asLink={false} />
              <p className="text-lg text-muted-foreground italic">
                Networking made fun
              </p>
            </div>
            <div className="pt-8 mt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Amisag. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </RippleBackground>
  )
}