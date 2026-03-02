import InteractiveObject from './InteractiveObject'
import useStore from '../../store/useStore'

/**
 * PlanBoard - Kanban Board tương tác (Trello-style)
 * 3 cột: TODO | IN PROGRESS | DONE
 * Click để mở overlay xem chi tiết
 * 
 * Thiết kế đơn giản với boxGeometry để tránh Z-fighting
 */

// Kanban data
const KANBAN_DATA = {
  todo: { color: '#ef4444', cardColors: ['#fef3c7', '#d1fae5', '#fce7f3'] },
  inProgress: { color: '#f59e0b', cardColors: ['#dbeafe', '#e0e7ff', '#fef3c7'] },
  done: { color: '#22c55e', cardColors: ['#dbeafe', '#d1fae5', '#fce7f3'] }
}

// Single Task Card - sử dụng box để tránh z-fighting
function TaskCard({ color, columnColor, position }) {
  return (
    <group position={position}>
      {/* Card body - 3D box */}
      <mesh castShadow>
        <boxGeometry args={[0.26, 0.09, 0.008]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Left stripe accent */}
      <mesh castShadow position={[-0.12, 0, 0.005]}>
        <boxGeometry args={[0.02, 0.09, 0.002]} />
        <meshStandardMaterial color={columnColor} />
      </mesh>
    </group>
  )
}

// Column component
function KanbanColumn({ data, position }) {
  return (
    <group position={position}>
      {/* Column background - 3D box */}
      <mesh castShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.006]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.95} />
      </mesh>
      
      {/* Column header - 3D box */}
      <mesh castShadow position={[0, 0.22, 0.004]}>
        <boxGeometry args={[0.3, 0.06, 0.006]} />
        <meshStandardMaterial color={data.color} />
      </mesh>
      
      {/* Task cards */}
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
}

function PlanBoard() {
  const toggleKanbanBoard = useStore((state) => state.toggleKanbanBoard)
  
  return (
    <InteractiveObject name="planboard" onClick={toggleKanbanBoard}>
      <group position={[-3.88, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Main board frame */}
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.9, 0.04]} />
          <meshStandardMaterial color="#5c3d2e" roughness={0.8} />
        </mesh>
        
        {/* Inner board surface */}
        <mesh castShadow position={[0, 0, 0.021]}>
          <boxGeometry args={[1.05, 0.8, 0.01]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        
        {/* Kanban Columns */}
        <group position={[0, 0, 0.03]}>
          <KanbanColumn data={KANBAN_DATA.todo} position={[-0.35, 0, 0]} />
          <KanbanColumn data={KANBAN_DATA.inProgress} position={[0, 0, 0]} />
          <KanbanColumn data={KANBAN_DATA.done} position={[0.35, 0, 0]} />
        </group>
        
        {/* Corner pins */}
        {[[-0.48, 0.35], [0.48, 0.35], [-0.48, -0.35], [0.48, -0.35]].map(([x, y], i) => (
          <mesh castShadow key={i} position={[x, y, 0.05]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial 
              color={['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'][i]} 
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        ))}
        
        {/* Soft ambient light */}
        <pointLight 
          position={[0, 0, 0.4]} 
          intensity={0.1} 
          distance={1.2} 
          color="#ffffff"
        />
      </group>
    </InteractiveObject>
  )
}

export default PlanBoard
