import React from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * FloorDetails - Các chi tiết phụ kiện sàn nhà chân thực & tinh xảo
 * - Đôi dép bông đi trong nhà êm ái
 * - Tay cầm chơi game thế hệ mới DualSense (Analog sticks, D-pad, LED)
 * - Cuốn tạp chí thiết kế mở trang đôi
 * - Balo vải canvas có ngăn khóa kéo
 * - Ván trượt Skateboard gỗ phong đậm chất Streetwear / Developer
 */
function FloorDetails() {
  return (
    <group>
      {/* ── 1. Cáp bện chống rối từ bàn làm việc (Braided Cables) ── */}
      <group position={[-2.1, 0.015, -1.6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.25]} receiveShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.75, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0, 0.08]} rotation={[-Math.PI / 2, 0, -0.15]} receiveShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.55, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 2. Cuốn tạp chí thiết kế mở đôi trên thảm (Open Magazine) ── */}
      <group position={[0.65, 0.054, 0.28]} rotation={[0, 0.35, 0]}>
        {/* Trang bên trái hơi cong nhẹ */}
        <group position={[-0.11, 0.004, 0]} rotation={[0, 0, 0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.006, 0.28]} />
            <meshStandardMaterial color="#faf8f5" roughness={0.7} />
          </mesh>
          {/* Layout ảnh trên trang trái */}
          <mesh position={[0, 0.004, -0.04]}>
            <planeGeometry args={[0.16, 0.14]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#2d3748" roughness={0.4} />
          </mesh>
          {/* Các dòng text tượng trưng */}
          {[-0.04, 0.02, 0.08].map((tz, ti) => (
            <mesh key={ti} position={[0, 0.004, 0.05 + tz * 0.5]}>
              <planeGeometry args={[0.15, 0.01]} rotation={[-Math.PI / 2, 0, 0]} />
              <meshBasicMaterial color="#a0aec0" />
            </mesh>
          ))}
        </group>

        {/* Trang bên phải */}
        <group position={[0.11, 0.004, 0]} rotation={[0, 0, -0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.006, 0.28]} />
            <meshStandardMaterial color="#faf8f5" roughness={0.7} />
          </mesh>
          {/* Layout ảnh nghệ thuật trang phải */}
          <mesh position={[0, 0.004, 0.02]}>
            <planeGeometry args={[0.16, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#dd6b20" roughness={0.5} />
          </mesh>
        </group>

        {/* Gáy tạp chí ở giữa */}
        <mesh position={[0, 0.003, 0]} castShadow>
          <boxGeometry args={[0.018, 0.008, 0.282]} />
          <meshStandardMaterial color="#1a202c" roughness={0.6} />
        </mesh>
      </group>

      {/* ── 3. Tay cầm chơi game công thái học thế hệ mới (Next-Gen Game Controller) ── */}
      <group position={[0.15, 0.062, 0.92]} rotation={[0, -0.4, 0]}>
        {/* Thân chính bo cong (Main Shell) */}
        <RoundedBox args={[0.14, 0.03, 0.09]} radius={0.012} smoothness={4} castShadow>
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
        </RoundedBox>

        {/* 2 tay nắm vát công thái học (Grip Handles) */}
        {[-0.055, 0.055].map((gx, gi) => (
          <mesh key={gi} position={[gx, -0.004, 0.03]} rotation={[0.2, 0, gi === 0 ? 0.25 : -0.25]} castShadow>
            <cylinderGeometry args={[0.016, 0.02, 0.06, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        ))}

        {/* Bàn di cảm ứng trung tâm (Touchpad) */}
        <RoundedBox args={[0.045, 0.004, 0.03]} radius={0.002} smoothness={4} position={[0, 0.016, -0.01]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>

        {/* Dải LED phát quang xanh quanh touchpad */}
        <mesh position={[0, 0.017, -0.026]}>
          <boxGeometry args={[0.04, 0.002, 0.003]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Cụm phím D-Pad chữ thập bên trái */}
        <group position={[-0.038, 0.016, 0.005]}>
          <mesh>
            <boxGeometry args={[0.018, 0.006, 0.006]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.006, 0.006, 0.018]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
        </group>

        {/* 4 nút bấm tròn bên phải (ABXY / Circle, Cross, Square, Triangle) */}
        <group position={[0.038, 0.016, 0.005]}>
          {[
            [-0.007, 0],
            [0.007, 0],
            [0, -0.007],
            [0, 0.007],
          ].map(([bx, bz], bi) => (
            <mesh key={bi} position={[bx, 0, bz]}>
              <cylinderGeometry args={[0.0035, 0.0035, 0.006, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* 2 cần xoay Analog Thumbsticks (L3 / R3) */}
        {[-0.022, 0.022].map((sx, si) => (
          <group key={si} position={[sx, 0.018, 0.022]}>
            <mesh position={[0, 0.004, 0]}>
              <cylinderGeometry args={[0.009, 0.007, 0.008, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.008, 0]}>
              <sphereGeometry args={[0.008, 10, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Phím vai Trigger L1/R1, L2/R2 */}
        {[-0.045, 0.045].map((tx, ti) => (
          <mesh key={ti} position={[tx, 0.004, -0.042]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.024, 0.012, 0.014]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── 4. Đôi dép bông mềm mại bên cạnh giường (Cozy Slippers) ── */}
      <group position={[-2.3, 0.018, 2.7]}>
        {[
          { x: -0.06, rot: 0.18 },
          { x: 0.06, rot: 0.32 },
        ].map((s, idx) => (
          <group key={idx} position={[s.x, 0, 0]} rotation={[0, s.rot, 0]}>
            {/* Đế dép cao su chống trượt */}
            <RoundedBox args={[0.09, 0.014, 0.22]} radius={0.018} smoothness={4} castShadow>
              <meshStandardMaterial color="#d4c8b8" roughness={0.8} />
            </RoundedBox>
            {/* Lớp lót lông cừu bên trong */}
            <mesh position={[0, 0.008, 0]}>
              <planeGeometry args={[0.08, 0.2]} rotation={[-Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#f7f5f0" roughness={0.95} />
            </mesh>
            {/* Quai vòm bọc lông mềm phía trên (Fleece Upper) */}
            <mesh position={[0, 0.032, -0.03]} rotation={[0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.048, 0.052, 0.12, 14, 1, false, 0, Math.PI]} rotation={[0, 0, -Math.PI / 2]} />
              <meshStandardMaterial color="#e5d0be" roughness={0.95} side={2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 5. Balo Canvas cá nhân gần bàn làm việc (Canvas Backpack) ── */}
      <group position={[-3.25, 0, -1.85]} rotation={[0, 0.45, 0]}>
        {/* Thân balo vải canvas dày dặn */}
        <RoundedBox args={[0.26, 0.36, 0.18]} radius={0.035} smoothness={4} position={[0, 0.18, 0]} castShadow>
          <meshStandardMaterial color="#2c3e35" roughness={0.85} />
        </RoundedBox>

        {/* Ngăn phụ khóa kéo phía trước */}
        <RoundedBox args={[0.22, 0.16, 0.06]} radius={0.02} smoothness={4} position={[0, 0.12, 0.11]} castShadow>
          <meshStandardMaterial color="#384f44" roughness={0.85} />
        </RoundedBox>
        {/* Khóa kéo đồng */}
        <mesh position={[0, 0.19, 0.14]}>
          <boxGeometry args={[0.18, 0.005, 0.004]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Quai xách đỉnh balo */}
        <mesh position={[0, 0.375, 0]} rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.035, 0.008, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#1a2620" roughness={0.9} />
        </mesh>

        {/* Hai dây đeo lưng phía sau có khóa cài */}
        {[-0.08, 0.08].map((sx, si) => (
          <mesh key={si} position={[sx, 0.18, -0.095]} castShadow>
            <boxGeometry args={[0.034, 0.28, 0.015]} />
            <meshStandardMaterial color="#1a2620" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ── 6. Ván trượt Skateboard gỗ phong đặt trên sàn (Maple Skateboard on Floor) ── */}
      <group position={[2.05, 0, 0.35]} rotation={[0, 0.35, 0]}>
        {/* Mặt ván gỗ phong bo cong (Nose & Tail Kick) */}
        <RoundedBox args={[0.18, 0.014, 0.72]} radius={0.01} smoothness={4} position={[0, 0.046, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#d4a373" roughness={0.6} />
        </RoundedBox>

        {/* Lớp giấy ráp bám màu đen nhám mặt trên (Grip Tape) */}
        <mesh position={[0, 0.054, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.16, 0.68]} />
          <meshStandardMaterial color="#18181b" roughness={0.98} />
        </mesh>

        {/* Hai trục xe kim loại hợp kim (Trucks) */}
        {[-0.2, 0.2].map((tz, ti) => (
          <group key={ti} position={[0, 0.022, tz]}>
            {/* Đế trục gắn vào ván */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.05, 0.012, 0.04]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Trục ngang */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* 2 bánh xe Urethane vàng cam đặt sát mặt sàn */}
            {[-0.075, 0.075].map((wx, wi) => (
              <mesh key={wi} position={[wx, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
                <meshStandardMaterial color="#f97316" roughness={0.3} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}

export default FloorDetails
