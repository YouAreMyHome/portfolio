import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import { Mail, Github, Linkedin, MapPin, Phone } from 'lucide-react'
import { personalInfo } from '../../data/portfolio'

export default function ContactPanel() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useTranslation()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: personalInfo.email,
        },
        import.meta.env.VITE_EMAILJS_USER_ID
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setErrorMsg(t('panel.contact_error'))
    }
  }

  return (
    <div className="panel-content">
      <h2>{t('panel.contact')}</h2>
      <p className="panel-description">{t('panel.contact_desc')}</p>

      {/* Contact form */}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form-group">
          <label htmlFor="contact-name">{t('panel.contact_name')}</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyen Van A"
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-email">{t('panel.contact_email')}</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="hello@example.com"
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-message">{t('panel.contact_message')}</label>
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={t('panel.contact_placeholder')}
            rows={4}
            required
            disabled={status === 'sending'}
          />
        </div>

        {status === 'success' && (
          <div className="contact-feedback contact-success">{t('panel.contact_success')}</div>
        )}
        {status === 'error' && (
          <div className="contact-feedback contact-error">✗ {errorMsg}</div>
        )}

        <button
          type="submit"
          className="contact-send-btn"
          disabled={status === 'sending' || !form.name || !form.email || !form.message}
        >
          {status === 'sending' ? (
            <>
              <span className="contact-spinner" aria-hidden="true" /> {t('panel.contact_sending')}
            </>
          ) : (
            <>
              <Mail size={16} /> {t('panel.contact_send')}
            </>
          )}
        </button>
      </form>

      <div className="contact-divider">{t('panel.contact_or')}</div>

      <div className="contact-links">
        <a href={`mailto:${personalInfo.email}`} className="contact-item">
          <span className="contact-icon">
            <Mail size={20} />
          </span>
          <span>{personalInfo.email}</span>
        </a>
        <a href={`tel:${personalInfo.phone}`} className="contact-item">
          <span className="contact-icon">
            <Phone size={20} />
          </span>
          <span>{personalInfo.phone}</span>
        </a>
        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">
            <Github size={20} />
          </span>
          <span>GitHub</span>
        </a>
        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">
            <Linkedin size={20} />
          </span>
          <span>LinkedIn</span>
        </a>
        <div className="contact-item location">
          <span className="contact-icon">
            <MapPin size={20} />
          </span>
          <span>{personalInfo.location}</span>
        </div>
      </div>
    </div>
  )
}

