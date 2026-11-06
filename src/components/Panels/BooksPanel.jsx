import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Book, Sparkles } from 'lucide-react'
import { books } from '../../data/books'

export default function BooksPanel() {
  const [selectedBook, setSelectedBook] = useState(null)
  const { t, i18n } = useTranslation()
  const lf = (vi, en) => (i18n.language === 'en' && en ? en : vi)

  const handleBookClick = (book) => {
    if (book.isRickRoll) {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
    } else {
      setSelectedBook(book)
    }
  }

  const handleBack = () => {
    setSelectedBook(null)
  }

  if (selectedBook) {
    const bookContent = lf(selectedBook.content, selectedBook.contentEn)
    return (
      <div className="panel-content">
        <button className="book-back-btn" onClick={handleBack}>
          {t('panel.books_back')}
        </button>
        <div className="book-content-view">
          <div className="book-cover-large" style={{ background: selectedBook.color }}>
            <Book size={48} />
          </div>
          <h2>{selectedBook.title}</h2>
          <div className="book-pages">
            {bookContent.map((text, index) => (
              <div key={index} className="book-page">
                <span className="page-number">{t('panel.books_page', { n: index + 1 })}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-content">
      <h2>
        <BookOpen size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />{' '}
        {t('panel.books')}
      </h2>
      <p className="panel-description">{t('panel.books_desc')}</p>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card" onClick={() => handleBookClick(book)}>
            <div className="book-spine" style={{ background: book.color }}>
              <Book size={20} />
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <span className="book-type">
                <Sparkles size={14} /> {t('panel.books_chapters', { n: book.content.length })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

