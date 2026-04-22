import { Canvas } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useEffect, useState } from 'react'
import { Vector2 } from 'three'
import Drone from './Drone'

export default function HeroScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      setMouse({ x: nx, y: ny })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 3.2], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[0x020408]} />
      <fog attach="fog" args={[0x020408, 5, 10]} />

      {/* Key rim lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={1.4} color="#00f5ff" />
      <pointLight position={[3, -1.5, 1.5]} intensity={0.9} color="#ff6b35" />
      <pointLight position={[0, -2, 2]} intensity={0.8} color="#7c6fff" />

      <Suspense fallback={null}>
        <Environment preset="night" />
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
          <Drone mouseX={mouse.x} mouseY={mouse.y} />
        </Float>

        {/* Ground reflection plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <circleGeometry args={[2.2, 64]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.04}
            transparent
            opacity={0.12}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.8}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0009, 0.0012)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  )
}
