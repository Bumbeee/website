import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AdminPanel from './components/AdminPanel'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { Mail, Send, Globe, Link as LinkIcon } from 'lucide-react'
import { supabase, isSupabaseConfigured } from './lib/supabase'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
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
  
  function handleToggleAdmin() {
    if (isAdmin) {
      setIsAdmin(false)
    } else {
      setShowAdminModal(true)
    }
  }

  return (
    <div className="app">
      <Navbar isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin} />
      
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AdminPanel 
              onLogin={() => {
                setIsAdmin(true)
                setShowAdminModal(false)
              }}
              onLogout={() => {
                setIsAdmin(false)
                setShowAdminModal(false)
              }} 
            />
          </div>
        </div>
      )}

      <main className="main-content">
        <section className="hero">
          <h1>Привет, я <span className="highlight">{footerContact?.name || 'Ваше Имя'}</span></h1>
          <p>Salesforce Developer & Golang Enthusiast</p>
        </section>

        <About isAdmin={isAdmin} />
        <Experience isAdmin={isAdmin} />
        <Projects isAdmin={isAdmin} />
        <Contact isAdmin={isAdmin} />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Контакты</h4>
            <div className="footer-links">
              {footerContact?.email ? (
                <a href={`mailto:${footerContact.email}`} className="footer-link">
                  <Mail size={18} />
                  {footerContact.email}
                </a>
              ) : (
                <span className="footer-link placeholder-text">Нет информации</span>
              )}
              {footerContact?.telegram ? (
                <a href={`https://t.me/${footerContact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="footer-link">
                  <Send size={18} />
                  Telegram: {footerContact.telegram.replace('@', '')}
                </a>
              ) : null}
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Социальные сети</h4>
            <div className="social-links">
              {footerContact?.github ? (
                <a href={footerContact.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Globe size={20} />
                </a>
              ) : null}
              {footerContact?.linkedin ? (
                <a href={footerContact.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <LinkIcon size={20} />
                </a>
              ) : null}
              {footerContact?.telegram ? (
                <a href={`https://t.me/${footerContact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link">
                  <Send size={20} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
