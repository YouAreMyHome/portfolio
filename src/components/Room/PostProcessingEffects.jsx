import React from 'react'
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  Pixelation,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import useStore from '../../store/useStore'

/**
 * PostProcessingEffects - Pipeline hậu kỳ đồ họa cao cấp
 * - Bloom: Phát sáng chọn lọc cho đèn LED, màn hình máy tính, TV và trăng sao (threshold >= 1.05)
 * - Vignette: Tạo chiều sâu góc nhìn
 * - ToneMapping: Chuẩn hóa màu sắc rực rỡ, sắc sảo (ACES Filmic)
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

  const isNight = isNightMode || lightingPreset === 'night'

  return (
    <EffectComposer multisampling={composerMultisampling}>
      {/* 1. Selective Bloom: Chỉ phát quang các vật thể phát sáng (emissive/LED), triệt tiêu chớp sáng khi xoay camera */}
      <Bloom
        intensity={(isNight ? 0.45 : lightingPreset === 'sunset' ? 0.35 : 0.22) * (bloomIntensity / 0.35)}
        luminanceThreshold={1.05}
        luminanceSmoothing={0.15}
        mipmapBlur
        radius={0.4}
      />

      {/* 2. ToneMapping: Tăng độ tương phản màu sắc sống động */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

      {/* 3. Vignette: Viền tối điện ảnh nhẹ nhàng, không bóp nghẹt ánh sáng ban đêm */}
      <Vignette
        offset={0.3}
        darkness={isNight ? 0.18 : 0.15}
      />

      {/* 4. Tùy chọn Retro Pixelation: Biến đổi căn phòng thành phong cách game 16-bit */}
      {retroPixelMode && (
        <Pixelation granularity={5} />
      )}
    </EffectComposer>
  )
}
