import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function AdminPanel({ onLogin, onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Проверяем активную сессию при загрузке компонента
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Supabase не настроен. Проверьте переменные окружения.')
      return
    }

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
        return
      }
      if (session) {
        setIsAuthenticated(true)
        onLogin()
      }
    }
    checkSession()
  }, [onLogin])

  async function handleLogin(e) {
    e.preventDefault()
    
    if (!isSupabaseConfigured) {
      setError('Supabase не настроен. Пожалуйста, настройте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (error) throw error

      if (data.user) {
        setIsAuthenticated(true)
        setEmail('')
        setPassword('')
        onLogin()
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    if (!isSupabaseConfigured) {
      setIsAuthenticated(false)
      onLogout()
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
    
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
    onLogout()
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Вход для администратора</h2>
        {!isSupabaseConfigured && (
          <div className="warning-message" style={{ 
            background: '#fef3c7', 
            border: '1px solid #f59e0b', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem',
            color: '#92400e'
          }}>
            ⚠️ Supabase не настроен! Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в файл .env
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={!isSupabaseConfigured}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={!isSupabaseConfigured}
          />
          {error && <p className="error" style={{ color: '#dc2626', marginTop: '0.5rem' }}>{error}</p>}
          <button 
            type="submit" 
            disabled={loading || !isSupabaseConfigured}
            style={{
              opacity: (loading || !isSupabaseConfigured) ? 0.6 : 1,
              cursor: (loading || !isSupabaseConfigured) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="hint" style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Используйте ваш Supabase аккаунт для входа
        </p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem',
        background: '#dcfce7',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <span style={{ color: '#166534', fontWeight: '600' }}>✓ Режим администратора активен</span>
        <button 
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Выйти
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
        Теперь вы можете редактировать контент на странице.
      </p>
    </div>
  )
}
