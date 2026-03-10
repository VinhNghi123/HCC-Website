import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { MEMBERS } from '../lib/members'
import { useState } from 'react'

const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/members', label: 'NHÓM', icon: '⚔️' },
    { path: '/leaderboard', label: 'Rankings', icon: '🏆' },
    { path: '/availability', label: 'Lịch', icon: '📅' },
    { path: '/gallery', label: 'KHO ẢNH', icon: '🖼️' },
    { path: '/vote', label: 'Vote', icon: '🗳️' },
]

export default function Navbar() {
    const { user, profile, signOut } = useAuth()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const memberName = profile?.member_name || user?.user_metadata?.member_name
    const memberData = MEMBERS.find(m => m.name === memberName)

    return (
        <header style={{
            background: 'var(--bg-secondary)',
            borderBottom: '4px solid var(--color-primary)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        background: 'var(--accent-red)',
                        border: '4px solid var(--color-primary)',
                        boxShadow: '4px 4px 0px var(--color-primary)',
                        width: 40, height: 40,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28
                    }}>🎮</div>
                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontWeight: 900, fontSize: 24 }}>HCC</span>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }} className="desktop-nav">
                    {navItems.map(item => {
                        const active = location.pathname === item.path
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '8px 12px',
                                textDecoration: 'none', fontSize: 16,
                                fontFamily: 'var(--font-heading)',
                                background: active ? 'var(--accent-yellow)' : 'transparent',
                                color: 'var(--color-primary)',
                                border: active ? '4px solid var(--color-primary)' : '4px solid transparent',
                                boxShadow: active ? '4px 4px 0px var(--color-primary)' : 'none',
                                textTransform: 'uppercase',
                                transition: 'all 0.1s',
                            }}>
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <span style={{ fontSize: 16 }}>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                background: memberData?.avatar ? 'transparent' : (memberData?.color || 'var(--accent-yellow)'),
                                width: 48, height: 48,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, border: '4px solid var(--color-primary)',
                                boxShadow: '4px 4px 0px var(--color-primary)',
                                overflow: 'hidden',
                            }}>
                                {memberData?.avatar ? <img src={memberData.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (memberData?.emoji || '👤')}
                            </div>
                            <div className="desktop-nav" style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 18 }}>{memberData?.nickname || 'Hero'}</span>
                                <span className="pixel-text" style={{ color: memberData?.color || 'var(--accent-red)', fontSize: 16 }}>Lv {memberData?.level || 1}</span>
                            </div>
                            <button onClick={signOut} style={{
                                padding: '10px 14px', fontSize: 14,
                                background: 'var(--bg-secondary)',
                                color: 'var(--color-primary)',
                            }}>EXIT</button>
                        </div>
                    ) : (
                        <Link to="/signin" style={{
                            background: 'var(--accent-yellow)', color: 'var(--color-primary)',
                            padding: '12px 20px', fontWeight: 900,
                            textDecoration: 'none', fontSize: 16,
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            border: '4px solid var(--color-primary)',
                            boxShadow: '4px 4px 0px var(--color-primary)',
                        }}>START</Link>
                    )}

                    {/* Mobile hamburger */}
                    <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{
                        background: 'var(--accent-yellow)', border: '4px solid var(--color-primary)',
                        color: 'var(--color-primary)', width: 44, height: 44,
                        display: 'none', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: 20, padding: 0,
                        boxShadow: '4px 4px 0px var(--color-primary)',
                    }}>☰</button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ background: 'var(--bg-secondary)', borderTop: '4px solid var(--color-primary)', padding: '1rem' }} className="mobile-nav">
                    {navItems.map(item => (
                        <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px', textDecoration: 'none',
                            fontFamily: 'var(--font-heading)',
                            background: location.pathname === item.path ? 'var(--accent-yellow)' : 'transparent',
                            color: 'var(--color-primary)',
                            fontSize: 18, borderBottom: '4px dashed var(--color-primary)',
                        }}>
                            <span style={{ fontSize: 26 }}>{item.icon}</span> {item.label}
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 950px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </header>
    )
}