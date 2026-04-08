import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function About({ isAdmin }) {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchAbout()
  }, [])

  async function fetchAbout() {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single()

      if (error) throw error
      setAbout(data)
      setFormData(data || {})
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (about?.id) {
        const { error } = await supabase
          .from('about')
          .update(formData)
          .eq('id', about.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('about')
          .insert([formData])
          .select()
          .single()

        if (error) throw error
        setAbout(data)
      }
      setEditing(false)
      fetchAbout()
    } catch (error) {
      console.error('Error saving about:', error)
      alert('Error saving data')
    }
  }

  if (loading) return <div className="section">Loading...</div>

  return (
    <section id="about" className="section">
      <h2 className="section-title">Обо мне</h2>
      
      {isAdmin && !editing && (
        <button onClick={() => setEditing(true)} className="admin-btn">
          Редактировать
        </button>
      )}

      {editing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Заголовок:</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="6"
            />
          </div>
          <div className="form-group">
            <label>Навыки Salesforce (через запятую):</label>
            <input
              type="text"
              value={formData.salesforce_skills || ''}
              onChange={(e) => setFormData({...formData, salesforce_skills: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Навыки Golang (через запятую):</label>
            <input
              type="text"
              value={formData.golang_skills || ''}
              onChange={(e) => setFormData({...formData, golang_skills: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Отмена</button>
          </div>
        </div>
      ) : (
        <div className="about-content">
          <h3 className="name">{about?.name || 'Ваше Имя'}</h3>
          <p className="title">{about?.title || 'Software Developer'}</p>
          <p className="description">{about?.description || 'Описание...'}</p>
          
          <div className="skills-section">
            <div className="skills-block salesforce">
              <h4>Salesforce</h4>
              <div className="skills-list">
                {(about?.salesforce_skills || '').split(',').filter(s => s.trim()).map((skill, i) => (
                  <span key={i} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            </div>
            
            <div className="skills-block golang">
              <h4>Golang</h4>
              <div className="skills-list">
                {(about?.golang_skills || '').split(',').filter(s => s.trim()).map((skill, i) => (
                  <span key={i} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
