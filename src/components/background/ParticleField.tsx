/* eslint-disable react-hooks/immutability */
import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 450

type ParticleData = {
  geometry: THREE.BufferGeometry
  positions: Float32Array
  velocities: Float32Array
}

let cachedData: ParticleData | null = null
function getParticleData(): ParticleData {
  if (cachedData) return cachedData
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const velocities = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12
    velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  cachedData = { geometry, positions, velocities }
  return cachedData
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const data = getParticleData()

  useEffect(() => {
    function onMove(e: PointerEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { geometry, positions, velocities } = data
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]
      if (positions[i * 3 + 0] > 9 || positions[i * 3 + 0] < -9) velocities[i * 3 + 0] *= -1
      if (positions[i * 3 + 1] > 5 || positions[i * 3 + 1] < -5) velocities[i * 3 + 1] *= -1
      if (positions[i * 3 + 2] > 6 || positions[i * 3 + 2] < -6) velocities[i * 3 + 2] *= -1
    }
    attr.needsUpdate = true

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02 + mouse.current.x * 0.15
      pointsRef.current.rotation.x = mouse.current.y * 0.08
    }
  })

  return (
    <points ref={pointsRef} geometry={data.geometry}>
      <pointsMaterial
        size={0.035}
        color="#00f5ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GridFloor() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.ShaderMaterial
    if (mat.uniforms?.uTime) mat.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[50, 50, 1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#00f5ff') },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main() {
            vec2 grid = abs(fract(vUv * 40.0) - 0.5);
            float line = smoothstep(0.48, 0.5, max(grid.x, grid.y));
            float pulse = 0.6 + 0.4 * sin(uTime * 0.8 + vUv.y * 8.0);
            float fade = smoothstep(1.0, 0.0, length(vUv - 0.5) * 1.6);
            vec3 col = uColor * line * pulse * 0.55;
            gl_FragColor = vec4(col, line * fade * 0.45);
          }
        `}
      />
    </mesh>
  )
}

export default function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <Particles />
        <GridFloor />
      </Canvas>
    </div>
  )
}
