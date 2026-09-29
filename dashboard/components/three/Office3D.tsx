'use client'
/**
 * 3D 오피스 — Claw3D(iamlukethedev/Claw3D) 스타일의 로우폴리 아이소메트릭 사무실.
 * 외부 3D 에셋 없이 기본 지오메트리(box/cylinder/sphere) 조합으로 구성하고,
 * 직원 근무 사이클(7-state)을 실시간 반영한다.
 */
import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { deriveEmployeeState, type EmployeeState, STATE_LABEL } from '@/lib/employee-state'
import type { AgentCharacter, RoutineWithStatus } from '@/types'

// ── 팀 색상 — 따뜻한 사무실 카펫 + 포인트 액센트 ──────────────
const TEAM_COLOR: Record<string, { carpet: string; accent: string }> = {
  'Wiki 관리팀':    { carpet: '#5b6b6a', accent: '#5ed6a8' },
  'AI 검색 품질팀': { carpet: '#5a6470', accent: '#5fc7d6' },
  '자동 검색팀':    { carpet: '#6a6070', accent: '#b89bd6' },
}

const STATE_DOT: Record<EmployeeState, string> = {
  working: '#fbbf24',
  standby: '#38bdf8',
  'handed-off': '#34d399',
  preparing: '#fde047',
  'just-done': '#34d399',
  resting: '#94a3b8',
  'off-duty': '#475569',
  error: '#f87171',
}

const SKIN = '#e8b794'
const HAIR = '#1f1a17'

interface EmployeeSeat {
  agent: AgentCharacter
  routine: RoutineWithStatus
  position: [number, number, number]  // 책상 기준 위치
  rotationY: number                   // 책상이 바라보는 방향
  accent: string
}

// ── 책상 + 모니터 + 의자 ─────────────────────────────────────
function Desk({ working, accent }: { working: boolean; accent: string }) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(({ clock }) => {
    if (!screenRef.current) return
    // 근무 중 모니터 글로우 펄스
    screenRef.current.emissiveIntensity = working
      ? 0.9 + Math.sin(clock.elapsedTime * 2.4) * 0.35
      : 0.04
  })

  return (
    <group>
      {/* 상판 */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.5, 0.07, 0.75]} />
        <meshStandardMaterial color="#7c5c3e" roughness={0.85} />
      </mesh>
      {/* 다리 4개 */}
      {([[-0.65, -0.3], [0.65, -0.3], [-0.65, 0.3], [0.65, 0.3]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]}>
          <boxGeometry args={[0.07, 0.72, 0.07]} />
          <meshStandardMaterial color="#4a3826" roughness={0.9} />
        </mesh>
      ))}
      {/* 모니터 */}
      <group position={[0, 0.76, -0.18]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.09, 0.2, 0.09]} />
          <meshStandardMaterial color="#222831" />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.62, 0.4, 0.05]} />
          <meshStandardMaterial color="#10141c" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0.028]}>
          <boxGeometry args={[0.54, 0.32, 0.01]} />
          <meshStandardMaterial
            ref={screenRef}
            color="#0b1020"
            emissive={accent}
            emissiveIntensity={0.04}
          />
        </mesh>
      </group>
      {/* 의자 */}
      <group position={[0, 0, 0.62]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.5, 0.07, 0.48]} />
          <meshStandardMaterial color="#2b3442" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.66, 0.21]}>
          <boxGeometry args={[0.5, 0.5, 0.07]} />
          <meshStandardMaterial color="#2b3442" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
          <meshStandardMaterial color="#1a202c" />
        </mesh>
      </group>
    </group>
  )
}

