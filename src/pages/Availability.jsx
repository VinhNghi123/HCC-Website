import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MEMBERS } from '../lib/members'
import { useAuth } from '../components/AuthContext'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Availability() {
    const { user, profile } = useAuth()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth())
    const [availabilities, setAvailabilities] = useState({})
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' })
    const [showAddEvent, setShowAddEvent] = useState(false)
    const [savingEvent, setSavingEvent] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)

    const memberName = profile?.member_name || user?.user_metadata?.member_name
    const memberData = MEMBERS.find(m => m.name === memberName)

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    useEffect(() => { fetchAvailabilities() }, [month, year])
    useEffect(() => { fetchEvents() }, [month, year])

    const fetchAvailabilities = async () => {
        const { data } = await supabase.from('availabilities')
            .select('*')
            .gte('date', `${year}-${String(month + 1).padStart(2, '0')}-01`)
            .lte('date', `${year}-${String(month + 1).padStart(2, '0')}-31`)
        if (data) {
            const map = {}
            data.forEach(a => {
                if (!map[a.date]) map[a.date] = []
                map[a.date].push(a.member_name)
            })
            setAvailabilities(map)
        }
    }

    const fetchEvents = async () => {
        const { data } = await supabase.from('events')
            .select('*')
            .gte('date', `${year}-${String(month + 1).padStart(2, '0')}-01`)
            .lte('date', `${year}-${String(month + 1).padStart(2, '0')}-31`)
            .order('date', { ascending: true })
        if (data) setEvents(data)
    }

    const toggleDay = async (day) => {
        setSelectedDay(prev => prev === day ? prev : day)
        if (!user || !memberName) return alert('Please sign in first!')
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const myName = memberName
        const alreadyAvailable = availabilities[dateStr]?.includes(myName)

        if (alreadyAvailable) {
            await supabase.from('availabilities').delete().eq('date', dateStr).eq('member_name', myName)
        } else {
            await supabase.from('availabilities').insert({ date: dateStr, member_name: myName, user_id: user.id })
        }
        fetchAvailabilities()
    }

    const saveEvent = async () => {
        if (!newEvent.title || !newEvent.date) return alert('Please fill in the event title and date!')
        setSavingEvent(true)
        const { error } = await supabase.from('events').insert({
            title: newEvent.title,
            date: newEvent.date,
            time: newEvent.time || null,
            created_by: memberName || user?.email,
        })
        setSavingEvent(false)
        if (error) {
            alert('Failed to save event: ' + error.message)
        } else {
            setNewEvent({ title: '', date: '', time: '' })
            setShowAddEvent(false)
            fetchEvents()
        }
    }

    const deleteEvent = async (id) => {
        await supabase.from('events').delete().eq('id', id)
        fetchEvents()
    }

    const getDateKey = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isMyDay = (day) => availabilities[getDateKey(day)]?.includes(memberName)
    const getCount = (day) => availabilities[getDateKey(day)]?.length || 0
    const getAvatarMembers = (day) => {
        const names = availabilities[getDateKey(day)] || []
        return names.map(name => MEMBERS.find(m => m.name === name)).filter(Boolean)
    }
    const getEventsForDay = (day) => events.filter(e => e.date === getDateKey(day))

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        background: '#fff',
        border: '4px solid var(--color-primary)',
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-pixel)',
        fontSize: 14,
        boxSizing: 'border-box',
        outline: 'none',
        boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)'
    }

    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--accent-red)', textShadow: '4px 4px 0px var(--color-primary)', fontSize: 40, margin: '0 0 8px' }}>
                        📅 QUEST PLANNER
                    </h1>
                    <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 24, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '12px', boxShadow: '4px 4px 0px var(--color-primary)' }}>
                        Đánh dấu mọi người đang rảnh ngày nào để đi chơi
                    </p>
                </div>

                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
                    {/* Calendar */}
                    <div className="pixel-box" style={{ padding: '1.5rem' }}>
                        {/* Month nav */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <button onClick={() => {
                                if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
                            }} style={{ padding: '8px 16px' }}>&lt;</button>
                            <h2 style={{ color: 'var(--color-primary)', fontSize: 24, margin: 0, textShadow: '2px 2px 0px var(--accent-yellow)' }}>{MONTHS[month].toUpperCase()} {year}</h2>
                            <button onClick={() => {
                                if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
                            }} style={{ padding: '8px 16px' }}>&gt;</button>
                        </div>

                        {/* Day labels */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
                            {DAYS.map(d => <div key={d} className="pixel-text" style={{ textAlign: 'center', color: 'var(--color-primary)', fontSize: 12, padding: '4px 0' }}>{d}</div>)}
                        </div>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array(daysInMonth).fill(null).map((_, i) => {
                                const day = i + 1
                                const count = getCount(day)
                                const isMe = isMyDay(day)
                                const today = new Date()
                                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
                                const dayEvents = getEventsForDay(day)
                                const hasEvent = dayEvents.length > 0
                                const actualBg = isMe ? 'var(--accent-yellow)' : count > 0 ? 'var(--accent-green)' : 'var(--bg-secondary)';

                                const avatarMembers = getAvatarMembers(day)
                                return (
                                    <button key={day} onClick={() => toggleDay(day)} style={{
                                        minHeight: 64,
                                        border: hasEvent ? '4px solid var(--accent-red)' : '4px solid var(--color-primary)',
                                        background: actualBg, cursor: 'pointer', position: 'relative',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                                        padding: '4px 2px',
                                        gap: 2,
                                        boxShadow: isToday ? 'inset 0 0 0 3px var(--accent-red)' : hasEvent ? '0 0 0 2px var(--accent-red)' : 'none',
                                        opacity: count === 0 && !isMe ? 0.9 : 1
                                    }}>
                                        <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14, lineHeight: 1 }}>{day}</span>
                                        {/* Event badge */}
                                        {hasEvent && (
                                            <span style={{
                                                fontSize: 8,
                                                background: 'var(--accent-red)',
                                                color: '#fff',
                                                padding: '1px 3px',
                                                borderRadius: 2,
                                                lineHeight: 1.3,
                                                fontFamily: 'var(--font-pixel)',
                                                maxWidth: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                ★ {dayEvents[0].title.length > 6 ? dayEvents[0].title.slice(0, 6) + '…' : dayEvents[0].title}
                                            </span>
                                        )}
                                        {count > 0 && (
                                            <span className="pixel-text" style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>{count}/{MEMBERS.length}</span>
                                        )}
                                        {avatarMembers.length > 0 && (() => {
                                            const MAX = 3
                                            const shown = avatarMembers.slice(0, MAX)
                                            const overflow = avatarMembers.length - MAX
                                            return (
                                                <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', gap: 1, marginTop: 1 }}>
                                                    {shown.map((m) => (
                                                        <img
                                                            key={m.id}
                                                            src={m.avatar}
                                                            alt={m.nickname}
                                                            title={m.nickname}
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: '50%',
                                                                border: `2px solid ${m.color || 'var(--color-primary)'}`,
                                                                objectFit: 'cover',
                                                                imageRendering: 'pixelated',
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                    ))}
                                                    {overflow > 0 && (
                                                        <span style={{
                                                            fontSize: 9,
                                                            fontFamily: 'var(--font-pixel)',
                                                            background: 'var(--color-primary)',
                                                            color: '#fff',
                                                            borderRadius: 2,
                                                            padding: '1px 3px',
                                                            lineHeight: 1.4,
                                                            flexShrink: 0,
                                                        }}>+{overflow}</span>
                                                    )}
                                                </div>
                                            )
                                        })()}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 16, marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[
                                { color: 'var(--accent-yellow)', label: "YOU'RE FREE" },
                                { color: 'var(--accent-green)', label: 'OTHERS FREE' },
                                { color: 'var(--accent-red)', label: 'EVENT DAY', border: true },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 20, height: 20, background: l.border ? 'var(--bg-secondary)' : l.color, border: `4px solid ${l.border ? l.color : 'var(--color-primary)'}` }} />
                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 10 }}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
                        {/* Events panel */}
                        <div className="pixel-box" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Window Header */}
                            <div style={{ background: 'var(--accent-red)', padding: '12px 16px', borderBottom: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 className="pixel-text" style={{ color: '#fff', fontSize: 18, textShadow: '2px 2px 0px var(--color-primary)', margin: 0 }}>
                                    ★ EVENTS
                                </h3>
                                {user && (
                                    <button
                                        onClick={() => setShowAddEvent(v => !v)}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: 12,
                                            background: showAddEvent ? 'var(--bg-secondary)' : '#fff',
                                            color: 'var(--color-primary)',
                                            border: '4px solid var(--color-primary)',
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-pixel)',
                                            boxShadow: '2px 2px 0px var(--color-primary)'
                                        }}
                                    >
                                        {showAddEvent ? '✕ CANCEL' : '+ ADD'}
                                    </button>
                                )}
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {/* Add event form */}
                                {showAddEvent && user && (
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--accent-yellow)', border: '4px solid var(--color-primary)', padding: 16, boxShadow: '4px 4px 0px var(--color-primary)' }}>
                                        <h4 className="pixel-text" style={{ margin: '0 0 4px 0', fontSize: 14, color: 'var(--color-primary)' }}>NEW EVENT</h4>
                                        <input
                                            style={inputStyle}
                                            placeholder="Event title..."
                                            value={newEvent.title}
                                            onChange={e => setNewEvent(v => ({ ...v, title: e.target.value }))}
                                        />
                                        <input
                                            type="date"
                                            style={inputStyle}
                                            value={newEvent.date}
                                            onChange={e => setNewEvent(v => ({ ...v, date: e.target.value }))}
                                        />
                                        <input
                                            type="time"
                                            style={inputStyle}
                                            value={newEvent.time}
                                            onChange={e => setNewEvent(v => ({ ...v, time: e.target.value }))}
                                            placeholder="Time (optional)"
                                        />
                                        <button
                                            onClick={saveEvent}
                                            disabled={savingEvent}
                                            style={{
                                                marginTop: '8px',
                                                padding: '12px',
                                                background: 'var(--accent-green)',
                                                color: '#fff',
                                                border: '4px solid var(--color-primary)',
                                                cursor: 'pointer',
                                                fontFamily: 'var(--font-pixel)',
                                                fontSize: 14,
                                                boxShadow: '4px 4px 0px var(--color-primary)',
                                                textShadow: '2px 2px 0px var(--color-primary)'
                                            }}
                                        >
                                            {savingEvent ? 'SAVING...' : '💾 SAVE EVENT'}
                                        </button>
                                    </div>
                                )}

                                {/* Events list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {events.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-secondary)', border: '4px dashed var(--color-primary)' }}>
                                            <p className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                                                No events this month.<br />Plan something!
                                            </p>
                                        </div>
                                    ) : (
                                        events.map(ev => {
                                            const d = new Date(ev.date + 'T00:00:00')
                                            const dayNum = d.getDate()
                                            const dayName = DAYS[d.getDay()]
                                            return (
                                                <div key={ev.id} style={{ border: '4px solid var(--color-primary)', padding: '12px', background: '#fff', position: 'relative', boxShadow: '4px 4px 0px var(--accent-red)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                                                                {ev.title}
                                                            </span>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-pixel)' }}>
                                                                    {dayName} {MONTHS[month].slice(0, 3)} {dayNum}
                                                                </span>
                                                                {ev.time && (
                                                                    <span style={{ fontSize: 13, fontFamily: 'var(--font-pixel)', color: 'var(--color-primary)' }}>
                                                                        ⏰ {ev.time.slice(0, 5)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {user && (
                                                            <button
                                                                onClick={() => deleteEvent(ev.id)}
                                                                style={{ background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 14, padding: '4px 8px', lineHeight: 1, fontFamily: 'var(--font-pixel)', marginLeft: 12 }}
                                                                title="Delete event"
                                                            >✕</button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Who's available */}
                        <div className="pixel-box" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ background: 'var(--accent-purple)', padding: '12px 16px', borderBottom: '4px solid var(--color-primary)' }}>
                                <h3 className="pixel-text" style={{ color: '#fff', fontSize: 18, textShadow: '2px 2px 0px var(--color-primary)', margin: 0, textAlign: 'center' }}>
                                    🧑‍🤝‍🧑 AVAILABLE
                                </h3>
                            </div>

                            <div style={{ padding: '1.5rem', background: '#fff' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {MEMBERS.map(m => {
                                        const hasDays = Object.values(availabilities).some(names => names.includes(m.name))
                                        return (
                                            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: 12, padding: hasDays ? '8px' : '4px 8px', background: hasDays ? 'var(--bg-primary)' : 'transparent', border: hasDays ? '4px solid var(--color-primary)' : '4px solid transparent', transition: 'all 0.2s' }}>
                                                {/* Member Avatar instead of just checkbox */}
                                                <img
                                                    src={m.avatar}
                                                    alt={m.nickname}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        border: `3px solid ${hasDays ? (m.color || 'var(--accent-yellow)') : '#ccc'}`,
                                                        objectFit: 'cover',
                                                        imageRendering: 'pixelated',
                                                        opacity: hasDays ? 1 : 0.4
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14, opacity: hasDays ? 1 : 0.4 }}>{m.nickname.toUpperCase()}</span>
                                                </div>
                                                <div style={{
                                                    width: 28, height: 28,
                                                    background: hasDays ? 'var(--accent-green)' : 'var(--bg-secondary)',
                                                    border: '4px solid var(--color-primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                                                    color: '#fff',
                                                    textShadow: '2px 2px 0 var(--color-primary)'
                                                }}>{hasDays ? '✓' : ''}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {!user && (
                            <div className="pixel-box" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--accent-yellow)' }}>
                                <p className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                                    INSERT COIN TO MARK YOUR AVAILABILITY! ⚡
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Availability Graph ── */}
                <div className="pixel-box" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ background: 'var(--accent-green)', padding: '12px 16px', borderBottom: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 className="pixel-text" style={{ color: '#fff', fontSize: 18, textShadow: '2px 2px 0px var(--color-primary)', margin: 0 }}>
                            📊 PARTY METER — {MONTHS[month].toUpperCase()} {year}
                        </h3>
                        {selectedDay && (
                            <button
                                onClick={() => setSelectedDay(null)}
                                style={{ background: '#fff', border: '3px solid var(--color-primary)', padding: '4px 10px', fontFamily: 'var(--font-pixel)', fontSize: 11, cursor: 'pointer', color: 'var(--color-primary)', boxShadow: '2px 2px 0 var(--color-primary)' }}
                            >✕ CLOSE</button>
                        )}
                    </div>

                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        {/* Selected day detail panel */}
                        {selectedDay && (() => {
                            const dateKey = getDateKey(selectedDay)
                            const availableNames = availabilities[dateKey] || []
                            const count = availableNames.length
                            const dayEvents = getEventsForDay(selectedDay)
                            return (
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', boxShadow: '4px 4px 0 var(--color-primary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                        <span className="pixel-text" style={{ fontSize: 16, color: 'var(--color-primary)' }}>
                                            {MONTHS[month].slice(0, 3).toUpperCase()} {selectedDay} — {count}/{MEMBERS.length} FREE
                                        </span>
                                        {dayEvents.map(ev => (
                                            <span key={ev.id} style={{ background: 'var(--accent-red)', color: '#fff', padding: '4px 10px', fontFamily: 'var(--font-pixel)', fontSize: 12, border: '2px solid var(--color-primary)' }}>
                                                ★ {ev.title}{ev.time ? ` @ ${ev.time.slice(0, 5)}` : ''}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        {MEMBERS.map(m => {
                                            const isAvail = availableNames.includes(m.name)
                                            return (
                                                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: isAvail ? 1 : 0.25, transition: 'opacity 0.15s' }}>
                                                    <img src={m.avatar} alt={m.nickname} style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${isAvail ? m.color : '#ccc'}`, objectFit: 'cover', imageRendering: 'pixelated' }} />
                                                    <span style={{ fontSize: 9, fontFamily: 'var(--font-pixel)', color: 'var(--color-primary)' }}>{m.nickname}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {count === 0 && (
                                        <p className="pixel-text" style={{ margin: '0.5rem 0 0', fontSize: 12, color: 'var(--color-primary)', opacity: 0.6 }}>No one marked free this day yet.</p>
                                    )}
                                </div>
                            )
                        })()}

                        {/* Bar chart */}
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                            {/* Y-axis */}
                            <div style={{ display: 'flex', flexDirection: 'column-reverse', marginRight: 4, flexShrink: 0, gap: 1 }}>
                                {Array(MEMBERS.length + 1).fill(null).map((_, i) => (
                                    <div key={i} style={{ height: 12, display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--font-pixel)', color: 'var(--color-primary)', lineHeight: 1 }}>{i}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Day columns */}
                            <div style={{ flex: 1, display: 'flex', gap: 2 }}>
                                {Array(daysInMonth).fill(null).map((_, i) => {
                                    const day = i + 1
                                    const dateKey = getDateKey(day)
                                    const availableNames = availabilities[dateKey] || []
                                    const dayEvents = getEventsForDay(day)
                                    const hasEvent = dayEvents.length > 0
                                    const isSelected = selectedDay === day

                                    return (
                                        <div
                                            key={day}
                                            onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                                            title={`${MONTHS[month].slice(0, 3)} ${day}: ${availableNames.length}/${MEMBERS.length} free`}
                                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                                        >
                                            {/* Stacked member pixel blocks */}
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column-reverse',
                                                gap: 1,
                                                width: '100%',
                                                outline: isSelected ? '3px solid var(--accent-red)' : hasEvent ? '2px solid var(--accent-red)' : 'none',
                                                outlineOffset: 2,
                                            }}>
                                                {MEMBERS.map(m => {
                                                    const isAvail = availableNames.includes(m.name)
                                                    return (
                                                        <div key={m.id} style={{
                                                            width: '100%',
                                                            height: 12,
                                                            background: isAvail ? m.color : '#e8e8e8',
                                                            border: isAvail ? '1px solid rgba(0,0,0,0.2)' : '1px solid #d0d0d0',
                                                            boxSizing: 'border-box',
                                                            imageRendering: 'pixelated',
                                                        }} />
                                                    )
                                                })}
                                            </div>
                                            {/* Day label */}
                                            <span style={{
                                                fontSize: 7,
                                                fontFamily: 'var(--font-pixel)',
                                                color: isSelected ? 'var(--accent-red)' : hasEvent ? 'var(--accent-red)' : 'var(--color-primary)',
                                                fontWeight: isSelected || hasEvent ? 700 : 400,
                                                lineHeight: 1,
                                            }}>
                                                {day === 1 || day % 5 === 0 || isSelected ? day : '·'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Member color legend */}
                        <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem', flexWrap: 'wrap', borderTop: '4px solid var(--color-primary)', paddingTop: '1rem' }}>
                            {MEMBERS.map(m => (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 14, height: 14, background: m.color, border: '2px solid var(--color-primary)', imageRendering: 'pixelated', flexShrink: 0 }} />
                                    <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 13 }}>{m.nickname.toUpperCase()}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <div style={{ width: 14, height: 14, background: '#e8e8e8', border: '2px solid var(--color-primary)', imageRendering: 'pixelated', flexShrink: 0 }} />
                                <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 13 }}>BUSY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}