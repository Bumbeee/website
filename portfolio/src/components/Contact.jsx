import { useState, useEffect } from 'react'
import { Mail, Send, Globe as GithubIcon, Link as LinkedinIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

const defaultContact = {
  email: '',
  telegram: '',
  github: '',
  linkedin: ''
}

export default function Contact({ isAdmin }) {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    fetchContact()
  }, [])
  
  async function fetchContact() {
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
      alert('Error saving data')
    }
  }

  if (loading) return <div className="section">Загрузка...</div>

  const displayContact = contact || Object.keys(defaultContact).length > 0 ? { ...defaultContact, ...contact } : null

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Контакты</h2>

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
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Отмена</button>
          </div>
        </div>
      ) : (
        <div className="contact-content">
          {displayContact && (displayContact.email || displayContact.telegram || displayContact.github || displayContact.linkedin) ? (
            <>
              {displayContact.email && (
                <a href={`mailto:${displayContact.email}`} className="contact-link">
                  <Mail size={18} />
                  {displayContact.email}
                </a>
              )}
              {displayContact.telegram && (
                <a href={`https://t.me/${displayContact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <Send size={18} />
                  Telegram: {displayContact.telegram.replace('@', '')}
                </a>
              )}
              {displayContact.github && (
                <a href={displayContact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <GithubIcon size={18} />
                  GitHub
                </a>
              )}
              {displayContact.linkedin && (
                <a href={displayContact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <LinkedinIcon size={18} />
                  LinkedIn
                </a>
              )}
            </>
          ) : (
            <p className="placeholder-text">Нет информации для отображения</p>
          )}
        </div>
      )}
    </section>
  )
}
