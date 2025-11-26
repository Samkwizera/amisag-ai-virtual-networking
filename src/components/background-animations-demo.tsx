"use client"

import { ParticleBackground } from "@/components/ui/particle-background"
import { WaveBackground } from "@/components/ui/wave-background"
import { MeshBackground } from "@/components/ui/mesh-background"
import { GeometricBackground } from "@/components/ui/geometric-background"
import { RippleBackground } from "@/components/ui/ripple-background"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BackgroundAnimationsDemo() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Background Animations Showcase</h1>
        
        {/* Particle Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Particle Background</CardTitle>
          </CardHeader>
          <CardContent>
            <ParticleBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Floating particles with connecting lines</p>
              </div>
            </ParticleBackground>
          </CardContent>
        </Card>

        {/* Wave Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Wave Background</CardTitle>
          </CardHeader>
          <CardContent>
            <WaveBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Morphing wave patterns</p>
              </div>
            </WaveBackground>
          </CardContent>
        </Card>

        {/* Mesh Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Mesh Background</CardTitle>
          </CardHeader>
          <CardContent>
            <MeshBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Animated grid mesh</p>
              </div>
            </MeshBackground>
          </CardContent>
        </Card>

        {/* Geometric Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Geometric Background</CardTitle>
          </CardHeader>
          <CardContent>
            <GeometricBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Rotating geometric shapes</p>
              </div>
            </GeometricBackground>
          </CardContent>
        </Card>

        {/* Ripple Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Ripple Background</CardTitle>
          </CardHeader>
          <CardContent>
            <RippleBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Expanding ripple effects</p>
              </div>
            </RippleBackground>
          </CardContent>
        </Card>

        {/* Aurora Background */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle>Aurora Background</CardTitle>
          </CardHeader>
          <CardContent>
            <AuroraBackground className="h-64 rounded-lg">
              <div className="flex items-center justify-center h-full">
                <p className="text-lg font-semibold">Aurora-like flowing colors</p>
              </div>
            </AuroraBackground>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

