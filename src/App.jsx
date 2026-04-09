import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AdminPanel from './components/AdminPanel'
import HeroSection from './components/HeroSection'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { Send, Mail } from 'lucide-react'
import { FaTelegram, FaLinkedin, FaGithub } from 'react-icons/fa'
import { supabase, isSupabaseConfigured } from './lib/supabase'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [footerContact, setFooterContact] = useState(null)
  const [heroData, setHeroData] = useState(null)
  
  // Secret key combination handler (press 'A' + 'D' + 'M' quickly) - moved to App component for security
  useEffect(() => {
    const secretCode = 'adm'
    let input = ''
    let timer = null
    
    const handleKeyDown = (e) => {
      // Only process lowercase letters a-z
      if (!/^[a-zA-Z]$/.test(e.key)) return
      
      const key = e.key.toLowerCase()
      input += key
      
      // Keep only the last N characters where N is the length of secretCode
      if (input.length > secretCode.length) {
        input = input.slice(-secretCode.length)
      }
      
      // Clear any existing timer
      clearTimeout(timer)
      
      // Reset input after 1 second of no typing
      timer = setTimeout(() => {
        input = ''
      }, 1000)
      
      // Check if the secret code was entered
      if (input === secretCode && !isAdmin) {
        console.log('Secret code entered! Showing admin modal...')
        setShowAdminModal(true)
        input = ''
      }
      
      // Debug log (remove in production)
      console.log('Key pressed:', key, 'Current input:', input)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isAdmin])
  
  useEffect(() => {
    fetchFooterContact()
    fetchHeroData()
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
  
  async function fetchHeroData() {
    if (!isSupabaseConfigured) {
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setHeroData(data)
    } catch (error) {
      console.error('Error fetching hero data:', error)
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
      {/* Fixed Social Links (Left Bottom) */}
      <div className="fixed-social">
        {footerContact?.github && (
          <a href={footerContact.github} target="_blank" rel="noopener noreferrer" className="fixed-social-link" title="GitHub">
            <FaGithub size={20} />
          </a>
        )}
        {footerContact?.linkedin && (
          <a href={footerContact.linkedin} target="_blank" rel="noopener noreferrer" className="fixed-social-link" title="LinkedIn">
            <FaLinkedin size={20} />
          </a>
        )}
        {footerContact?.telegram && (
          <a href={`https://t.me/${footerContact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="fixed-social-link" title="Telegram">
            <FaTelegram size={20} />
          </a>
        )}
        {footerContact?.hh && (
          <a href={footerContact.hh} target="_blank" rel="noopener noreferrer" className="fixed-social-link" title="HeadHunter">
            <svg className="hh-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <use href="/icons.svg#hh-icon" />
            </svg>
          </a>
        )}
        <div className="fixed-social-line"></div>
      </div>

      {/* Fixed Email (Right Bottom) */}
      {footerContact?.email && (
        <div className="fixed-email">
          <a href={`mailto:${footerContact.email}`} className="fixed-email-link" title="Email">
            {footerContact.email}
          </a>
          <div className="fixed-email-line"></div>
        </div>
      )}

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
        <section className="hero" style={{ position: 'relative' }}>
          <HeroSection isAdmin={isAdmin} />
          <p className="hero-overline">{heroData?.greeting || 'Привет, меня зовут'}</p>
          <h1>{heroData?.name || footerContact?.name || 'Ваше Имя'}.</h1>
          <h2>{heroData?.tagline || 'Я создаю вещи для интернета.'}</h2>
          <p className="hero-description">
            {heroData?.description || 'Я Salesforce Developer и Golang Enthusiast, специализирующийся на создании исключительных цифровых продуктов. В настоящее время я сосредоточен на разработке масштабируемых решений.'}
          </p>
          <a href={`mailto:${footerContact?.email || ''}`} className="cta-button">Связаться со мной</a>
        </section>

        <About isAdmin={isAdmin} />
        <Experience isAdmin={isAdmin} />
        <Projects isAdmin={isAdmin} />
        <Contact isAdmin={isAdmin} />
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
