import { useState, useEffect } from 'react'
import { Mail, Send, Globe, Network } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Contact({ isAdmin }) {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    fetchContact()
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

  if (loading) return <div className="section">Загрузка...</div>
  
  const hasContactData = contact && (contact.email || contact.telegram || contact.github || contact.linkedin)

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
      ) : hasContactData ? (
        <div className="contact-content">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="contact-link">
              <Mail size={18} />
              {contact.email}
            </a>
          )}
          {contact.telegram && (
            <a href={`https://t.me/${contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Send size={18} />
              Telegram: {contact.telegram.replace('@', '')}
            </a>
          )}
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Globe size={18} />
              GitHub
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Network size={18} />
              LinkedIn
            </a>
          )}
        </div>
      ) : (
        <p className="placeholder-text">Нет информации для отображения</p>
      )}
    </section>
  )
}
