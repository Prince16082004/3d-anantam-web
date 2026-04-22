import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Product } from '../../data/products'

interface Props {
  shape: Product['shape']
  color: string
  speed?: number
}

/**
 * Tiny 3D part visualization for product cards.
 * Each shape is a minimalist abstract representation
 * of the real part, built from primitives for cheap render cost.
 */
export default function ProductMesh({ shape, color, speed = 0.6 }: Props) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = t * speed
    group.current.rotation.x = Math.sin(t * 0.3) * 0.2
    group.current.position.y = Math.sin(t * 1.2) * 0.05
  })

  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.35}
      metalness={0.7}
      roughness={0.28}
    />
  )

  let content: React.ReactNode = null

  switch (shape) {
    case 'frame':
      content = (
        <>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((r, i) => (
            <mesh key={i} rotation={[0, r, 0]} position={[0.45, 0, 0.45]}>
              <boxGeometry args={[0.08, 0.06, 0.6]} />
              {mat}
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            {mat}
          </mesh>
        </>
      )
      break
    case 'disc':
      content = (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.08, 18, 40]} />
          {mat}
        </mesh>
      )
      break
    case 'mount':
      content = (
        <>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.7, 0.08, 0.5]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.5, 0.08, 0.3]} />
            {mat}
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.55, 20]} />
            {mat}
          </mesh>
        </>
      )
      break
    case 'tube':
      content = (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 1.1, 32]} />
          {mat}
        </mesh>
      )
      break
    case 'plate':
      content = (
        <mesh>
          <boxGeometry args={[0.85, 0.06, 0.55]} />
          {mat}
        </mesh>
      )
      break
    case 'leg':
      content = (
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.3, -0.1, 0]} rotation={[0, 0, (s * Math.PI) / 8]}>
              <boxGeometry args={[0.12, 0.7, 0.12]} />
              {mat}
            </mesh>
          ))}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.06, 0.3]} />
            {mat}
          </mesh>
        </>
      )
      break
    case 'chassis':
      content = (
        <>
          <mesh>
            <boxGeometry args={[1, 0.15, 0.6]} />
            {mat}
          </mesh>
          {[
            [0.35, -0.15, 0.25],
            [-0.35, -0.15, 0.25],
            [0.35, -0.15, -0.25],
            [-0.35, -0.15, -0.25],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
              {mat}
            </mesh>
          ))}
        </>
      )
      break
    case 'bracket':
      content = (
        <>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.6, 0.08, 0.3]} />
            {mat}
          </mesh>
          <mesh position={[0.25, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.3]} />
            {mat}
          </mesh>
        </>
      )
      break
  }

  return (
    <group ref={group} scale={1.1}>
      {content}
    </group>
  )
}
