import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import { MEMBERS } from '../lib/members'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function SignIn() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [takenMembers, setTakenMembers] = useState([])
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch profiles that already have a member_name claimed
    supabase
      .from('profiles')
      .select('member_name')
      .then(({ data }) => {
        if (data) setTakenMembers(data.map(p => p.member_name).filter(Boolean))
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setMessage({ type: 'error', text: error.message })
      else navigate('/')
    } else {
      if (!selectedMember) {
        setMessage({ type: 'error', text: 'Please select your member name!' })
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, selectedMember)
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: 'Check your email to confirm your account!' })
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div className="pixel-box" style={{
        padding: '2.5rem',
        width: '100%',
        maxWidth: 440,
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: 56, marginBottom: 16,
            textShadow: '4px 4px 0px var(--color-primary)',
          }}>🎮</div>
          <h1 style={{
            color: 'var(--accent-yellow)',
            fontSize: 48,
            margin: '0 0 16px',
            textShadow: '4px 4px 0px var(--accent-red), 8px 8px 0px var(--color-primary)',
            letterSpacing: '2px',
            animation: 'pulse 2s infinite ease-in-out'
          }}>
            HCC HOME
          </h1>
          <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 20, marginTop: 0, fontWeight: 600 }}>
            {mode === 'signin' ? 'INSERT COIN TO CONTINUE' : 'SELECT YOUR HERO'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{
          display: 'flex', gap: 8,
          marginBottom: '2rem',
        }}>
          {['signin', 'signup'].map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              flex: 1, padding: '12px',
              background: mode === m ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
              color: 'var(--color-primary)',
              border: mode === m ? '4px solid var(--color-primary)' : '4px dashed var(--color-primary)',
              boxShadow: mode === m ? '4px 4px 0px var(--color-primary)' : 'none',
              transform: mode === m ? 'translate(-2px, -2px)' : 'none',
              fontSize: 12,
              cursor: 'pointer', fontFamily: 'var(--font-heading)',
              transition: 'all 0.1s',
            }}>
              {m === 'signin' ? 'LOGIN' : 'JOIN'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {mode === 'signup' && (
            <div>
              <label className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, display: 'block', marginBottom: 12 }}>
                SELECT YOUR CHARACTER
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {MEMBERS.filter(member => !takenMembers.includes(member.name)).map(member => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedMember(member.name)}
                    style={{
                      padding: '12px 8px',
                      background: selectedMember === member.name ? member.color : 'var(--bg-secondary)',
                      color: 'var(--color-primary)',
                      border: selectedMember === member.name ? '4px solid var(--color-primary)' : '4px dashed var(--color-primary)',
                      boxShadow: selectedMember === member.name ? '4px 4px 0px var(--color-primary)' : 'none',
                      transform: selectedMember === member.name ? 'translate(-2px, -2px)' : 'none',
                      cursor: 'pointer',
                      fontSize: 14, fontFamily: 'var(--font-heading)',
                      textAlign: 'center',
                      transition: 'all 0.1s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{member.avatar ? <img src={member.avatar} alt="avatar" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} /> : member.emoji}</div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: 13 }}>{member.nickname.toUpperCase()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, display: 'block', marginBottom: 12 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="PLAYER@MAIL.COM"
              className="pixel-body"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'white', border: '4px solid var(--color-primary)',
                color: 'var(--color-primary)', fontSize: 20, outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                textTransform: 'uppercase',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-red)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-primary)'}
            />
          </div>

          <div>
            <label className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, display: 'block', marginBottom: 12 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="pixel-body"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'white', border: '4px solid var(--color-primary)',
                color: 'var(--color-primary)', fontSize: 20, outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent-red)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-primary)'}
            />
          </div>

          {message.text && (
            <div className="pixel-body" style={{
              padding: '12px 16px',
              background: message.type === 'error' ? '#ffcccc' : '#ccffcc',
              border: `4px solid ${message.type === 'error' ? 'var(--accent-red)' : 'var(--accent-green)'}`,
              color: 'var(--color-primary)',
              fontSize: 18, fontWeight: 600,
            }}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%',
            opacity: loading ? 0.7 : 1,
            pointerEvents: loading ? 'none' : 'auto',
          }}>
            {loading ? 'LOADING...' : mode === 'signin' ? 'PRESS START' : 'JOIN CURRENT GAME'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link className="pixel-text" to="/" style={{ color: 'var(--color-primary)', fontSize: 16, textDecoration: 'none' }}>
            ← MAIN MENU
          </Link>
        </div>
      </div>
    </div>
  )
}