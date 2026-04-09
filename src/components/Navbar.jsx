import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar({ isAdmin, onToggleAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { name: 'Обо мне', href: '#about' },
    { name: 'Опыт', href: '#experience' },
    { name: 'Проекты', href: '#projects' },
    { name: 'Контакты', href: '#contact' },
  ]
  
  // Secret key combination handler (press 'A' + 'D' + 'M' quickly)
  useEffect(() => {
    const secretCode = 'adm'
    let input = ''
    let timer = null
    
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      input += key
      if (input.length > secretCode.length) {
        input = input.slice(-secretCode.length)
      }
      
      clearTimeout(timer)
      timer = setTimeout(() => {
        input = ''
      }, 1000)
      
      if (input === secretCode && !isAdmin) {
        onToggleAdmin()
        input = ''
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isAdmin, onToggleAdmin])

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#" className="nav-logo">Portfolio</a>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              {item.name}
            </a>
          ))}
          {/* Admin button hidden - use secret key combination ADM */}
        </div>
      </div>
    </nav>
  )
}
