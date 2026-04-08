import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Projects({ isAdmin }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (editingId && editingId !== 'new') {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData])

        if (error) throw error
      }
      setEditingId(null)
      setFormData({})
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving data')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Вы уверены?')) return
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting data')
    }
  }

  function startEdit(project) {
    setEditingId(project.id)
    setFormData(project)
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({})
  }

  if (loading) return <div className="section">Loading...</div>

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Проекты</h2>

      {isAdmin && editingId === null && (
        <button onClick={() => {
          setEditingId('new')
          setFormData({ title: '', description: '', technologies: '', link: '' })
        }} className="admin-btn">
          Добавить проект
        </button>
      )}

      {editingId !== null && (
        <div className="edit-form">
          <div className="form-group">
            <label>Название:</label>
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
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Технологии (через запятую):</label>
            <input
              type="text"
              value={formData.technologies || ''}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Ссылка:</label>
            <input
              type="url"
              value={formData.link || ''}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Сохранить</button>
            <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            {editingId === project.id ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Название:</label>
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
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Технологии:</label>
                  <input
                    type="text"
                    value={formData.technologies || ''}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ссылка:</label>
                  <input
                    type="url"
                    value={formData.link || ''}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">Сохранить</button>
                  <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <h3>{project.title}</h3>
                <p className="description">{project.description}</p>
                <div className="technologies">
                  {(project.technologies || '').split(',').filter(t => t.trim()).map((tech, i) => (
                    <span key={i} className="tech-tag">{tech.trim()}</span>
                  ))}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    Посмотреть проект →
                  </a>
                )}
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => startEdit(project)} className="edit-btn">Редактировать</button>
                    <button onClick={() => handleDelete(project.id)} className="delete-btn">Удалить</button>
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
