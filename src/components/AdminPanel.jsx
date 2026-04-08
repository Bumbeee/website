import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPanel({ onLogin, onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    
    // В реальном приложении здесь должна быть проверка через Supabase Auth
    // Для простоты используем хардкод пароль (измените на свой!)
    if (password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setError('')
      onLogin()
    } else {
      setError('Неверный пароль')
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    onLogout()
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Вход для администратора</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Войти</button>
        </form>
        <p className="hint">Пароль по умолчанию: admin123</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <span>Режим администратора активен</span>
        <button onClick={handleLogout}>Выйти</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
        Теперь вы можете редактировать контент на странице. Нажмите "Админ" в навигации для выхода.
      </p>
    </div>
  )
}
