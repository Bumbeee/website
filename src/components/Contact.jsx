import { useState, useEffect } from 'react'
import { Mail, FileText, Download, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Contact({ isAdmin }) {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [resumeModalOpen, setResumeModalOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)
  
  useEffect(() => {
    fetchContact()
    
    // Слушаем событие открытия модального окна резюме
    const handleOpenResumeModalEvent = () => {
      openResumeModal()
    }
    
    window.addEventListener('open-resume-modal', handleOpenResumeModalEvent)
    
    return () => {
      window.removeEventListener('open-resume-modal', handleOpenResumeModalEvent)
    }
  }, [])
  
  async function fetchContact() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setContact(data)
      setFormData(data || {})
    } catch (error) {
      console.error('Error fetching contact:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!isSupabaseConfigured) {
      alert('Supabase не настроен. Проверьте переменные окружения.')
      return
    }
    
    try {
      if (contact?.id) {
        const { error } = await supabase
          .from('contact')
          .update(formData)
          .eq('id', contact.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('contact')
          .insert([formData])
          .select()
          .single()

        if (error) throw error
        setContact(data)
      }
      setEditing(false)
      fetchContact()
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Ошибка при сохранении: ' + error.message)
    }
  }

  function handleContactClick() {
    if (contact?.email) {
      window.location.href = `mailto:${contact.email}`
    }
  }

  function openResumeModal() {
    setResumeModalOpen(true)
  }

  function closeResumeModal() {
    setResumeModalOpen(false)
    setSelectedResume(null)
  }

  function handleViewResume(type) {
    const resumeUrl = type === 'sf' ? contact?.sf_resume : contact?.go_resume
    if (resumeUrl) {
      setSelectedResume({ type, url: resumeUrl, action: 'view' })
    }
  }

  function handleDownloadResume(type) {
    const resumeUrl = type === 'sf' ? contact?.sf_resume : contact?.go_resume
    if (resumeUrl) {
      // Создаем ссылку с атрибутом download для скачивания
      const link = document.createElement('a')
      link.href = resumeUrl
      link.download = ''
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) return <div className="section">Загрузка...</div>
  
  return (
    <section id="contact" className="section contact-content">
      <h2 className="section-title" data-section="4">Контакты</h2>
      <p className="contact-text">
        Хотя я в настоящее время не ищу новых возможностей, мой почтовый ящик всегда открыт. 
        Если у вас есть вопрос или просто хотите поздороваться, я сделаю все возможное, чтобы ответить!
      </p>

      {isAdmin && !editing && (
        <button onClick={() => setEditing(true)} className="admin-btn">
          Редактировать
        </button>
      )}

      {editing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Telegram:</label>
            <input
              type="text"
              value={formData.telegram || ''}
              onChange={(e) => setFormData({...formData, telegram: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>GitHub:</label>
            <input
              type="text"
              value={formData.github || ''}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn:</label>
            <input
              type="text"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>HeadHunter:</label>
            <input
              type="text"
              value={formData.hh || ''}
              onChange={(e) => setFormData({...formData, hh: e.target.value})}
              placeholder="https://hh.ru/resume/..."
            />
          </div>
          <div className="form-group">
            <label>Salesforce Resume (URL):</label>
            <input
              type="text"
              value={formData.sf_resume || ''}
              onChange={(e) => setFormData({...formData, sf_resume: e.target.value})}
              placeholder="/resumes/salesforce_resume.pdf"
            />
          </div>
          <div className="form-group">
            <label>Golang Resume (URL):</label>
            <input
              type="text"
              value={formData.go_resume || ''}
              onChange={(e) => setFormData({...formData, go_resume: e.target.value})}
              placeholder="/resumes/golang_resume.pdf"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Отмена</button>
          </div>
        </div>
      ) : (
        <div className="contact-content-wrapper">
          <button onClick={handleContactClick} className="contact-button">
            <Mail size={18} />
            Связаться
          </button>
          <button onClick={openResumeModal} className="contact-button resume-button">
            <FileText size={18} />
            Резюме
          </button>
        </div>
      )}

      {/* Resume Modal */}
      {resumeModalOpen && (
        <div className="modal-overlay" onClick={closeResumeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeResumeModal}>
              <X size={24} />
            </button>
            <h3 className="modal-title">Выберите резюме</h3>
            <div className="resume-options">
              <div className="resume-option">
                <h4>Salesforce Резюме</h4>
                <div className="resume-actions">
                  <button 
                    onClick={() => handleViewResume('sf')} 
                    className="resume-action-btn view-btn"
                    disabled={!contact?.sf_resume}
                  >
                    <FileText size={16} />
                    Просмотреть
                  </button>
                  <button 
                    onClick={() => handleDownloadResume('sf')} 
                    className="resume-action-btn download-btn"
                    disabled={!contact?.sf_resume}
                  >
                    <Download size={16} />
                    Скачать
                  </button>
                </div>
                {!contact?.sf_resume && <p className="no-resume">Резюме не загружено</p>}
              </div>
              <div className="resume-option">
                <h4>Golang Резюме</h4>
                <div className="resume-actions">
                  <button 
                    onClick={() => handleViewResume('go')} 
                    className="resume-action-btn view-btn"
                    disabled={!contact?.go_resume}
                  >
                    <FileText size={16} />
                    Просмотреть
                  </button>
                  <button 
                    onClick={() => handleDownloadResume('go')} 
                    className="resume-action-btn download-btn"
                    disabled={!contact?.go_resume}
                  >
                    <Download size={16} />
                    Скачать
                  </button>
                </div>
                {!contact?.go_resume && <p className="no-resume">Резюме не загружено</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Resume Modal */}
      {selectedResume && selectedResume.action === 'view' && (
        <div className="modal-overlay" onClick={closeResumeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeResumeModal}>
              <X size={24} />
            </button>
            <h3 className="modal-title">
              {selectedResume.type === 'sf' ? 'Salesforce Резюме' : 'Golang Резюме'}
            </h3>
            <div className="resume-viewer">
              <iframe 
                src={selectedResume.url} 
                title="Resume Preview"
                className="resume-iframe"
              />
            </div>
            <div className="resume-viewer-actions">
              <a 
                href={selectedResume.url} 
                download 
                target="_blank"
                rel="noopener noreferrer"
                className="download-link-btn"
              >
                <Download size={16} />
                Скачать PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
