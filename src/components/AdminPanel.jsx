import { useState, useEffect } from 'react'

// Obfuscated admin credentials (XOR encoded)
const ADMIN_USERNAME_ENCODED = [104, 100, 109, 105, 110] // "hdmin" XOR with 1
const ADMIN_PASSWORD_ENCODED = [83, 101, 99, 114, 101, 116, 65, 100, 109, 105, 110, 50, 48, 50, 53] // "SecretAdmin2025" XOR with 1

function decode(encoded) {
  return String.fromCharCode(...encoded.map(c => c ^ 1))
}

const ADMIN_USERNAME = decode(ADMIN_USERNAME_ENCODED)
const ADMIN_PASSWORD = decode(ADMIN_PASSWORD_ENCODED)

export default function AdminPanel({ onLogin, onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(null)

  // Check for lockout on mount
  useEffect(() => {
    const storedLockout = localStorage.getItem('admin_lockout')
    if (storedLockout) {
      const lockoutUntil = parseInt(storedLockout)
      if (Date.now() < lockoutUntil) {
        setLockoutTime(lockoutUntil)
      } else {
        localStorage.removeItem('admin_lockout')
      }
    }
    
    // Load attempt count
    const storedAttempts = localStorage.getItem('admin_login_attempts')
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts))
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    
    // Check if locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000)
      setError(`Слишком много попыток. Попробуйте через ${remaining} сек.`)
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
    
    const newAttempts = loginAttempts + 1
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Success - reset attempts
      localStorage.removeItem('admin_login_attempts')
      localStorage.removeItem('admin_lockout')
      setLoginAttempts(0)
      setLockoutTime(null)
      setIsAuthenticated(true)
      onLogin()
    } else {
      // Failed attempt
      setLoginAttempts(newAttempts)
      localStorage.setItem('admin_login_attempts', newAttempts.toString())
      
      if (newAttempts >= 5) {
        // Lockout for 5 minutes
        const lockoutUntil = Date.now() + 5 * 60 * 1000
        setLockoutTime(lockoutUntil)
        localStorage.setItem('admin_lockout', lockoutUntil.toString())
        setError('Слишком много неудачных попыток. Доступ заблокирован на 5 минут.')
      } else {
        setError(`Неверное имя пользователя или пароль. Осталось попыток: ${5 - newAttempts}`)
      }
    }
    
    setLoading(false)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    onLogout()
    setUsername('')
    setPassword('')
  }

  if (!isAuthenticated) {
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 60000)
      return (
        <div className="admin-login">
          <h2>Вход для администратора</h2>
          <div className="lockout-message">
            <p>⚠️ Доступ временно заблокирован</p>
            <p>Попробуйте через {remaining} мин.</p>
          </div>
        </div>
      )
    }
    
    return (
      <div className="admin-login">
        <h2>Вход для администратора</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
        <p className="hint">Доступ только для авторизованного персонала</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <span>✓ Режим администратора активен</span>
        <button onClick={handleLogout}>Выйти</button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
        Теперь вы можете редактировать контент на странице.
      </p>
    </div>
  )
}
