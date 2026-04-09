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
          {isAdmin && (
            <button onClick={onToggleAdmin} className="admin-toggle active">
              Выйти из админ режима
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