// ── 로우폴리 직원 캐릭터 ─────────────────────────────────────
function Employee({ seat, state, onSelect }: {
  seat: EmployeeSeat
  state: EmployeeState
  onSelect: (id: string) => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const dotRef = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)
  const working = state === 'working'
  const away = state === 'off-duty'
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) {
      // 근무 중 타이핑 모션(상체 미세 흔들림), 평시 호흡
      groupRef.current.position.y = working
        ? Math.sin(t * 7 + phase) * 0.015
        : Math.sin(t * 1.6 + phase) * 0.008
    }
    if (dotRef.current) {
      const pulse = state === 'working' || state === 'preparing'
        ? 0.75 + Math.sin(t * 4 + phase) * 0.45
        : 0.55
      dotRef.current.emissiveIntensity = away ? 0 : pulse
    }
  })

  const bodyColor = away ? '#3c4654' : seat.accent
  const opacity = away ? 0.32 : 1
  const dotColor = STATE_DOT[state]

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0.6]}
      onClick={e => { e.stopPropagation(); onSelect(seat.agent.id) }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* 몸통 */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.34, 0.42, 0.24]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* 팔 (근무 중엔 책상 쪽으로) */}
      {([-0.22, 0.22] as const).map((x, i) => (
        <mesh
          key={i}
          position={[x, working ? 0.6 : 0.56, working ? -0.12 : 0]}
          rotation={[working ? -0.9 : -0.15, 0, 0]}
        >
          <boxGeometry args={[0.09, 0.32, 0.09]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* 머리 */}
      <mesh position={[0, 0.97, 0]} castShadow>
        <boxGeometry args={[0.24, 0.24, 0.22]} />
        <meshStandardMaterial color={away ? '#5b6675' : SKIN} roughness={0.6} transparent opacity={opacity} />
      </mesh>
      {/* 머리카락 */}
      <mesh position={[0, 1.08, -0.02]}>
        <boxGeometry args={[0.26, 0.1, 0.24]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} transparent opacity={opacity} />
      </mesh>

      {/* 상태 점 (머리 위) */}
      {!away && (
        <mesh position={[0, 1.28, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial ref={dotRef} color={dotColor} emissive={dotColor} emissiveIntensity={0.6} />
        </mesh>
      )}
      {/* 휴식 중 커피잔 */}
      {state === 'resting' && (
        <group position={[0.26, 0.62, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.04, 0.1, 10]} />
            <meshStandardMaterial color="#e7e5e4" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.015, 10]} />
            <meshStandardMaterial color="#6b4226" />
          </mesh>
        </group>
      )}

      {/* 이름표 — hover 시 상태 포함 */}
      <Text
        position={[0, 1.48, 0]}
        fontSize={hovered ? 0.13 : 0.11}
        color={hovered ? '#ffffff' : away ? '#64748b' : '#cbd5e1'}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.008}
        outlineColor="#0a0f1a"
      >
        {hovered ? `${seat.agent.name} · ${STATE_LABEL[state]}` : seat.agent.name}
      </Text>
    </group>
  )
}

// ── 팀 구역 (카펫 + 팀명 + 책상들) ────────────────────────────
function TeamZone({ routine, nowMs, origin, cols, onSelect }: {
  routine: RoutineWithStatus
  nowMs: number
  origin: [number, number]
  cols: number
  onSelect: (id: string) => void
}) {
  const color = TEAM_COLOR[routine.department] ?? { carpet: '#1e293b', accent: '#94a3b8' }
  const agents = routine.agents
  const rows = Math.ceil(agents.length / cols)
  const DX = 2.3, DZ = 2.5
  const w = cols * DX + 0.9
  const d = rows * DZ + 1.3
  const isActive = routine.status === 'running'

  return (
    <group position={[origin[0], 0, origin[1]]}>
      {/* 카펫 — 부드러운 패브릭 질감 */}
      <mesh position={[0, 0.014, 0.25]} receiveShadow>
        <boxGeometry args={[w, 0.028, d]} />
        <meshStandardMaterial color={color.carpet} roughness={1} metalness={0} />
      </mesh>
      {/* 카펫 테두리 (살짝 밝은 트림) */}
      <mesh position={[0, 0.016, 0.25]}>
        <boxGeometry args={[w - 0.3, 0.03, d - 0.3]} />
        <meshStandardMaterial color={color.carpet} roughness={1} emissive={color.accent} emissiveIntensity={0.04} />
      </mesh>
      {/* 팀 경계 라이트 스트립 — 근무 중 발광 */}
      <mesh position={[0, 0.02, 0.25 - d / 2 + 0.04]}>
        <boxGeometry args={[w, 0.025, 0.08]} />
        <meshStandardMaterial
          color={color.accent}
          emissive={color.accent}
          emissiveIntensity={isActive ? 1.4 : 0.18}
        />
      </mesh>
      {/* 팀명 */}
      <Text
        position={[0, 0.03, 0.25 - d / 2 - 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.34}
        color={isActive ? color.accent : '#64748b'}
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#0a0f1a"
      >
        {routine.department}
      </Text>

      {agents.map((agent, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = (col - (cols - 1) / 2) * DX
        const z = (row - (rows - 1) / 2) * DZ
        const state = deriveEmployeeState(routine, agent, nowMs)
        return (
          <group key={agent.id} position={[x, 0, z]}>
            <Desk working={state === 'working'} accent={color.accent} />
            <Employee
              seat={{ agent, routine, position: [x, 0, z], rotationY: 0, accent: color.accent }}
              state={state}
              onSelect={onSelect}
            />
          </group>
        )
      })}
    </group>
  )
}

// ── 바닥 + 벽 + 소품 ─────────────────────────────────────────
function OfficeEnvironment() {
  const FLOOR_W = 26
  const FLOOR_D = 16
  const WALL_H = 3.2
  return (
    <group>
      {/* 따뜻한 우드톤 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_W, FLOOR_D]} />
        <meshStandardMaterial color="#b89372" roughness={0.78} metalness={0.02} />
      </mesh>
      {/* 바닥 우드 플랭크 라인 — 우드톤에 녹아드는 결 */}
      <gridHelper
        args={[FLOOR_W, 26, '#a6845f', '#ad8a64']}
        position={[0, 0.004, 0]}
      />

      {/* 뒤쪽 두 벽 (아이소메트릭에서 보이는 면만) */}
      <mesh position={[0, WALL_H / 2, -FLOOR_D / 2]} receiveShadow>
        <boxGeometry args={[FLOOR_W, WALL_H, 0.2]} />
        <meshStandardMaterial color="#e7ddd0" roughness={0.95} />
      </mesh>
      <mesh position={[-FLOOR_W / 2, WALL_H / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, WALL_H, FLOOR_D]} />
        <meshStandardMaterial color="#ded3c4" roughness={0.95} />
      </mesh>
      {/* 걸레받이 (벽-바닥 경계 따뜻한 라인) */}
      <mesh position={[0, 0.08, -FLOOR_D / 2 + 0.12]}>
        <boxGeometry args={[FLOOR_W, 0.16, 0.06]} />
        <meshStandardMaterial color="#a8866b" roughness={0.85} />
      </mesh>
      {/* 뒷벽 창문 2개 (따뜻한 빛) */}
      {([-6, 4] as const).map((x, i) => (
        <group key={i} position={[x, 1.9, -FLOOR_D / 2 + 0.12]}>
          <mesh>
            <boxGeometry args={[3, 1.5, 0.05]} />
            <meshStandardMaterial color="#fff6e0" emissive="#ffe9b8" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.08, 1.5, 0.06]} />
            <meshStandardMaterial color="#cbb89c" />
          </mesh>
        </group>
      ))}

      {/* 화분 2개 */}
      {([[-11, -6], [11, 6]] as const).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.24, 0.5, 8]} />
            <meshStandardMaterial color="#7c5c3e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {/* 휴게 코너: 커피머신 테이블 */}
      <group position={[10.5, 0, -5.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 0.8]} />
          <meshStandardMaterial color="#324054" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.28, 0]} castShadow>
          <boxGeometry args={[0.5, 0.55, 0.45]} />
          <meshStandardMaterial color="#171f2b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.28, 0.24]}>
          <boxGeometry args={[0.2, 0.12, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 1.85, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
          ☕ 휴게 코너
        </Text>
      </group>
    </group>
  )
}

