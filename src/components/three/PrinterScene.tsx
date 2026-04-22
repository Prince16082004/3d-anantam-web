import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Printer() {
  const head = useRef<THREE.Group>(null)
  const printed = useRef<THREE.Group>(null)
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (head.current) {
      head.current.position.x = Math.sin(t * 1.5) * 0.55
      head.current.position.z = Math.cos(t * 0.8) * 0.35
      head.current.position.y = 0.55 - ((t % 6) / 6) * 0.9
    }
    if (printed.current) {
      const h = ((t % 6) / 6) * 0.9
      printed.current.scale.y = Math.max(0.05, h)
      printed.current.position.y = -0.4 + h / 2
    }
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.25) * 0.4
    }
  })

  return (
    <group ref={group}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.6]} />
        <meshStandardMaterial color="#0a1826" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Build plate */}
      <mesh position={[0, -0.43, 0]} receiveShadow>
        <boxGeometry args={[1.4, 0.04, 1]} />
        <meshStandardMaterial
          color="#001a22"
          metalness={0.9}
          roughness={0.2}
          emissive="#002833"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Vertical rails */}
      {[
        [-0.95, -1, 0.75],
        [0.95, -1, 0.75],
        [-0.95, -1, -0.75],
        [0.95, -1, -0.75],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.1, p[2]]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 16]} />
          <meshStandardMaterial color="#0d1822" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* Top bridge */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2, 0.06, 0.1]} />
        <meshStandardMaterial color="#0d1822" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Print head */}
      <group ref={head} position={[0, 0.55, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.25, 0.3]} />
          <meshStandardMaterial
            color="#001a22"
            metalness={0.9}
            roughness={0.2}
            emissive="#00252e"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <coneGeometry args={[0.08, 0.15, 20]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={2}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Filament */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      </group>
      {/* Printed object */}
      <group ref={printed} position={[0, -0.4, 0]}>
        <mesh scale={[1, 1, 1]}>
          <cylinderGeometry args={[0.3, 0.35, 1, 18]} />
          <meshStandardMaterial
            color="#00f5ff"
            emissive="#00f5ff"
            emissiveIntensity={0.35}
            metalness={0.4}
            roughness={0.35}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>
      {/* Spool */}
      <mesh position={[0.75, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.07, 20, 40]} />
        <meshStandardMaterial
          color="#001a22"
          metalness={0.7}
          roughness={0.3}
          emissive="#00252e"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  )
}

export default function PrinterScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [1.8, 1.2, 2.5], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} />
      <pointLight position={[-2, 2, -2]} intensity={1.2} color="#00f5ff" />
      <pointLight position={[2, -1, 1]} intensity={0.6} color="#ff6b35" />
      <Environment preset="night" />
      <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.2}>
        <Printer />
      </Float>
    </Canvas>
  )
}
