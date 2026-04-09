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
        <a href="#" className="nav-logo">Portfolio</a>
        
        <button 
          className="mobile-menu-btn"
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
          
          {/* Mobile Contact Info - Only visible in mobile menu */}
          {footerContact && (
            <div className="mobile-contact-info">
              <div className="mobile-contact-divider"></div>
              {footerContact.email && (
                <a href={`mailto:${footerContact.email}`} className="mobile-contact-link" onClick={() => setMobileMenuOpen(false)}>
                  <Mail size={18} />
                  <span>{footerContact.email}</span>
                </a>
              )}
              <div className="mobile-social-links">
                {footerContact.github && (
                  <a href={footerContact.github} target="_blank" rel="noopener noreferrer" className="mobile-social-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaGithub size={20} />
                  </a>
                )}
                {footerContact.linkedin && (
                  <a href={footerContact.linkedin} target="_blank" rel="noopener noreferrer" className="mobile-social-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaLinkedin size={20} />
                  </a>
                )}
                {footerContact.telegram && (
                  <a href={`https://t.me/${footerContact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mobile-social-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaTelegram size={20} />
                  </a>
                )}
                {footerContact.hh && (
                  <a href={footerContact.hh} target="_blank" rel="noopener noreferrer" className="mobile-social-link" onClick={() => setMobileMenuOpen(false)} title="HeadHunter">
                    <svg className="hh-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <use href="/icons.svg#hh-icon" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
