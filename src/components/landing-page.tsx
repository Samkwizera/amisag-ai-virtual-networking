"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackgroundLines } from "@/components/ui/background-lines"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { ShaderBackground } from "@/components/ui/shader-background"
import { Sparkles, Users, Globe, Zap, Shield, Target, ChevronRight, Star, MessageSquare, TrendingUp, LogOut, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
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

export function LandingPage() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      toast.success("Signed out successfully")
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ShaderBackground className="opacity-40" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="text-xl font-bold text-foreground">Amisag</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</Link>
            <Link href="/communities" className="text-sm hover:text-primary transition-colors">Communities</Link>
            {session?.user && (
              <Link href="/insights" className="text-sm hover:text-primary transition-colors">Insights</Link>
            )}
            <Link href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</Link>
          </div>
          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-8 h-8 border-2 border-[oklch(0.75_0.15_85)] border-t-transparent rounded-full animate-spin" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
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
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)]" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <BackgroundLines className="relative z-10 bg-transparent" svgOptions={{ duration: 12 }}>
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <Badge className="bg-[oklch(0.22_0_0)] text-[oklch(0.75_0.15_85)] border-[oklch(0.75_0.15_85)] mb-4 px-4 py-2">
                <Sparkles className="w-3 h-3 mr-2 animate-pulse" />
                AI-Powered Networking
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                Connect Across Africa
                <br />
                <span className="bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] bg-clip-text text-transparent relative">
                  Without Borders
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-[oklch(0.65_0.15_220)] opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Meet students, professionals, and entrepreneurs across Africa. Build meaningful connections powered by AI matching—no physical meetings required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button 
                  size="lg" 
                  className="bg-[oklch(0.75_0.15_85)] text-[oklch(0.12_0_0)] hover:bg-[oklch(0.7_0.15_85)] text-lg px-8 h-14 rounded-full shadow-[0_0_20px_-5px_oklch(0.75_0.15_85)] hover:shadow-[0_0_30px_-5px_oklch(0.75_0.15_85)] transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/connect">
                    Start Connecting <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full border-white/10 bg-black/10 hover:bg-white/10 backdrop-blur-sm transition-all duration-300" asChild>
                  <Link href="/communities">Explore Communities</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </BackgroundLines>
      </div>

      {/* Stats Section */}
      <div className="relative z-10">
        <section className="py-16 px-4 border-y border-border bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Users", value: "50K+" },
                { label: "Connections Made", value: "200K+" },
                { label: "Countries", value: "54" },
                { label: "Success Rate", value: "94%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[oklch(0.75_0.15_85)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* How It Works */}
      <BackgroundLines className="py-20 px-4 bg-background" svgOptions={{ duration: 14 }} id="how-it-works">
        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple, fast, and intelligent networking</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us about your skills, goals, and what you're looking for in a connection.",
                icon: Users,
              },
              {
                step: "02",
                title: "AI Smart Matching",
                description: "Our AI analyzes profiles and suggests the best matches based on your interests and goals.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Connect & Grow",
                description: "Swipe, connect, and start meaningful conversations that drive your career forward.",
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card border-border hover:border-[oklch(0.75_0.15_85)] transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-[oklch(0.22_0_0)] flex items-center justify-center mb-6">
                      <item.icon className="w-6 h-6 text-[oklch(0.75_0.15_85)]" />
                    </div>
                    <div className="text-sm text-[oklch(0.75_0.15_85)] font-semibold mb-2">STEP {item.step}</div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </BackgroundLines>

      {/* Features */}
      <div className="bg-[oklch(0.16_0_0)] relative z-10">
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Powerful Features</h2>
              <p className="text-xl text-white/60">Everything you need to build your network</p>
            </div>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-white/5 border-white/10 hover:border-[oklch(0.75_0.15_85)] transition-colors">
                    <CardContent className="pt-6">
                      <feature.icon className="w-10 h-10 text-[oklch(0.75_0.15_85)] mb-4" />
                      <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
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
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">What Users Say</h2>
              <p className="text-xl text-muted-foreground">Real stories from our community</p>
            </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-card border-border hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[oklch(0.75_0.15_85)] text-[oklch(0.75_0.15_85)]" />
                        ))}
                      </div>
                      <p className="text-foreground mb-6">&quot;{testimonial.content}&quot;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] flex items-center justify-center">
                          <span className="text-2xl">{testimonial.emoji}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <div className="relative z-10">
        <section className="py-20 px-4 bg-gradient-to-r from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)]">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className="bg-[oklch(0.12_0_0)] text-[oklch(0.75_0.15_85)] hover:bg-[oklch(0.16_0_0)] text-lg px-8 rounded-full h-14"
                asChild
              >
                <Link href={session?.user ? "/connect" : "/register"}>
                  {session?.user ? "Start Connecting" : "Get Started Free"} <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <BackgroundLines className="border-t border-border py-16 px-4 h-auto bg-background relative z-10" svgOptions={{ duration: 15 }}>
        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[oklch(0.75_0.15_85)] to-[oklch(0.65_0.15_220)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-bold">Amisag</span>
            </div>
            <p className="text-lg text-muted-foreground italic">
              Networking made fun
            </p>
          </div>
          <div className="pt-8 mt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Amisag. All rights reserved.</p>
          </div>
        </div>
      </BackgroundLines>
    </div>
  )
}