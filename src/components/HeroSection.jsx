import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function HeroSection({ isAdmin }) {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    fetchHero()
  }, [])
  
  async function fetchHero() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setHero(data)
      setFormData(data || {})
    } catch (error) {
      console.error('Error fetching hero:', error)
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
      if (hero?.id) {
        const { error } = await supabase
          .from('hero')
          .update(formData)
          .eq('id', hero.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('hero')
          .insert([formData])
          .select()
          .single()

        if (error) throw error
        setHero(data)
      }
      setEditing(false)
      fetchHero()
    } catch (error) {
      console.error('Error saving hero:', error)
      alert('Ошибка при сохранении: ' + error.message)
    }
  }
  
  if (loading) return null
  
  return (
    <>
      {isAdmin && !editing && (
        <button onClick={() => setEditing(true)} className="admin-btn">
          Редактировать Hero
        </button>
      )}

      {editing ? (
        <div className="edit-form">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Редактирование Hero секции</h3>
          <div className="form-group">
            <label>Приветствие:</label>
            <input
              type="text"
              value={formData.greeting || ''}
              onChange={(e) => setFormData({...formData, greeting: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Имя:</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Заголовок (tagline):</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
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
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={() => setEditing(false)} className="cancel-btn">Отмена</button>
          </div>
        </div>
      ) : null}
    </>
  )
}
