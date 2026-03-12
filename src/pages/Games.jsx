import { useState, useRef, useEffect } from 'react'
import { MEMBERS } from '../lib/members'

// ─────────────────────────────────────────────────────────────────────────────
// GAME 1: RANDOM MEMBER PICKER
// ─────────────────────────────────────────────────────────────────────────────
function RandomPicker() {
    const [spinning, setSpinning] = useState(false)
    const [displayMember, setDisplayMember] = useState(null)
    const [result, setResult] = useState(null)
    const timerRef = useRef(null)

    const spin = () => {
        if (spinning) return
        setSpinning(true)
        setResult(null)
        let count = 0
        const totalTicks = 25 + Math.floor(Math.random() * 15)

        const tick = () => {
            const idx = Math.floor(Math.random() * MEMBERS.length)
            setDisplayMember(MEMBERS[idx])
            count++
            if (count < totalTicks) {
                const delay = 50 + Math.pow(count / totalTicks, 2) * 450
                timerRef.current = setTimeout(tick, delay)
            } else {
                const finalIdx = Math.floor(Math.random() * MEMBERS.length)
                const winner = MEMBERS[finalIdx]
                setDisplayMember(winner)
                setResult(winner)
                setSpinning(false)
            }
        }
        tick()
    }

    return (
        <div style={{ padding: '1rem 0' }}>
            {/* Spin display */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {displayMember ? (
                    <div style={{
                        background: result ? displayMember.color : 'var(--bg-secondary)',
                        border: '4px solid var(--color-primary)',
                        boxShadow: result ? '10px 10px 0 var(--color-primary)' : '6px 6px 0 var(--color-primary)',
                        padding: '1.5rem 3rem',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        transform: result ? 'scale(1.05)' : 'scale(1)',
                        transition: spinning ? 'none' : 'all 0.3s',
                    }}>
                        <div style={{ width: 88, height: 88, border: '4px solid var(--color-primary)', overflow: 'hidden' }}>
                            <img src={displayMember.avatar} alt={displayMember.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="pixel-text" style={{ fontSize: 32, color: result ? '#fff' : 'var(--color-primary)' }}>
                            {displayMember.emoji} {displayMember.nickname}
                        </div>
                        {result && (
                            <div className="pixel-text" style={{ fontSize: 20, color: '#fff', background: 'rgba(0,0,0,0.25)', padding: '6px 16px' }}>
                                🎉 ĐÃ ĐƯỢC CHỌN! 🎉
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ border: '4px dashed var(--color-secondary)', padding: '2.5rem 4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: 52 }}>🎲</div>
                        <div className="pixel-text" style={{ fontSize: 20, color: 'var(--color-secondary)', marginTop: 8 }}>Nhấn SPIN!</div>
                    </div>
                )}
            </div>

            {/* Spin button */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={spin}
                    disabled={spinning}
                    style={{
                        padding: '16px 52px', fontSize: 26,
                        fontFamily: 'var(--font-heading)',
                        background: spinning ? 'var(--color-secondary)' : 'var(--accent-yellow)',
                        color: spinning ? '#fff' : 'var(--color-primary)',
                        border: '4px solid var(--color-primary)',
                        boxShadow: spinning ? '2px 2px 0 var(--color-primary)' : '6px 6px 0 var(--color-primary)',
                        cursor: spinning ? 'not-allowed' : 'pointer',
                        transform: spinning ? 'translate(4px, 4px)' : 'none',
                        textTransform: 'uppercase',
                        transition: 'all 0.1s',
                    }}
                >
                    {spinning ? '🎲 ĐANG QUAY...' : '🎲 SPIN!'}
                </button>
            </div>

            {/* Members grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                {MEMBERS.map(m => (
                    <div key={m.id} style={{
                        background: displayMember?.id === m.id ? m.color : 'var(--bg-secondary)',
                        border: '4px solid var(--color-primary)',
                        boxShadow: displayMember?.id === m.id ? '4px 4px 0 var(--color-primary)' : '2px 2px 0 var(--color-primary)',
                        padding: '0.75rem 0.5rem',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        transition: 'background 0.05s',
                    }}>
                        <div style={{ width: 48, height: 48, border: '3px solid var(--color-primary)', overflow: 'hidden' }}>
                            <img src={m.avatar} alt={m.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="pixel-text" style={{
                            fontSize: 13, textAlign: 'center',
                            color: displayMember?.id === m.id ? '#fff' : 'var(--color-primary)',
                        }}>{m.nickname}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME 2: QUẢN LÝ TIỀN BÀI
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const HAND_COLORS = [
    '#FF5757', // red
    '#A855F7', // purple
    '#06B6D4', // cyan
    '#F59E0B', // amber
    '#10B981', // green
    '#EC4899', // pink
    '#8B5CF6', // violet
    '#0EA5E9', // sky
]

function HandCard({ hand, handColor, onAdjust, onReset, onRemove }) {
    const [showHistory, setShowHistory] = useState(false)
    const players = MEMBERS.filter(m => hand.players.includes(m.id))
    const pos = hand.balance > 0
    const neg = hand.balance < 0

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: `4px solid ${handColor}`,
            boxShadow: `6px 6px 0 ${handColor}`,
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{ background: handColor, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pixel-text" style={{ color: '#fff', fontSize: 18 }}>🤚 {hand.name}</span>
                <button onClick={onRemove} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, padding: '0 4px', fontFamily: 'var(--font-heading)' }}>✕</button>
            </div>

            {/* Players */}
            <div style={{ padding: '10px 14px', borderBottom: '3px solid var(--color-primary)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {players.length === 0 ? (
                    <span className="pixel-text" style={{ fontSize: 14, color: 'var(--color-secondary)' }}>Chưa có người chơi</span>
                ) : players.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 30, height: 30, border: '3px solid var(--color-primary)', overflow: 'hidden' }}>
                            <img src={p.avatar} alt={p.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span className="pixel-text" style={{ fontSize: 16, color: p.color }}>{p.nickname}</span>
                    </div>
                ))}
            </div>

            {/* Balance */}
            <div style={{
                padding: '14px', textAlign: 'center',
                borderBottom: '3px solid var(--color-primary)',
                background: pos ? '#7ED95718' : neg ? '#FF575718' : 'transparent',
            }}>
                <div className="pixel-text" style={{
                    fontSize: 40,
                    color: pos ? 'var(--accent-green)' : neg ? 'var(--accent-red)' : 'var(--color-primary)',
                    textShadow: `3px 3px 0 ${pos ? '#388E3C' : neg ? '#B71C1C' : 'var(--color-secondary)'}`,
                    lineHeight: 1,
                }}>
                    {hand.balance > 0 ? '+' : ''}{hand.balance}
                </div>
                <div className="pixel-text" style={{ fontSize: 13, color: 'var(--color-secondary)', marginTop: 4 }}>TỔNG TIỀN</div>
            </div>

            {/* +/- buttons */}
            <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 6 }}>
                    {[5, 2, 1].map(v => (
                        <button key={`+${v}`} onClick={() => onAdjust(v)} style={{
                            padding: '9px 0', fontFamily: 'var(--font-heading)', fontSize: 20,
                            background: 'var(--accent-green)', color: 'var(--color-primary)',
                            border: '3px solid var(--color-primary)', boxShadow: '3px 3px 0 var(--color-primary)',
                            cursor: 'pointer',
                        }}>+{v}</button>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
                    {[5, 2, 1].map(v => (
                        <button key={`-${v}`} onClick={() => onAdjust(-v)} style={{
                            padding: '9px 0', fontFamily: 'var(--font-heading)', fontSize: 20,
                            background: 'var(--accent-red)', color: '#fff',
                            border: '3px solid var(--color-primary)', boxShadow: '3px 3px 0 var(--color-primary)',
                            cursor: 'pointer',
                        }}>-{v}</button>
                    ))}
                </div>

                {/* History toggle + Reset */}
                <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setShowHistory(v => !v)} style={{
                        flex: 1, padding: '7px 0',
                        fontFamily: 'var(--font-heading)', fontSize: 14,
                        background: 'var(--bg-secondary)', color: 'var(--color-primary)',
                        border: '3px solid var(--color-primary)',
                        cursor: 'pointer',
                    }}>📜 LỊCH SỬ ({hand.history.length})</button>
                    <button onClick={onReset} style={{
                        padding: '7px 12px',
                        fontFamily: 'var(--font-heading)', fontSize: 14,
                        background: 'var(--accent-yellow)', color: 'var(--color-primary)',
                        border: '3px solid var(--color-primary)',
                        cursor: 'pointer',
                    }}>↺ RESET</button>
                </div>

                {/* History list */}
                {showHistory && (
                    <div style={{
                        marginTop: 8, maxHeight: 160, overflowY: 'auto',
                        border: '3px solid var(--color-primary)',
                        background: '#fff',
                    }}>
                        {hand.history.length === 0 ? (
                            <div style={{ padding: '8px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--color-secondary)' }}>Chưa có giao dịch</div>
                        ) : [...hand.history].reverse().map((entry, i) => (
                            <div key={i} style={{
                                padding: '5px 10px', display: 'flex', justifyContent: 'space-between',
                                borderBottom: '1px solid #eee',
                                fontFamily: 'var(--font-heading)', fontSize: 15,
                            }}>
                                <span style={{ color: entry.amount > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 'bold' }}>
                                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                                </span>
                                <span style={{ color: 'var(--color-secondary)' }}>{entry.time}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function AddHandForm({ table, onUpdate, onClose }) {
    const [handName, setHandName] = useState('')
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const takenPlayerIds = table.hands.flatMap(h => h.players)

    const togglePlayer = (id) => {
        setSelectedPlayers(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : prev.length < 2 ? [...prev, id] : prev
        )
    }

    const submit = () => {
        if (!handName.trim()) return
        const newHand = { id: uid(), name: handName.trim(), players: selectedPlayers, balance: 0, history: [] }
        onUpdate({ ...table, hands: [...table.hands, newHand] })
        onClose()
    }

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: '4px solid var(--color-primary)',
            boxShadow: '6px 6px 0 var(--color-primary)',
            padding: '1rem',
        }}>
            <div className="pixel-text" style={{ fontSize: 16, marginBottom: 6 }}>TÊN TAY:</div>
            <input
                value={handName}
                onChange={e => setHandName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="VD: Tay 1, Tay 2..."
                autoFocus
                style={{
                    width: '100%', padding: '8px 10px',
                    fontFamily: 'var(--font-heading)', fontSize: 18,
                    border: '3px solid var(--color-primary)', marginBottom: 12,
                    boxSizing: 'border-box', outline: 'none', background: '#fff',
                }}
            />
            <div className="pixel-text" style={{ fontSize: 16, marginBottom: 8 }}>
                NGƯỜI CHƠI ({selectedPlayers.length}/2):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {MEMBERS.map(m => {
                    const taken = takenPlayerIds.includes(m.id)
                    const selected = selectedPlayers.includes(m.id)
                    const disabled = !selected && (taken || selectedPlayers.length >= 2)
                    return (
                        <button
                            key={m.id}
                            onClick={() => !disabled && togglePlayer(m.id)}
                            style={{
                                padding: '5px 10px',
                                fontFamily: 'var(--font-heading)', fontSize: 15,
                                background: selected ? m.color : taken ? '#ddd' : 'var(--bg-secondary)',
                                color: selected ? '#fff' : taken ? '#999' : 'var(--color-primary)',
                                border: '2px solid var(--color-primary)',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                opacity: disabled && !selected ? 0.5 : 1,
                            }}
                        >{m.nickname}{taken && !selected ? ' ✓' : ''}</button>
                    )
                })}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={submit} disabled={!handName.trim()} style={{
                    flex: 1, padding: '9px 0', fontFamily: 'var(--font-heading)', fontSize: 17,
                    background: 'var(--accent-green)', color: 'var(--color-primary)',
                    border: '3px solid var(--color-primary)', boxShadow: '3px 3px 0 var(--color-primary)',
                    cursor: handName.trim() ? 'pointer' : 'not-allowed',
                }}>✓ THÊM TAY</button>
                <button onClick={onClose} style={{
                    flex: 1, padding: '9px 0', fontFamily: 'var(--font-heading)', fontSize: 17,
                    background: 'var(--accent-red)', color: '#fff',
                    border: '3px solid var(--color-primary)', boxShadow: '3px 3px 0 var(--color-primary)',
                    cursor: 'pointer',
                }}>✕ HỦY</button>
            </div>
        </div>
    )
}

function TableView({ table, onUpdate, onDelete }) {
    const [addingHand, setAddingHand] = useState(false)

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <h3 className="pixel-text" style={{ fontSize: 26, margin: 0 }}>🃏 {table.name}</h3>
                <span className="pixel-text" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>
                    {table.hands.length} tay
                </span>
                <button onClick={onDelete} style={{
                    marginLeft: 'auto', padding: '6px 14px', fontSize: 16,
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--accent-red)', color: '#fff',
                    border: '4px solid var(--color-primary)', boxShadow: '3px 3px 0 var(--color-primary)',
                    cursor: 'pointer',
                }}>🗑 XÓA BÀN</button>
            </div>

            {/* Hands grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16, marginBottom: '1.5rem' }}>
                {table.hands.map((hand, idx) => (
                    <HandCard
                        key={hand.id}
                        hand={hand}
                        handColor={HAND_COLORS[idx % HAND_COLORS.length]}
                        onAdjust={(amount) => onUpdate(t => ({
                            ...t,
                            hands: t.hands.map(h => h.id === hand.id
                                ? { ...h, balance: h.balance + amount, history: [...h.history, { amount, time: new Date().toLocaleTimeString('vi-VN') }] }
                                : h
                            )
                        }))}
                        onReset={() => onUpdate(t => ({
                            ...t,
                            hands: t.hands.map(h => h.id === hand.id ? { ...h, balance: 0, history: [] } : h)
                        }))}
                        onRemove={() => onUpdate(t => ({ ...t, hands: t.hands.filter(h => h.id !== hand.id) }))}
                    />
                ))}
                {/* Add hand button or form */}
                {addingHand ? (
                    <AddHandForm table={table} onUpdate={onUpdate} onClose={() => setAddingHand(false)} />
                ) : (
                    <button onClick={() => setAddingHand(true)} style={{
                        border: '4px dashed var(--color-secondary)', background: 'transparent',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '2rem', gap: 10, minHeight: 200,
                    }}>
                        <span style={{ fontSize: 40 }}>➕</span>
                        <span className="pixel-text" style={{ fontSize: 18, color: 'var(--color-secondary)' }}>THÊM TAY</span>
                    </button>
                )}
            </div>

            {/* Summary bar */}
            {table.hands.length > 0 && (
                <div style={{
                    background: 'var(--accent-purple)',
                    border: '4px solid var(--color-primary)',
                    boxShadow: '6px 6px 0 var(--color-primary)',
                    padding: '1rem 1.5rem',
                }}>
                    <div className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 18, marginBottom: 10 }}>
                        📊 TỔNG KẾT BÀN
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {table.hands.map((hand, idx) => {
                            const players = MEMBERS.filter(m => hand.players.includes(m.id))
                            const pos = hand.balance > 0
                            const neg = hand.balance < 0
                            const chipColor = HAND_COLORS[idx % HAND_COLORS.length]
                            return (
                                <div key={hand.id} style={{
                                    background: pos ? 'var(--accent-green)' : neg ? 'var(--accent-red)' : chipColor,
                                    padding: '8px 16px',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    border: '3px solid var(--color-primary)',
                                    boxShadow: '3px 3px 0 var(--color-primary)',
                                }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {players.map(p => (
                                            <div key={p.id} style={{ width: 26, height: 26, border: '2px solid rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                                                <img src={p.avatar} alt={p.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="pixel-text" style={{ fontSize: 15, color: '#fff' }}>
                                        {players.length > 0 ? players.map(p => p.nickname).join(' & ') : hand.name}
                                    </span>
                                    <span className="pixel-text" style={{ fontSize: 22, color: '#fff', fontWeight: 900 }}>
                                        {hand.balance > 0 ? '+' : ''}{hand.balance}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function MoneyGame() {
    const [tables, setTables] = useState(() => {
        try {
            const saved = localStorage.getItem('hcc-money-tables')
            return saved ? JSON.parse(saved) : []
        } catch { return [] }
    })
    const [newTableName, setNewTableName] = useState('')
    const [selectedTableId, setSelectedTableId] = useState(
        () => localStorage.getItem('hcc-money-selected') || null
    )

    useEffect(() => {
        localStorage.setItem('hcc-money-tables', JSON.stringify(tables))
    }, [tables])

    useEffect(() => {
        if (selectedTableId) localStorage.setItem('hcc-money-selected', selectedTableId)
        else localStorage.removeItem('hcc-money-selected')
    }, [selectedTableId])

    const createTable = () => {
        if (!newTableName.trim()) return
        const t = { id: uid(), name: newTableName.trim(), hands: [] }
        setTables(prev => [...prev, t])
        setNewTableName('')
        setSelectedTableId(t.id)
    }

    const deleteTable = (id) => {
        setTables(prev => prev.filter(t => t.id !== id))
        if (selectedTableId === id) setSelectedTableId(null)
    }

    const updateTable = (tableOrFn) => {
        setTables(prev => prev.map(t => {
            if (t.id !== selectedTableId) return t
            return typeof tableOrFn === 'function' ? tableOrFn(t) : tableOrFn
        }))
    }

    const table = tables.find(t => t.id === selectedTableId)

    return (
        <div style={{ padding: '1rem 0' }}>
            {/* Create table form */}
            <div style={{
                background: '#fff',
                border: '4px solid var(--color-primary)',
                boxShadow: '6px 6px 0 var(--color-primary)',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
            }}>
                <div className="pixel-text" style={{ fontSize: 18 }}>TẠO BÀN MỚI:</div>
                <input
                    value={newTableName}
                    onChange={e => setNewTableName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createTable()}
                    placeholder="Tên bàn..."
                    style={{
                        flex: 1, minWidth: 140, padding: '8px 12px',
                        fontFamily: 'var(--font-heading)', fontSize: 18,
                        border: '4px solid var(--color-primary)', background: 'var(--bg-secondary)',
                        outline: 'none',
                    }}
                />
                <button onClick={createTable} disabled={!newTableName.trim()} style={{
                    padding: '10px 20px', fontSize: 18,
                    fontFamily: 'var(--font-heading)',
                    background: 'var(--accent-green)', color: 'var(--color-primary)',
                    border: '4px solid var(--color-primary)', boxShadow: '4px 4px 0 var(--color-primary)',
                    cursor: newTableName.trim() ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase',
                }}>+ TẠO</button>
            </div>

            {/* Table tabs */}
            {tables.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {tables.map(t => (
                        <button key={t.id} onClick={() => setSelectedTableId(t.id)} style={{
                            padding: '9px 18px', fontSize: 18,
                            fontFamily: 'var(--font-heading)',
                            background: selectedTableId === t.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                            color: 'var(--color-primary)',
                            border: '4px solid var(--color-primary)',
                            boxShadow: selectedTableId === t.id ? '4px 4px 0 var(--color-primary)' : '2px 2px 0 var(--color-primary)',
                            cursor: 'pointer', textTransform: 'uppercase',
                            transition: 'all 0.1s',
                        }}>🃏 {t.name}</button>
                    ))}
                </div>
            )}

            {/* Table content */}
            {table ? (
                <TableView
                    table={table}
                    onUpdate={updateTable}
                    onDelete={() => deleteTable(table.id)}
                />
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', border: '4px dashed var(--color-secondary)' }}>
                    <div style={{ fontSize: 52 }}>🃏</div>
                    <div className="pixel-text" style={{ fontSize: 20, color: 'var(--color-secondary)', marginTop: 8 }}>
                        {tables.length === 0 ? 'Tạo một bàn để bắt đầu!' : 'Chọn một bàn để xem'}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GAMES PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Games() {
    const [activeGame, setActiveGame] = useState('picker')

    const games = [
        { id: 'picker', label: '🎲 Chọn Ngẫu Nhiên', desc: 'Spin để chọn thành viên ngẫu nhiên' },
        { id: 'money', label: '🃏 Quản Lý Tiền Bài', desc: 'Theo dõi tiền thắng thua' },
    ]

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Page header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="pixel-text" style={{
                    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                    color: 'var(--color-primary)',
                    textShadow: '6px 6px 0px var(--accent-yellow)',
                    marginBottom: '0.25rem',
                }}>🎮 GAMES</h1>
                <p className="pixel-body" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>
                    HCC Mini Games Collection
                </p>
            </div>

            {/* Game selector tabs */}
            <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {games.map(g => (
                    <button key={g.id} onClick={() => setActiveGame(g.id)} style={{
                        padding: '12px 24px', fontSize: 20,
                        fontFamily: 'var(--font-heading)',
                        background: activeGame === g.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                        color: 'var(--color-primary)',
                        border: '4px solid var(--color-primary)',
                        boxShadow: activeGame === g.id ? '6px 6px 0 var(--color-primary)' : '3px 3px 0 var(--color-primary)',
                        cursor: 'pointer', textTransform: 'uppercase',
                        transition: 'all 0.1s',
                    }}>
                        {g.label}
                    </button>
                ))}
            </div>

            {/* Active game panel */}
            <div style={{
                background: 'var(--bg-secondary)',
                border: '4px solid var(--color-primary)',
                boxShadow: '8px 8px 0 var(--color-primary)',
                padding: '1.5rem',
            }}>
                <div className="pixel-text" style={{ fontSize: 14, color: 'var(--color-secondary)', marginBottom: '1rem', borderBottom: '3px dashed var(--color-primary)', paddingBottom: '0.75rem' }}>
                    {games.find(g => g.id === activeGame)?.desc}
                </div>
                {activeGame === 'picker' ? <RandomPicker /> : <MoneyGame />}
            </div>
        </div>
    )
}
