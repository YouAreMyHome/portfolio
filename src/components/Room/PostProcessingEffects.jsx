import React from 'react'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  N8AO,
  Pixelation,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import useStore from '../../store/useStore'

/**
 * PostProcessingEffects - Pipeline hậu kỳ đồ họa cao cấp
 * - N8AO: Tạo bóng đổ tiếp xúc (contact shadows) mềm mại giữa các khe kẽ đồ vật 3D
 * - Bloom: Phát sáng nịnh mắt cho đèn LED, màn hình máy tính, TV và trăng sao
 * - Vignette: Tạo chiều sâu góc nhìn
 * - ToneMapping: Chuẩn hóa màu sắc rực rỡ, sắc sảo
 * - Pixelation: Chế độ giả lập Retro Pixel Art khi người dùng bật
 */
export default function PostProcessingEffects({ graphics = {} }) {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const retroPixelMode = useStore((state) => state.retroPixelMode)

  const {
    composerMultisampling = 0,
    bloomIntensity = 0.35,
  } = graphics

  // Tính toán cường độ bloom theo preset
  const calculatedBloom = isNightMode || lightingPreset === 'night'
    ? 0.45
    : lightingPreset === 'sunset'
    ? 0.35
    : bloomIntensity

  return (
    <EffectComposer multisampling={composerMultisampling} disableNormalPass={false}>
      {/* 1. N8AO: Ambient Occlusion tính toán halfRes + bilateral filter (nhanh gấp 4 lần, chất lượng sắc sảo) */}
      <N8AO
        aoRadius={0.35}
        distanceFalloff={2.0}
        intensity={0.75}
        color="#16121a"
        halfRes={true}
        quality="medium"
      />

      {/* 2. Bloom: Chỉ phát sáng các nguồn sáng thực tế, không gây chói bề mặt tường */}
      <Bloom
        intensity={isNightMode || lightingPreset === 'night' ? 0.45 : 0.22}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.45}
      />

      {/* 3. ToneMapping: Tăng độ tương phản màu sắc sống động */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      {/* 4. Vignette: Viền tối điện ảnh nhẹ nhàng, không bóp nghẹt ánh sáng ban đêm */}
      <Vignette
        offset={0.3}
        darkness={isNightMode ? 0.24 : 0.18}
      />

      {/* 5. Tùy chọn Retro Pixelation: Biến đổi căn phòng thành phong cách game 16-bit */}
      {retroPixelMode && (
        <Pixelation granularity={5} />
      )}
    </EffectComposer>
  )
}
