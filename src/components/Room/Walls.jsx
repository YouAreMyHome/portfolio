import { memo } from 'react'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * Walls - Tường phòng với chi tiết crown molding và baseboard
 * Tối ưu hóa:
 * - Flyweight static geometries & materials
 * - matrixAutoUpdate={false} triệt tiêu tính toán ma trận khung hình
 */
const backWallGeo = new THREE.BoxGeometry(8, 3, 0.1)
const leftWallGeo = new THREE.BoxGeometry(0.1, 3, 8)
const crownBackGeo = new THREE.BoxGeometry(8, 0.08, 0.08)
const crownLeftGeo = new THREE.BoxGeometry(0.08, 0.08, 8)
const baseboardBackGeo = new THREE.BoxGeometry(8, 0.15, 0.08)
const baseboardLeftGeo = new THREE.BoxGeometry(0.08, 0.15, 8)

const backWallMat = new THREE.MeshStandardMaterial({ color: COLORS.wall, roughness: 0.88, metalness: 0.04 })
const leftWallMat = new THREE.MeshStandardMaterial({ color: COLORS.wallDark, roughness: 0.88, metalness: 0.04 })
const crownMat = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.5, metalness: 0.1 })
const baseboardMat = new THREE.MeshStandardMaterial({ color: '#6B5344', roughness: 0.65, metalness: 0.08 })

function Walls() {
  return (
    <group>
      {/* Back Wall (Z = -4) */}
      <mesh position={[0, 1.5, -4]} receiveShadow geometry={backWallGeo} material={backWallMat} />
      
      {/* Left Wall (X = -4) */}
      <mesh position={[-4, 1.5, 0]} receiveShadow geometry={leftWallGeo} material={leftWallMat} />
      
      {/* Crown molding - Back */}
      <mesh position={[0, 2.95, -3.93]} geometry={crownBackGeo} material={crownMat} />
      
      {/* Crown molding - Left */}
      <mesh position={[-3.93, 2.95, 0]} geometry={crownLeftGeo} material={crownMat} />
      
      {/* Baseboard - Back */}
      <mesh position={[0, 0.08, -3.93]} geometry={baseboardBackGeo} material={baseboardMat} />
      
      {/* Baseboard - Left */}
      <mesh position={[-3.93, 0.08, 0]} geometry={baseboardLeftGeo} material={baseboardMat} />
    </group>
  )
}

export default memo(Walls)
