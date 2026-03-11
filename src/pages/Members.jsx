import { useParams, Link } from 'react-router-dom'
import { MEMBERS } from '../lib/members'

function StatBar({ label, value, color }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
                <span style={{ color, fontSize: 16, fontWeight: 800 }}>{value}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${value}%`, borderRadius: 4,
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                    boxShadow: `0 0 10px ${color}60`,
                    transition: 'width 1s ease',
                }} />
            </div>
        </div>
    )
}

export function MemberProfile() {
    const { id } = useParams()
    const member = MEMBERS.find(m => m.id === parseInt(id))

    if (!member) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pixel-box" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <p className="pixel-text" style={{ fontSize: 20 }}>MEMBER NOT FOUND!</p>
                <Link to="/members" style={{ color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>← BACK TO PARTY</Link>
            </div>
        </div>
    )

    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: 'var(--bg-primary)',
                    padding: '12px 0',
                    marginBottom: '1rem',
                }}>
                    <Link className="pixel-text" to="/members" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 18, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        ← BACK TO PARTY
                    </Link>
                </div>

                <div className="pixel-box">
                    {/* Profile header */}
                    <div style={{
                        background: member.color || 'var(--accent-yellow)',
                        padding: '3rem 2.5rem',
                        display: 'flex', alignItems: 'center', gap: '2rem',
                        flexWrap: 'wrap',
                        borderBottom: '4px solid var(--color-primary)',
                    }}>
                        <div style={{
                            width: 100, height: 100,
                            background: 'white',
                            border: `4px solid var(--color-primary)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 48,
                            boxShadow: `4px 4px 0px var(--color-primary)`,
                            flexShrink: 0,
                        }}>
                            {member.avatar ? <img src={member.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : member.emoji}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                                <h1 style={{ color: 'var(--color-primary)', textShadow: '2px 2px 0px white', fontSize: 28, margin: 0, fontFamily: 'var(--font-heading)' }}>{member.name.toUpperCase()}</h1>
                                <span className="pixel-text" style={{
                                    background: 'var(--color-primary)', color: 'white',
                                    padding: '4px 12px',
                                    fontSize: 12,
                                }}>LVL {member.level}</span>
                            </div>
                            <p className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 20, margin: '0 0 12px', background: 'white', border: '2px solid var(--color-primary)', display: 'inline-block', padding: '6px 12px' }}>{member.role}</p>
                            <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 20, margin: 0, fontWeight: 600 }}>"{member.bio}"</p>
                        </div>
                    </div>

                    <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {/* Member Info */}
                        <div>
                            <h3 className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: '1.5rem', textShadow: '2px 2px 0px var(--bg-primary)' }}>
                                📋 MEMBER INFO
                            </h3>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                background: 'white', border: '4px solid var(--color-primary)',
                                padding: '16px 20px', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                                marginBottom: 16,
                            }}>
                                <span style={{ fontSize: 28 }}>📍</span>
                                <div>
                                    <div className="pixel-text" style={{ color: 'var(--color-secondary)', fontSize: 12, marginBottom: 4 }}>LOCATION</div>
                                    <div className="pixel-body" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 20 }}>{member.location}</div>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                background: 'white', border: '4px solid var(--color-primary)',
                                padding: '16px 20px', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                            }}>
                                <span style={{ fontSize: 28 }}>🎂</span>
                                <div>
                                    <div className="pixel-text" style={{ color: 'var(--color-secondary)', fontSize: 12, marginBottom: 4 }}>BIRTHDAY</div>
                                    <div className="pixel-body" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 20 }}>{member.birthday}/2004</div>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div>
                            <h3 className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: '1.5rem', textShadow: '2px 2px 0px var(--bg-primary)' }}>
                                🏆 ACHIEVEMENTS
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {member.achievements.map((a, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        background: 'white', border: '4px solid var(--color-primary)',
                                        padding: '12px 16px', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                                    }}>
                                        <span style={{ fontSize: 24, filter: 'drop-shadow(2px 2px 0px var(--color-primary))' }}>🥇</span>
                                        <span className="pixel-body" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 18 }}>{a}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pixel-text" style={{ marginTop: '2rem', color: 'var(--color-secondary)', fontSize: 12 }}>
                                <span>🗓 JOINED: {member.joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MembersList() {
    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ color: 'var(--accent-red)', textShadow: '4px 4px 0px var(--color-primary)', fontSize: 40, margin: '0 0 12px', fontFamily: 'var(--font-heading)' }}>
                        ⚔️ THE PARTY
                    </h1>
                    <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 24, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '12px', boxShadow: '4px 4px 0px var(--color-primary)', display: 'inline-block' }}>
                        CÁC THÀNH VIÊN CỦA HỒ CON CHIM
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                    {MEMBERS.map(member => (
                        <Link key={member.id} to={`/members/${member.id}`} style={{ textDecoration: 'none' }}>
                            <div className="pixel-box" style={{
                                padding: '1.5rem', height: '100%', boxSizing: 'border-box',
                                transition: 'transform 0.1s, box-shadow 0.1s', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translate(-4px, -4px)'
                                    e.currentTarget.style.boxShadow = '12px 12px 0px rgba(0,0,0,0.15)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translate(0px, 0px)'
                                    e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.15)'
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: 64, height: 64,
                                        background: member.color || 'var(--accent-yellow)',
                                        border: `4px solid var(--color-primary)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 32, flexShrink: 0,
                                        boxShadow: '4px 4px 0px var(--color-primary)',
                                    }}>{member.avatar ? <img src={member.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : member.emoji}</div>
                                    <div>
                                        <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: 4 }}>{member.name.toUpperCase()}</div>
                                        <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14, background: 'var(--accent-yellow)', padding: '4px 8px', border: '2px solid var(--color-primary)', display: 'inline-block', marginTop: 4 }}>{member.role}</div>
                                    </div>
                                    <div className="pixel-text" style={{
                                        marginLeft: 'auto',
                                        background: 'var(--color-primary)', color: 'white',
                                        padding: '4px 8px',
                                        fontSize: 12,
                                    }}>LVL {member.level}</div>
                                </div>

                                <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 20, margin: '0 0 16px', fontWeight: 600, flex: 1 }}>"{member.bio}"</p>

                                {/* Location & Birthday */}
                                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                    <div style={{
                                        flex: 1, background: 'white', border: '2px solid var(--color-primary)',
                                        padding: '8px', textAlign: 'center',
                                    }}>
                                        <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: 4 }}>📍 {member.location}</div>
                                        <div className="pixel-text" style={{ color: 'var(--color-secondary)', fontSize: 14 }}>LOCATION</div>
                                    </div>
                                    <div style={{
                                        flex: 1, background: 'white', border: '2px solid var(--color-primary)',
                                        padding: '8px', textAlign: 'center',
                                    }}>
                                        <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: 4 }}>🎂 {member.birthday}</div>
                                        <div className="pixel-text" style={{ color: 'var(--color-secondary)', fontSize: 14 }}>BIRTHDAY</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}