import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { MEMBERS } from '../lib/members'

const TypewriterText = ({ text, delay = 0, speed = 50, showCursor = true }) => {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        let i = 0
        let timer
        const startTyping = () => {
            timer = setInterval(() => {
                setDisplayedText(text.substring(0, i + 1))
                i++
                if (i >= text.length) {
                    clearInterval(timer)
                }
            }, speed)
        }
        const initDelay = setTimeout(startTyping, delay)
        return () => {
            clearInterval(timer)
            clearTimeout(initDelay)
        }
    }, [text, delay, speed])

    return (
        <span>
            {displayedText}
            {showCursor && (
                <span className="typing-cursor" style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '0.8em',
                    backgroundColor: 'var(--color-primary)',
                    verticalAlign: 'baseline',
                    marginLeft: '4px'
                }}></span>
            )}
        </span>
    )
}

const features = [
    { path: '/members', icon: '⚔️', label: 'Thành Viên Nhóm', desc: 'Xem hồ sơn thành viên', color: '#FF6B6B' },
    { path: '/leaderboard', icon: '🏆', label: 'Xếp Hạng', desc: 'Ai đang dẫn đầu các chỉ số', color: '#F59E0B' },
    { path: '/availability', icon: '📅', label: 'Plan Lịch', desc: 'Xem ai rảnh ngày nào để đi chơi', color: '#10B981' },
    { path: '/gallery', icon: '🖼️', label: 'Kho Ảnh', desc: 'Upload ảnh nhóm', color: '#A855F7' },
    { path: '/vote', icon: '🗳️', label: 'Vote', desc: 'Vote các hoạt động', color: '#06B6D4' },
]

export default function Home() {
    const { user, profile } = useAuth()
    const memberName = profile?.member_name || user?.user_metadata?.member_name
    const memberData = MEMBERS.find(m => m.name === memberName)

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div style={{
                textAlign: 'center', padding: '4rem 2rem 2rem',
                position: 'relative',
            }}>
                <div style={{ position: 'relative' }}>
                    {user && memberData ? (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 16,
                                background: 'var(--bg-secondary)', border: `4px solid var(--color-primary)`,
                                boxShadow: '4px 4px 0px var(--color-primary)',
                                padding: '12px 24px',
                                color: 'var(--color-primary)', fontSize: 14, fontFamily: 'var(--font-heading)',
                            }}>
                                {memberData.avatar ? <img src={memberData.avatar} alt="avatar" style={{ width: 32, height: 32, objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>{memberData.emoji}</span>}
                                <span style={{ lineHeight: 1.5, textAlign: 'left' }}>WELCOME BACK,<br />{memberData.nickname.toUpperCase()}!</span>
                                <span style={{ background: memberData.color || 'var(--accent-yellow)', color: 'var(--color-primary)', padding: '6px 10px', fontSize: 12, border: '2px solid var(--color-primary)', marginLeft: 8 }}>LVL {memberData.level}</span>
                            </div>
                        </div>
                    ) : null}

                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                        <div className="float-anim" style={{ position: 'absolute', top: -40, left: -60, fontSize: 40, animationDelay: '0s' }}>✨</div>
                        <div className="float-anim" style={{ position: 'absolute', bottom: 10, right: -70, fontSize: 32, animationDelay: '1s' }}>👾</div>
                        <div className="float-anim" style={{ position: 'absolute', top: 20, right: -40, fontSize: 24, animationDelay: '0.5s' }}>⭐</div>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                            color: 'var(--accent-red)',
                            textShadow: '6px 6px 0px var(--color-primary)',
                            margin: '0',
                            lineHeight: 1.2,
                        }}>
                            <TypewriterText text="HCC HOME" speed={150} delay={100} showCursor={false} />
                        </h1>
                    </div>
                    <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 24, maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.5, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '1rem', boxShadow: '4px 4px 0px var(--color-primary)', position: 'relative', minHeight: '120px', textAlign: 'left' }}>
                        <span style={{ position: 'absolute', top: -12, left: -12, fontSize: 24 }}>💬</span>
                        <TypewriterText
                            text="Your private pixel-perfect space for the crew. Collaborate, compete, and create memories together."
                            speed={40}
                            delay={1500}
                            showCursor={true}
                        />
                    </p>

                    {!user && (
                        <div className="float-anim" style={{ animationDelay: '0.2s', display: 'inline-block' }}>
                            <Link to="/signin" style={{
                                display: 'inline-block',
                                background: 'var(--accent-yellow)',
                                color: 'var(--color-primary)', padding: '16px 32px',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                border: '4px solid var(--color-primary)',
                                boxShadow: '6px 6px 0px var(--color-primary)',
                                fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 'bold',
                                transition: 'transform 0.1s, box-shadow 0.1s',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translate(-2px, -2px)'
                                    e.currentTarget.style.boxShadow = '8px 8px 0px var(--color-primary)'
                                    e.currentTarget.style.background = '#FFD700'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translate(0px, 0px)'
                                    e.currentTarget.style.boxShadow = '6px 6px 0px var(--color-primary)'
                                    e.currentTarget.style.background = 'var(--accent-yellow)'
                                }}>
                                START GAME ►
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Grid */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                    {features.map(f => (
                        <Link key={f.path} to={f.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--bg-secondary)',
                                border: '4px solid var(--color-primary)',
                                boxShadow: '6px 6px 0px var(--color-primary)',
                                padding: '2rem 1.5rem',
                                textAlign: 'center',
                                transition: 'transform 0.1s, box-shadow 0.1s',
                                cursor: 'pointer',
                                height: '100%',
                                boxSizing: 'border-box',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translate(-2px, -2px)'
                                    e.currentTarget.style.boxShadow = '8px 8px 0px var(--color-primary)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translate(0px, 0px)'
                                    e.currentTarget.style.boxShadow = '6px 6px 0px var(--color-primary)'
                                }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>{f.icon}</div>
                                <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', fontSize: 12, textTransform: 'uppercase', marginBottom: 12 }}>{f.label}</div>
                                <div className="pixel-body" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>{f.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Members row */}
                <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--accent-purple)', textShadow: '2px 2px 0px var(--color-primary)', marginBottom: '3rem', fontSize: 24 }}>
                        🎮 THE CREW
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
                        {MEMBERS.map(m => (
                            <Link key={m.id} to={`/members/${m.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 68, height: 68,
                                        background: m.color || 'var(--accent-yellow)',
                                        border: '4px solid var(--color-primary)',
                                        boxShadow: '4px 4px 0px var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 32,
                                        transition: 'transform 0.1s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translate(-2px, -2px) scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)'}
                                    >
                                        {m.avatar ? <img src={m.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : m.emoji}
                                    </div>
                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 12, background: 'var(--bg-secondary)', padding: '4px 8px', border: '2px solid var(--color-primary)' }}>{m.nickname}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}