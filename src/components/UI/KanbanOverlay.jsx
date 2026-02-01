import { useState } from 'react'
import { X, Sparkles, Coffee, Bug, Rocket, Code, Gamepad2, Heart, CheckCircle, Clock, Target, GripVertical } from 'lucide-react'
import useStore from '../../store/useStore'
import './KanbanOverlay.css'

/**
 * KanbanOverlay - Hiển thị Kanban Board chi tiết
 * Popup overlay khi click vào PlanBoard trong room
 * Hỗ trợ drag & drop cards giữa các columns
 */

// Initial tasks data
const INITIAL_TASKS = [
  { id: 1, text: 'Learn Rust', subtext: 'Memory safety FTW', icon: 'Rocket', color: '#fef3c7', columnId: 'todo' },
  { id: 2, text: 'Touch grass', subtext: 'Outside? Is that a library?', icon: 'Sparkles', color: '#d1fae5', meme: true, columnId: 'todo' },
  { id: 3, text: 'Fix 99 bugs', subtext: 'Fixed 1, now 127 bugs', icon: 'Bug', color: '#fce7f3', meme: true, columnId: 'todo' },
  { id: 4, text: 'React / Next.js', subtext: 'Hooks everywhere!', icon: 'Code', color: '#dbeafe', columnId: 'inProgress' },
  { id: 5, text: 'Three.js / R3F', subtext: 'Making things go brr in 3D', icon: 'Gamepad2', color: '#e0e7ff', columnId: 'inProgress' },
  { id: 6, text: 'Coffee intake', subtext: 'Debugging fuel: 99%', icon: 'Coffee', color: '#fef3c7', meme: true, columnId: 'inProgress' },
  { id: 7, text: 'TypeScript', subtext: 'any? Never heard of it', icon: 'Code', color: '#dbeafe', columnId: 'done' },
  { id: 8, text: 'Node.js / Express', subtext: 'Backend wizardry', icon: 'Rocket', color: '#d1fae5', columnId: 'done' },
  { id: 9, text: 'Imposter syndrome', subtext: 'Still here, but we vibing', icon: 'Heart', color: '#fce7f3', meme: true, columnId: 'done' },
]

// Column definitions
const COLUMNS = {
  todo: {
    id: 'todo',
    title: 'TODO',
    icon: Target,
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  inProgress: {
    id: 'inProgress',
    title: 'IN PROGRESS',
    icon: Clock,
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  done: {
    id: 'done',
    title: 'COMPLETED',
    icon: CheckCircle,
    color: '#22c55e',
    bgColor: '#f0fdf4',
  }
}

// Icon mapping
const ICON_MAP = {
  Rocket,
  Sparkles,
  Bug,
  Code,
  Gamepad2,
  Coffee,
  Heart,
}

function TaskCard({ task, columnColor, onDragStart, onDragEnd, onTouchStart, onTouchMove, onTouchEnd, isDragging }) {
  const Icon = ICON_MAP[task.icon] || Code
  
  return (
    <div 
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      style={{ 
        backgroundColor: task.color,
        borderLeft: `4px solid ${columnColor}`
      }}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart(e, task)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="kanban-card-header">
        <GripVertical size={14} className="kanban-drag-handle" />
        <Icon size={18} className="kanban-card-icon" />
        <span className="kanban-card-title">{task.text}</span>
        {task.meme && <Sparkles size={14} className="kanban-meme-badge" />}
      </div>
      <p className="kanban-card-subtext">{task.subtext}</p>
    </div>
  )
}

function KanbanColumn({ column, tasks, onDragStart, onDragEnd, onDragOver, onDrop, onTouchStart, onTouchMove, onTouchEnd, dragOverColumn, draggingTask, columnRef }) {
  const Icon = column.icon
  const isDropTarget = dragOverColumn === column.id && draggingTask?.columnId !== column.id
  
  return (
    <div className="kanban-column" ref={columnRef} data-column-id={column.id}>
      <div 
        className="kanban-column-header"
        style={{ backgroundColor: column.color }}
      >
        <Icon size={18} />
        <span>{column.title}</span>
        <span className="kanban-count">{tasks.length}</span>
      </div>
      <div 
        className={`kanban-column-body ${isDropTarget ? 'drop-target' : ''}`}
        style={{ backgroundColor: column.bgColor }}
        onDragOver={(e) => onDragOver(e, column.id)}
        onDrop={(e) => onDrop(e, column.id)}
        data-column-id={column.id}
      >
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            columnColor={column.color}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            isDragging={draggingTask?.id === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div className="kanban-empty">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanOverlay() {
  const showKanbanBoard = useStore((state) => state.showKanbanBoard)
  const closeKanbanBoard = useStore((state) => state.closeKanbanBoard)
  
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [draggingTask, setDraggingTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  
  // Drag handlers (Desktop)
  const handleDragStart = (e, task) => {
    setDraggingTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id.toString())
  }
  
  const handleDragEnd = () => {
    setDraggingTask(null)
    setDragOverColumn(null)
  }
  
  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // Chỉ update state khi column thay đổi
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId)
    }
  }
  
  const handleDrop = (e, columnId) => {
    e.preventDefault()
    if (!draggingTask) return
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === draggingTask.id 
          ? { ...task, columnId } 
          : task
      )
    )
    
    setDraggingTask(null)
    setDragOverColumn(null)
  }
  
  // Touch handlers (Mobile) - Improved for better UX
  // Note: Using CSS touch-action: none instead of preventDefault to avoid passive listener warning
  const handleTouchStart = (e, task) => {
    setDraggingTask(task)
  }
  
  const handleTouchMove = (e) => {
    if (!draggingTask) return
    
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    const columnBody = element?.closest('[data-column-id]')
    
    if (columnBody) {
      const columnId = columnBody.dataset.columnId
      // Chỉ update state khi column thay đổi
      if (dragOverColumn !== columnId) {
        setDragOverColumn(columnId)
      }
    } else {
      // Clear drop target when not over a column
      if (dragOverColumn) {
        setDragOverColumn(null)
      }
    }
  }
  
  const handleTouchEnd = () => {
    if (draggingTask && dragOverColumn) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggingTask.id 
            ? { ...task, columnId: dragOverColumn } 
            : task
        )
      )
    }
    
    setDraggingTask(null)
    setDragOverColumn(null)
  }
  
  // Get tasks for each column
  const getColumnTasks = (columnId) => tasks.filter(task => task.columnId === columnId)
  
  if (!showKanbanBoard) return null
  
  return (
    <div className="kanban-overlay" onClick={closeKanbanBoard}>
      <div className="kanban-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="kanban-header">
          <div className="kanban-title">
            <span className="kanban-emoji">📋</span>
            <h2>My Skills Board</h2>
            <span className="kanban-subtitle">Drag cards to organize</span>
          </div>
          <button className="kanban-close" onClick={closeKanbanBoard}>
            <X size={24} />
          </button>
        </div>
        
        {/* Board */}
        <div className="kanban-board">
          {Object.values(COLUMNS).map(column => (
            <KanbanColumn 
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.id)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              dragOverColumn={dragOverColumn}
              draggingTask={draggingTask}
            />
          ))}
        </div>
        
        {/* Footer memes */}
        <div className="kanban-footer">
          <div className="kanban-sticker yellow">
            <Coffee size={14} />
            <span>Powered by caffeine</span>
          </div>
          <div className="kanban-sticker purple">
            <Bug size={14} />
            <span>It's not a bug, it's a feature</span>
          </div>
          <div className="kanban-sticker green">
            <Code size={14} />
            <span>Works on my machine™</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KanbanOverlay
