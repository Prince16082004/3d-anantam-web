import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh, MeshStandardMaterial } from 'three'

interface DroneProps {
  mouseX?: number
  mouseY?: number
}

/**
 * Parametric quadcopter drone built from primitives.
 * Uses metallic + neon-emissive materials so the PBR lighting
 * reads well against the dark scene.
 */
export default function Drone({ mouseX = 0, mouseY = 0 }: DroneProps) {
  const root = useRef<Group>(null)
  const propRefs = useRef<(Mesh | null)[]>([])
  const ledRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!root.current) return
    const t = state.clock.elapsedTime

    // Gentle hover float
    root.current.position.y = Math.sin(t * 0.9) * 0.12

    // Mouse parallax + idle rotation
    const targetY = mouseX * 0.9 + Math.sin(t * 0.25) * 0.18
    const targetX = -mouseY * 0.5 + Math.sin(t * 0.4) * 0.08
    root.current.rotation.y += (targetY - root.current.rotation.y) * 0.07
    root.current.rotation.x += (targetX - root.current.rotation.x) * 0.07
    root.current.rotation.z = Math.sin(t * 0.5) * 0.05

    // Spin propellers
    propRefs.current.forEach((p, i) => {
      if (!p) return
      p.rotation.y += delta * (i % 2 === 0 ? 40 : -40)
    })

    // Blinking LED
    if (ledRef.current) {
      const mat = ledRef.current.material as MeshStandardMaterial
      mat.emissiveIntensity = 1.2 + Math.sin(t * 6) * 1.8
    }
  })

  const armLen = 1.1
  const armOffsets: [number, number][] = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
  ]

  return (
    <group ref={root} rotation={[0.15, 0.4, 0]} scale={1.05}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.28, 0.55]} />
        <meshStandardMaterial
          color="#0a1826"
          metalness={0.9}
          roughness={0.2}
          emissive="#001a22"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Top glass dome */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.28, 40, 40, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#00f5ff"
          metalness={0.1}
          roughness={0.1}
          transmission={0.5}
          thickness={0.5}
          emissive="#00aabb"
          emissiveIntensity={0.6}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      {/* Front camera */}
      <mesh position={[0, -0.02, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 24]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.02, 0.33]}>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={2}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>
      {/* LED */}
      <mesh ref={ledRef} position={[0.28, 0.1, -0.2]}>
        <sphereGeometry args={[0.04, 18, 18]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>

      {/* Arms + motors + propellers */}
      {armOffsets.map(([ax, az], i) => {
        const x = ax * armLen * 0.75
        const z = az * armLen * 0.5
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Arm */}
            <mesh
              position={[-x * 0.5, 0, -z * 0.5]}
              rotation={[0, Math.atan2(ax, az), 0]}
              castShadow
            >
              <boxGeometry args={[0.12, 0.07, Math.hypot(x, z) * 1.25]} />
              <meshStandardMaterial
                color="#0f1f2e"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
            {/* Motor */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.14, 28]} />
              <meshStandardMaterial
                color="#050c14"
                metalness={1}
                roughness={0.25}
                emissive="#00252e"
                emissiveIntensity={0.7}
              />
            </mesh>
            {/* Motor top ring */}
            <mesh position={[0, 0.13, 0]}>
              <torusGeometry args={[0.1, 0.015, 16, 36]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={1.6}
                metalness={0.6}
                roughness={0.2}
              />
            </mesh>
            {/* Propeller */}
            <mesh
              position={[0, 0.18, 0]}
              ref={(el) => {
                propRefs.current[i] = el
              }}
            >
              <boxGeometry args={[0.7, 0.015, 0.04]} />
              <meshStandardMaterial
                color="#0fe"
                transparent
                opacity={0.5}
                emissive="#00f5ff"
                emissiveIntensity={0.4}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          </group>
        )
      })}

      {/* Under glow ring */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.48, 48]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
