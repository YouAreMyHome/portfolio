import { memo } from 'react'
import * as THREE from 'three'
import InteractiveObject from './InteractiveObject'
import useStore from '../../store/useStore'

/**
 * PlanBoard - Kanban Board tương tác (Trello-style)
 * Hoàn toàn tối ưu flyweight (Geometries & Materials khởi tạo 1 lần trong VRAM)
 */

// Shared Geometries
const cardGeo = new THREE.BoxGeometry(0.26, 0.09, 0.008)
const stripeGeo = new THREE.BoxGeometry(0.02, 0.09, 0.002)
const columnBgGeo = new THREE.BoxGeometry(0.3, 0.5, 0.006)
const columnHeaderGeo = new THREE.BoxGeometry(0.3, 0.06, 0.006)
const boardFrameGeo = new THREE.BoxGeometry(1.15, 0.9, 0.04)
const boardInnerGeo = new THREE.BoxGeometry(1.05, 0.8, 0.01)
const pinGeo = new THREE.SphereGeometry(0.018, 8, 8)

// Shared Materials Cache
const _matCache = new Map()
function getBasicMat(color, roughness = 0.8, metalness = 0.0) {
  const key = `${color}_${roughness}_${metalness}`
  let mat = _matCache.get(key)
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    _matCache.set(key, mat)
  }
  return mat
}

const columnBgMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.95 })
const boardFrameMat = new THREE.MeshStandardMaterial({ color: '#5c3d2e', roughness: 0.8 })
const boardInnerMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.9 })

const PIN_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']
const PIN_MATERIALS = PIN_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, metalness: 0.3, roughness: 0.5 }))

// Kanban data
const KANBAN_DATA = {
  todo: { color: '#ef4444', cardColors: ['#fef3c7', '#d1fae5', '#fce7f3'] },
  inProgress: { color: '#f59e0b', cardColors: ['#dbeafe', '#e0e7ff', '#fef3c7'] },
  done: { color: '#22c55e', cardColors: ['#dbeafe', '#d1fae5', '#fce7f3'] }
}

// Single Task Card - flyweight
const TaskCard = memo(function TaskCard({ color, columnColor, position }) {
  const cardMat = getBasicMat(color, 0.9)
  const stripeMat = getBasicMat(columnColor, 0.7)

  return (
    <group position={position}>
      <mesh geometry={cardGeo} material={cardMat} />
      <mesh position={[-0.12, 0, 0.005]} geometry={stripeGeo} material={stripeMat} />
    </group>
  )
})

// Column component - flyweight
const KanbanColumn = memo(function KanbanColumn({ data, position }) {
  const headerMat = getBasicMat(data.color, 0.7)

  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]} geometry={columnBgGeo} material={columnBgMat} />
      <mesh position={[0, 0.22, 0.004]} geometry={columnHeaderGeo} material={headerMat} />
      {data.cardColors.map((cardColor, idx) => (
        <TaskCard
          key={idx}
          color={cardColor}
          columnColor={data.color}
          position={[0, 0.1 - idx * 0.12, 0.01]}
        />
      ))}
    </group>
  )
})

function PlanBoard() {
  const toggleKanbanBoard = useStore((state) => state.toggleKanbanBoard)
  
  return (
    <InteractiveObject name="planboard" onClick={toggleKanbanBoard}>
      <group position={[-3.88, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Main board frame */}
        <mesh receiveShadow geometry={boardFrameGeo} material={boardFrameMat} />
        
        {/* Inner board surface */}
        <mesh position={[0, 0, 0.021]} geometry={boardInnerGeo} material={boardInnerMat} />
        
        {/* Kanban Columns */}
        <group position={[0, 0, 0.03]}>
          <KanbanColumn data={KANBAN_DATA.todo} position={[-0.35, 0, 0]} />
          <KanbanColumn data={KANBAN_DATA.inProgress} position={[0, 0, 0]} />
          <KanbanColumn data={KANBAN_DATA.done} position={[0.35, 0, 0]} />
        </group>
        
        {/* Corner pins */}
        {[[-0.48, 0.35], [0.48, 0.35], [-0.48, -0.35], [0.48, -0.35]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.05]} geometry={pinGeo} material={PIN_MATERIALS[i]} />
        ))}
      </group>
    </InteractiveObject>
  )
}

export default memo(PlanBoard)
