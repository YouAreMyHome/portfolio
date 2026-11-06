import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { RECYCLED_PROJECTS } from '../osConfig'

export default function RecycleApp() {
  const { i18n } = useTranslation()
  const lf = (vi, en) => (i18n.language === 'en' && en ? en : vi)

  return (
    <>
      <div className="window-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="window-content">
        <div className="recycle-content">
          <p style={{ padding: '10px', color: '#666', fontSize: 12 }}>
            {lf(
              'Những dự án không may mắn... nhưng đã cho mình nhiều bài học!',
              "These projects didn't make it... but we learned from them!"
            )}
          </p>
          {RECYCLED_PROJECTS.map((item) => (
            <div key={item.id} className="recycle-item">
              <span className="recycle-icon">
                <FileText size={20} />
              </span>
              <div className="recycle-info">
                <div className="filename">{item.name}</div>
                <div className="reason">{lf(item.reason, item.reasonEn)}</div>
                <div className="date">
                  {lf('Xóa:', 'Deleted:')} {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{RECYCLED_PROJECTS.length} items</span>
        <span className="statusbar-item">{lf('Ít nhất mình đã thử!', 'At least we tried!')}</span>
      </div>
    </>
  )
}

