import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

      if (error) throw error
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

  if (loading) return <div className="section">Loading...</div>

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
          <a href={`mailto:${contact?.email || defaultContact.email}`} className="contact-link">
            {contact?.email || defaultContact.email}
          </a>
          <a href={`https://t.me/${(contact?.telegram || defaultContact.telegram).replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
            Telegram: {(contact?.telegram || defaultContact.telegram).replace('@', '')}
          </a>
          <a href={contact?.github || defaultContact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
            GitHub: {contact?.github || defaultContact.github}
          </a>
          <a href={contact?.linkedin || defaultContact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
            LinkedIn
          </a>
        </div>
      )}
    </section>
  )
}
