import { useState, useEffect } from 'react'
import { Menu, X, FileText, Mail } from 'lucide-react'
import { FaTelegram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Navbar({ isAdmin, onToggleAdmin, onOpenResumeModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [footerContact, setFooterContact] = useState(null)
  
  useEffect(() => {
    fetchFooterContact()
  }, [])
  
  async function fetchFooterContact() {
    if (!isSupabaseConfigured) {
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setFooterContact(data)
    } catch (error) {
      console.error('Error fetching footer contact:', error)
    }
  }
  
  const navItems = [
    { name: 'Обо мне', href: '#about' },
    { name: 'Опыт', href: '#experience' },
    { name: 'Проекты', href: '#projects' },
    { name: 'Контакты', href: '#contact' },
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#" className="nav-logo">m.d</a>
        
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active show' : ''}`}>
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              {item.name}
            </a>
          ))}
          <button onClick={() => { onOpenResumeModal(); setMobileMenuOpen(false); }} className="nav-link resume-nav-btn">
            <FileText size={16} />
            <span style={{ marginLeft: '5px' }}>Резюме</span>
          </button>
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
