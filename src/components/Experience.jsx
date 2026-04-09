import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Experience({ isAdmin }) {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [expandedId, setExpandedId] = useState(null)
  
  useEffect(() => {
    fetchExperiences()
  }, [])
  
  async function fetchExperiences() {
    if (!isSupabaseConfigured) {
      setExperiences([])
      setLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false })

      if (error && error.code !== 'PGRST116') throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
      setExperiences([])
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
      if (editingId && editingId !== 'new') {
        const { error } = await supabase
          .from('experience')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('experience')
          .insert([formData])

        if (error) throw error
      }
      setEditingId(null)
      setFormData({})
      fetchExperiences()
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Ошибка при сохранении: ' + error.message)
    }
  }
  
  async function handleDelete(id) {
    if (!confirm('Вы уверены?')) return
    if (!isSupabaseConfigured) {
      alert('Supabase не настроен.')
      return
    }
    
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Ошибка при удалении: ' + error.message)
    }
  }
  
  function startEdit(exp) {
    setEditingId(exp.id)
    setFormData(exp)
  }
  
  function cancelEdit() {
    setEditingId(null)
    setFormData({})
  }
  
  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id)
  }
  
  if (loading) return <div className="section">Загрузка...</div>
  
  const displayExperiences = experiences.length > 0 ? experiences : []
  
  return (
    <section id="experience" className="section">
      <h2 className="section-title" data-section="2">Опыт работы</h2>

      {isAdmin && editingId === null && (
        <button onClick={() => {
          setEditingId('new')
          setFormData({ company: '', position: '', description: '', start_date: '', end_date: '', responsibilities: '', stack: '', achievements: '' })
        }} className="admin-btn">
          Добавить опыт
        </button>
      )}

      {editingId !== null && (
        <div className="edit-form">
          <div className="form-group">
            <label>Компания:</label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Должность:</label>
            <input
              type="text"
              value={formData.position || ''}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Начало (YYYY-MM-DD):</label>
            <input
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Конец (YYYY-MM-DD или пусто):</label>
            <input
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Описание:</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Обязанности (каждая с новой строки):</label>
            <textarea
              value={formData.responsibilities || ''}
              onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Стек технологий (через запятую):</label>
            <input
              type="text"
              value={formData.stack || ''}
              onChange={(e) => setFormData({...formData, stack: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Успехи (каждый с новой строки):</label>
            <textarea
              value={formData.achievements || ''}
              onChange={(e) => setFormData({...formData, achievements: e.target.value})}
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
          </div>
        </div>
      )}

      {displayExperiences.length > 0 ? (
        displayExperiences.map((exp) => (
          <div key={exp.id} className="experience-item">
            {editingId === exp.id ? (
              <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                <div className="form-group">
                  <label>Компания:</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Должность:</label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Начало:</label>
                  <input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Конец:</label>
                  <input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Описание:</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Обязанности:</label>
                  <textarea
                    value={formData.responsibilities || ''}
                    onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Стек:</label>
                  <input
                    type="text"
                    value={formData.stack || ''}
                    onChange={(e) => setFormData({...formData, stack: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Успехи:</label>
                  <textarea
                    value={formData.achievements || ''}
                    onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                    rows="4"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">Сохранить</button>
                  <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <div className="experience-header" onClick={() => toggleExpand(exp.id)} style={{ cursor: 'pointer' }}>
                  <div className="experience-header-main">
                    <h3>{exp.position || 'Нет информации'}</h3>
                    <span className="company">{exp.company || 'Нет информации'}</span>
                  </div>
                  <div className="experience-header-right">
                    <span className="period">
                      {exp.start_date ? new Date(exp.start_date).toLocaleDateString('ru-RU') : ''} -{exp.end_date ? ' ' + new Date(exp.end_date).toLocaleDateString('ru-RU') : ' н.в.'}
                    </span>
                    <button className="expand-btn">
                      {expandedId === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
                
                {expandedId === exp.id && (
                  <div className="experience-details">
                    {exp.description && (
                      <p className="description">{exp.description}</p>
                    )}
                    
                    {exp.achievements && (
                      <div className="details-section">
                        <h4>Успехи</h4>
                        <ul className="details-list">
                          {exp.achievements.split('\n').filter(a => a.trim()).map((ach, i) => (
                            <li key={i}>{ach.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.responsibilities && (
                      <div className="details-section">
                        <h4>Обязанности</h4>
                        <ul className="details-list">
                          {exp.responsibilities.split('\n').filter(r => r.trim()).map((resp, i) => (
                            <li key={i}>{resp.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.stack && (
                      <div className="details-section">
                        <h4>Стек технологий</h4>
                        <div className="stack-tags">
                          {exp.stack.split(',').filter(s => s.trim()).map((tech, i) => (
                            <span key={i} className="tech-tag">{tech.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => startEdit(exp)} className="edit-btn">Редактировать</button>
                    <button onClick={() => handleDelete(exp.id)} className="delete-btn">Удалить</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="placeholder-text">Нет информации для отображения</p>
      )}
    </section>
  )
}
