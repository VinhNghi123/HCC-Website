import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import { MEMBERS } from '../lib/members'

export default function Vote() {
    const { user, profile } = useAuth()
    const [polls, setPolls] = useState([])
    const [votes, setVotes] = useState({})
    const [showCreate, setShowCreate] = useState(false)
    const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''] })

    const memberData = MEMBERS.find(m => m.name === (profile?.member_name || user?.user_metadata?.member_name))

    useEffect(() => { fetchPolls() }, [])

    const fetchPolls = async () => {
        const { data: pollData } = await supabase.from('polls').select('*').order('created_at', { ascending: false })
        const { data: voteData } = await supabase.from('votes').select('*')

        if (pollData) setPolls(pollData)
        if (voteData) {
            const voteMap = {}
            voteData.forEach(v => {
                if (!voteMap[v.poll_id]) voteMap[v.poll_id] = {}
                if (!voteMap[v.poll_id][v.option_index]) voteMap[v.poll_id][v.option_index] = []
                voteMap[v.poll_id][v.option_index].push(v.member_name)
            })
            setVotes(voteMap)
        }
    }

    const castVote = async (pollId, optionIndex) => {
        if (!user) return alert('Please sign in first!')
        const myName = profile?.member_name
        const alreadyVoted = Object.values(votes[pollId] || {}).some(names => names.includes(myName))
        if (alreadyVoted) {
            await supabase.from('votes').delete().eq('poll_id', pollId).eq('member_name', myName)
        }
        await supabase.from('votes').insert({ poll_id: pollId, option_index: optionIndex, member_name: myName, user_id: user.id })
        fetchPolls()
    }

    const createPoll = async () => {
        if (!user) return alert('Please sign in first!')
        if (!newPoll.question.trim()) return
        const options = newPoll.options.filter(o => o.trim())
        if (options.length < 2) return alert('Add at least 2 options!')

        await supabase.from('polls').insert({
            question: newPoll.question,
            options: options,
            created_by: profile?.member_name || user.email,
            user_id: user.id,
        })
        setNewPoll({ question: '', options: ['', ''] })
        setShowCreate(false)
        fetchPolls()
    }

    const getMyVote = (pollId) => {
        const myName = profile?.member_name
        for (const [idx, names] of Object.entries(votes[pollId] || {})) {
            if (names.includes(myName)) return parseInt(idx)
        }
        return null
    }

    const getTotalVotes = (pollId) => {
        return Object.values(votes[pollId] || {}).reduce((sum, names) => sum + names.length, 0)
    }

    const getOptionVotes = (pollId, idx) => votes[pollId]?.[idx]?.length || 0

    const COLORS = ['#FF6B6B', '#A855F7', '#10B981', '#F59E0B', '#06B6D4', '#EC4899']

    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ color: 'var(--accent-red)', textShadow: '4px 4px 0px var(--color-primary)', fontSize: 40, margin: '0 0 12px' }}>
                            🗳️ VOTE & DECIDE
                        </h1>
                        <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 20, margin: 0, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '8px 16px', boxShadow: '4px 4px 0px var(--color-primary)', display: 'inline-block' }}>Let the party decide together</p>
                    </div>
                    {user && (
                        <button onClick={() => setShowCreate(!showCreate)}>
                            {showCreate ? '✕ CANCEL' : '+ NEW POLL'}
                        </button>
                    )}
                </div>

                {/* Create Poll Form */}
                {showCreate && (
                    <div className="pixel-box" style={{ padding: '1.5rem', marginBottom: '3rem', background: 'var(--accent-yellow)' }}>
                        <h3 className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14, marginBottom: '1.2rem' }}>
                            📝 CREATE NEW POLL
                        </h3>
                        <input
                            type="text" value={newPoll.question}
                            onChange={e => setNewPoll(p => ({ ...p, question: e.target.value }))}
                            placeholder="WHAT'S THE QUESTION?"
                            className="pixel-body"
                            style={{
                                width: '100%', padding: '12px 16px',
                                background: 'white', border: '4px solid var(--color-primary)',
                                color: 'var(--color-primary)', fontSize: 20, outline: 'none',
                                marginBottom: '1rem', boxSizing: 'border-box',
                                boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1)',
                                textTransform: 'uppercase',
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
                            {newPoll.options.map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: 12 }}>
                                    <input
                                        type="text" value={opt}
                                        onChange={e => {
                                            const opts = [...newPoll.options]
                                            opts[i] = e.target.value
                                            setNewPoll(p => ({ ...p, options: opts }))
                                        }}
                                        placeholder={`OPTION ${i + 1}`}
                                        className="pixel-body"
                                        style={{
                                            flex: 1, padding: '12px 16px',
                                            background: 'white', border: `4px solid var(--color-primary)`,
                                            color: 'var(--color-primary)', fontSize: 18, outline: 'none',
                                            textTransform: 'uppercase',
                                        }}
                                    />
                                    {newPoll.options.length > 2 && (
                                        <button onClick={() => setNewPoll(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))}
                                            style={{ background: 'var(--accent-red)', width: 60, padding: 0, fontSize: 24 }}>
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <button onClick={() => setNewPoll(p => ({ ...p, options: [...p.options, ''] }))} style={{
                                background: 'var(--bg-primary)'
                            }}>+ ADD OPTION</button>
                            <button onClick={createPoll}>LAUNCH POLL 🚀</button>
                        </div>
                    </div>
                )}

                {/* Polls list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {polls.length === 0 ? (
                        <div className="pixel-box" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-primary)' }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>🗳️</div>
                            <p className="pixel-text" style={{ fontSize: 18 }}>NO POLLS YET! CREATE THE FIRST ONE.</p>
                        </div>
                    ) : polls.map(poll => {
                        const myVote = getMyVote(poll.id)
                        const total = getTotalVotes(poll.id)
                        const creator = MEMBERS.find(m => m.name === poll.created_by)

                        return (
                            <div key={poll.id} className="pixel-box" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
                                    <h3 className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 20, margin: 0, flex: 1, lineHeight: 1.4 }}>{poll.question.toUpperCase()}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 20 }}>{creator?.avatar ? <img src={creator.avatar} alt="avatar" style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: '50%' }} /> : (creator?.emoji || '👤')}</span>
                                        <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 12 }}>{creator?.nickname || poll.created_by}</span>
                                        <span className="pixel-text" style={{ color: 'var(--color-secondary)', fontSize: 12 }}>· {total} VOTES</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {(poll.options || []).map((option, idx) => {
                                        const optVotes = getOptionVotes(poll.id, idx)
                                        const pct = total > 0 ? Math.round((optVotes / total) * 100) : 0
                                        const isMyChoice = myVote === idx
                                        const color = COLORS[idx % COLORS.length]
                                        const voters = votes[poll.id]?.[idx] || []

                                        return (
                                            <button key={idx} onClick={() => castVote(poll.id, idx)} style={{
                                                position: 'relative', padding: '16px 20px',
                                                border: isMyChoice ? `4px solid var(--color-primary)` : '4px solid var(--color-primary)',
                                                background: 'white', cursor: user ? 'pointer' : 'default',
                                                textAlign: 'left', overflow: 'hidden',
                                                transition: 'transform 0.1s, box-shadow 0.1s',
                                                boxShadow: isMyChoice ? 'inset 0 0 0 4px var(--accent-yellow)' : '4px 4px 0px rgba(0,0,0,0.1)',
                                                transform: 'translate(0px, 0px)',
                                            }}
                                                onMouseEnter={e => {
                                                    if (user) {
                                                        e.currentTarget.style.transform = 'translate(-2px, -2px)'
                                                        e.currentTarget.style.boxShadow = isMyChoice ? 'inset 0 0 0 4px var(--accent-yellow), 6px 6px 0px rgba(0,0,0,0.1)' : '6px 6px 0px rgba(0,0,0,0.1)';
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    if (user) {
                                                        e.currentTarget.style.transform = 'translate(0px, 0px)'
                                                        e.currentTarget.style.boxShadow = isMyChoice ? 'inset 0 0 0 4px var(--accent-yellow), 4px 4px 0px rgba(0,0,0,0.1)' : '4px 4px 0px rgba(0,0,0,0.1)';
                                                    }
                                                }}>
                                                {/* Progress fill */}
                                                <div style={{
                                                    position: 'absolute', inset: 0,
                                                    width: `${pct}%`, background: color, opacity: 0.2,
                                                    transition: 'width 0.5s ease',
                                                }} />
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        {isMyChoice && <span style={{ fontSize: 16 }}>✅</span>}
                                                        <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14 }}>{option.toUpperCase()}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                        {/* Voter avatars */}
                                                        <div style={{ display: 'flex', gap: -6 }}>
                                                            {voters.slice(0, 4).map(vName => {
                                                                const vm = MEMBERS.find(m => m.name === vName)
                                                                return (
                                                                    <span key={vName} style={{ fontSize: 18, filter: 'drop-shadow(2px 2px 0px var(--color-primary))' }} title={vm?.nickname}>{vm?.avatar ? <img src={vm.avatar} alt="avatar" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: '50%' }} /> : (vm?.emoji || '👤')}</span>
                                                                )
                                                            })}
                                                        </div>
                                                        <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, minWidth: 48, textAlign: 'right' }}>{pct}%</span>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}