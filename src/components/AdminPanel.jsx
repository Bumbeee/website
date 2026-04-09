import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPanel({ onLogin, onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Check if user is already logged in via Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        onLogin()
      }
    }
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true)
        onLogin()
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        onLogout()
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [onLogin, onLogout])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        setIsAuthenticated(true)
        onLogin()
      }
    } catch (error) {
      setError(error.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    onLogout()
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Вход для администратора</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="hint">Только для авторизованных пользователей</p>
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
