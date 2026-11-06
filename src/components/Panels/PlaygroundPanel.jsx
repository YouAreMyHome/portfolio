import { useTranslation } from 'react-i18next'
import { Dice5, Music, Droplets, Timer } from 'lucide-react'

export default function PlaygroundPanel() {
  const { t } = useTranslation()
  const games = [
    { icon: <Dice5 size={24} />, name: 'Dice Roller', desc: 'Roll virtual dice' },
    { icon: <Music size={24} />, name: 'Music Visualizer', desc: 'Audio reactive visuals' },
    { icon: <Droplets size={24} />, name: 'Color Palette', desc: 'Generate color schemes' },
    { icon: <Timer size={24} />, name: 'Pomodoro Timer', desc: 'Focus timer' },
  ]

  return (
    <div className="panel-content">
      <h2>{t('panel.playground')}</h2>
      <p className="panel-description">{t('panel.playground_desc')}</p>
      <div className="playground-grid">
        {games.map((game) => (
          <div key={game.name} className="playground-item">
            <span className="playground-icon">{game.icon}</span>
            <div className="playground-info">
              <span className="playground-name">{game.name}</span>
              <span className="playground-desc">{game.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

