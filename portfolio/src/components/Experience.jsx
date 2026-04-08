import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Experience({ isAdmin }) {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (editingId) {
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
      alert('Error saving data')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Вы уверены?')) return
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Error deleting data')
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

  if (loading) return <div className="section">Loading...</div>

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Опыт работы</h2>

      {isAdmin && editingId === null && (
        <button onClick={() => {
          setEditingId('new')
          setFormData({ company: '', position: '', description: '', start_date: '', end_date: '' })
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
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
          </div>
        </div>
      )}

      <div className="experience-list">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience-item">
            {editingId === exp.id ? (
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
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">Сохранить</button>
                  <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <div className="experience-header">
                  <h3>{exp.position}</h3>
                  <span className="company">{exp.company}</span>
                  <span className="period">
                    {new Date(exp.start_date).toLocaleDateString('ru-RU')} - 
                    {exp.end_date ? new Date(exp.end_date).toLocaleDateString('ru-RU') : ' н.в.'}
                  </span>
                </div>
                <p className="description">{exp.description}</p>
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => startEdit(exp)} className="edit-btn">Редактировать</button>
                    <button onClick={() => handleDelete(exp.id)} className="delete-btn">Удалить</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
