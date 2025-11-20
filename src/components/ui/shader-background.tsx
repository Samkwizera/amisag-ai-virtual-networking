"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

const GradientShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#000000") },
    uColor2: { value: new THREE.Color("#1a1a1a") },
    uColor3: { value: new THREE.Color("#0f172a") },
    uMouse: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Add some movement based on time
      float t = uTime * 0.2;
      
      // Warping effect
      float x = uv.x * 10.0;
      float y = uv.y * 10.0;
      
      float noise = sin(x + t) * cos(y + t) * 0.5;
      
      // Mouse interaction
      float dist = distance(uv, uMouse);
      float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.2;
      
      vec3 color = mix(uColor1, uColor2, uv.y + noise + mouseEffect);
      color = mix(color, uColor3, sin(uv.x + t) * 0.5 + 0.5);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
}

function GradientMesh() {
  const mesh = useRef<THREE.Mesh>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#000000") },
      uColor2: { value: new THREE.Color("#1a1a1a") },
      uColor3: { value: new THREE.Color("#0f172a") },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  useFrame((state) => {
    const { clock, pointer } = state
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime()
      
      // Smooth mouse movement
      mousePosition.current.x += (pointer.x * 0.5 + 0.5 - mousePosition.current.x) * 0.1
      mousePosition.current.y += (pointer.y * 0.5 + 0.5 - mousePosition.current.y) * 0.1
      
      ;(mesh.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.set(
        mousePosition.current.x,
        mousePosition.current.y
      )
    }
  })

  return (
    <mesh ref={mesh} scale={[20, 10, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        fragmentShader={GradientShader.fragmentShader}
        vertexShader={GradientShader.vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function ShaderBackground({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <GradientMesh />
      </Canvas>
    </div>
  )
}
