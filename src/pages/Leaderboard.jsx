import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MEMBERS } from '../lib/members'

const CATEGORIES = [
    { id: 'level', label: '⚔️ Level', key: 'level', desc: 'Overall character level' },
    { id: 'strength', label: '💪 Strength', key: 'strength', desc: 'Raw power ranking' },
    { id: 'wisdom', label: '🧠 Wisdom', key: 'wisdom', desc: 'Intellectual prowess' },
    { id: 'charisma', label: '✨ Charisma', key: 'charisma', desc: 'Social influence' },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
    const [category, setCategory] = useState('level')
    const [scores, setScores] = useState([])

    useEffect(() => {
        const sorted = [...MEMBERS].map(m => ({
            ...m,
            score: category === 'level' ? m.level : m.stats[category] ?? m.level,
        })).sort((a, b) => b.score - a.score)
        setScores(sorted)
    }, [category])

    const cat = CATEGORIES.find(c => c.id === category)

    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ color: 'var(--accent-red)', textShadow: '4px 4px 0px var(--color-primary)', fontSize: 40, margin: '0 0 8px' }}>
                        🏆 HALL OF FAME
                    </h1>
                    <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 24, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '12px', boxShadow: '4px 4px 0px var(--color-primary)', textTransform: 'uppercase' }}>
                        {cat?.desc}
                    </p>
                </div>

                {/* Category Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => setCategory(c.id)} style={{
                            background: category === c.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                            color: 'var(--color-primary)', textTransform: 'uppercase',
                            border: category === c.id ? '4px solid var(--color-primary)' : '4px dashed var(--color-primary)',
                            boxShadow: category === c.id ? '4px 4px 0px var(--color-primary)' : 'none',
                            transform: category === c.id ? 'translate(-2px, -2px)' : 'none',
                            fontSize: 12,
                        }}>
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Top 3 podium */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: '4rem' }}>
                    {[scores[1], scores[0], scores[2]].map((m, i) => {
                        if (!m) return null
                        const heights = [160, 200, 130]
                        const ranks = [2, 1, 3]
                        const podiumColors = ['var(--color-secondary)', 'var(--accent-yellow)', 'var(--accent-orange)']
                        return (
                            <div key={m.id} style={{ textAlign: 'center', flex: 1, maxWidth: 160 }}>
                                <div style={{ fontSize: 40, marginBottom: 8, filter: 'drop-shadow(4px 4px 0px var(--color-primary))' }}>{MEDALS[ranks[i] - 1]}</div>
                                <div style={{
                                    width: 72, height: 72, margin: '0 auto 16px',
                                    background: m.color || 'var(--accent-yellow)', border: '4px solid var(--color-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 32, boxShadow: '4px 4px 0px var(--color-primary)',
                                }}>{m.avatar ? <img src={m.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : m.emoji}</div>
                                <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 13, marginBottom: 4, background: 'var(--bg-secondary)', border: '2px solid var(--color-primary)', padding: '4px' }}>{m.nickname}</div>
                                <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 24, marginBottom: 12, textShadow: `2px 2px 0px ${podiumColors[i]}` }}>{m.score}</div>
                                <div className="pixel-box" style={{
                                    height: heights[i], background: podiumColors[i],
                                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                                    paddingTop: 16,
                                }}>
                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 24 }}>#{ranks[i]}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Full rankings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {scores.map((m, i) => (
                        <div key={m.id} className="pixel-box" style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            background: i < 3 ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                            padding: '16px 20px',
                        }}>
                            <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 24, minWidth: 36, textAlign: 'center' }}>
                                {i < 3 ? MEDALS[i] : `#${i + 1}`}
                            </span>
                            <div style={{
                                width: 48, height: 48,
                                background: m.color || 'var(--accent-red)', border: `4px solid var(--color-primary)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, flexShrink: 0, boxShadow: '2px 2px 0px var(--color-primary)'
                            }}>{m.avatar ? <img src={m.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : m.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, marginBottom: 4 }}>{m.name}</div>
                                <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 10 }}>{m.role}</div>
                            </div>

                            {/* Score bar */}
                            <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 10 }}>{cat?.label}</span>
                                    <span className="pixel-text" style={{ color: 'var(--accent-purple)', textShadow: '2px 2px 0px var(--color-primary)', fontSize: 20 }}>{m.score}</span>
                                </div>
                                <div style={{ height: 12, background: 'white', border: '2px solid var(--color-primary)' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${(m.score / 100) * 100}%`,
                                        background: m.color || 'var(--accent-red)',
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}