// ── 메인 씬 ──────────────────────────────────────────────────
interface Props {
  routines: RoutineWithStatus[]
  nowMs: number
  onSelectAgent: (id: string) => void
}

export default function Office3D({ routines, nowMs, onSelectAgent }: Props) {
  // 팀 구역 배치: Wiki(좌, 3열) / 품질(우상, 2열) / 검색(우하, 2열)
  const zones = useMemo(() => {
    const byDept = new Map(routines.map(r => [r.department, r]))
    return [
      { routine: byDept.get('Wiki 관리팀'),    origin: [-5.5, 0] as [number, number], cols: 3 },
      { routine: byDept.get('AI 검색 품질팀'), origin: [4.8, -3.4] as [number, number], cols: 2 },
      { routine: byDept.get('자동 검색팀'),    origin: [4.8, 3.6] as [number, number], cols: 2 },
    ].filter((z): z is { routine: RoutineWithStatus; origin: [number, number]; cols: number } => !!z.routine)
  }, [routines])

  return (
    <div className="office-3d-canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [10.5, 9, 10.5], fov: 36 }}
        gl={{ antialias: true, toneMappingExposure: 1.35 }}
      >
        <color attach="background" args={['#2a2530']} />
        <fog attach="fog" args={['#2a2530', 32, 54]} />

        {/* 따뜻한 실내 조명 — 천장 형광 + 창문 햇살 */}
        <ambientLight intensity={1.0} color="#fff4e6" />
        <hemisphereLight args={['#fff1d6', '#6b5a48', 0.7]} />
        <directionalLight
          position={[8, 15, 10]}
          intensity={1.35}
          color="#fff0d4"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
        />
        {/* 창문에서 들어오는 부드러운 햇살 */}
        <pointLight position={[-6, 3, -7]} intensity={0.6} color="#ffe3a8" distance={20} decay={1.5} />
        <pointLight position={[4, 3, -7]} intensity={0.6} color="#ffe3a8" distance={20} decay={1.5} />

        <OfficeEnvironment />
        {zones.map(z => (
          <TeamZone
            key={z.routine.id}
            routine={z.routine}
            nowMs={nowMs}
            origin={z.origin}
            cols={z.cols}
            onSelect={onSelectAgent}
          />
        ))}

        <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={30} blur={2.2} far={4} />

        <OrbitControls
          enablePan={false}
          minDistance={6}
          maxDistance={24}
          minPolarAngle={0.3}
          maxPolarAngle={1.25}
          target={[0, 0.4, 0]}
        />
      </Canvas>
    </div>
  )
}
