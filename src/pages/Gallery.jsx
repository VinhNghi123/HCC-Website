import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import { MEMBERS } from '../lib/members'

export default function Gallery() {
    const { user, profile } = useAuth()
    const [photos, setPhotos] = useState([])
    const [uploading, setUploading] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [caption, setCaption] = useState('')
    const fileRef = useRef()

    useEffect(() => { fetchPhotos() }, [])

    const fetchPhotos = async () => {
        const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
        if (data) setPhotos(data)
    }

    const uploadPhoto = async (e) => {
        if (!user) return alert('Please sign in first!')
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`

        const { data: uploadData, error: uploadError } = await supabase.storage.from('photos').upload(path, file)
        if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return }

        const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)

        await supabase.from('photos').insert({
            url: publicUrl,
            path,
            caption: caption || null,
            uploaded_by: profile?.member_name || user.email,
            user_id: user.id,
        })

        setCaption('')
        setUploading(false)
        fetchPhotos()
    }

    const deletePhoto = async (photo) => {
        if (photo.user_id !== user?.id) return alert("You can only delete your own photos!")
        if (!confirm('Delete this photo?')) return
        await supabase.storage.from('photos').remove([photo.path])
        await supabase.from('photos').delete().eq('id', photo.id)
        setSelectedPhoto(null)
        fetchPhotos()
    }

    const memberData = MEMBERS.find(m => m.name === (profile?.member_name || user?.user_metadata?.member_name))

    return (
        <div style={{ paddingBottom: '4rem', padding: '2rem' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ color: 'var(--accent-red)', textShadow: '4px 4px 0px var(--color-primary)', fontSize: 40, margin: '0 0 8px' }}>
                        🖼️ MEMORY GALLERY
                    </h1>
                    <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 24, fontWeight: 600, background: 'var(--bg-secondary)', border: '4px solid var(--color-primary)', padding: '12px', boxShadow: '4px 4px 0px var(--color-primary)' }}>
                        Relive the epic moments together
                    </p>
                </div>

                {/* Upload area */}
                {user && (
                    <div className="pixel-box" style={{
                        padding: '1.5rem', marginBottom: '3rem',
                        display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 48, height: 48,
                                background: memberData?.color || 'var(--accent-yellow)',
                                border: '4px solid var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 24, boxShadow: '4px 4px 0px var(--color-primary)'
                            }}>{memberData?.avatar ? <img src={memberData.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : (memberData?.emoji || '📷')}</div>
                            <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14 }}>{memberData?.nickname || 'YOU'}</span>
                        </div>
                        <input
                            type="text" value={caption} onChange={e => setCaption(e.target.value)}
                            placeholder="ADD A CAPTION... (OPTIONAL)"
                            className="pixel-body"
                            style={{
                                flex: 1, padding: '12px 16px',
                                background: 'white', border: '4px solid var(--color-primary)',
                                color: 'var(--color-primary)', fontSize: 18, outline: 'none',
                                minWidth: 200, boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1)',
                                textTransform: 'uppercase',
                            }}
                        />
                        <input type="file" ref={fileRef} onChange={uploadPhoto} accept="image/*" style={{ display: 'none' }} />
                        <button onClick={() => fileRef.current.click()} disabled={uploading} style={{
                            opacity: uploading ? 0.7 : 1, pointerEvents: uploading ? 'none' : 'auto'
                        }}>
                            {uploading ? 'LOADING...' : 'UPLOAD PHOTO 📸'}
                        </button>
                    </div>
                )}

                {/* Photos grid */}
                {photos.length === 0 ? (
                    <div className="pixel-box" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-primary)' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
                        <p className="pixel-text" style={{ fontSize: 18 }}>NO MEMORIES YET! BE THE FIRST TO UPLOAD.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                        {photos.map(photo => {
                            const uploader = MEMBERS.find(m => m.name === photo.uploaded_by)
                            return (
                                <div key={photo.id} className="pixel-box" onClick={() => setSelectedPhoto(photo)} style={{
                                    cursor: 'pointer', transition: 'all 0.1s', display: 'flex', flexDirection: 'column'
                                }}>
                                    <div style={{ aspectRatio: '1', overflow: 'hidden', borderBottom: '4px solid var(--color-primary)' }}>
                                        <img src={photo.url} alt={photo.caption || 'Memory'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '12px', background: 'var(--accent-yellow)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {photo.caption && <p className="pixel-body" style={{ color: 'var(--color-primary)', fontSize: 18, margin: '0 0 12px', fontWeight: 600, textTransform: 'uppercase' }}>"{photo.caption}"</p>}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                                            <span style={{ fontSize: 18 }}>{uploader?.avatar ? <img src={uploader.avatar} alt="avatar" style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: '50%' }} /> : (uploader?.emoji || '👤')}</span>
                                            <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14 }}>{uploader?.nickname || photo.uploaded_by}</span>
                                            <span className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 14, marginLeft: 'auto', opacity: 0.7 }}>
                                                {new Date(photo.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Lightbox */}
                {selectedPhoto && (
                    <div onClick={() => setSelectedPhoto(null)} style={{
                        position: 'fixed', inset: 0, background: 'rgba(26, 26, 46, 0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, padding: '2rem',
                    }}>
                        <div onClick={e => e.stopPropagation()} className="pixel-box" style={{ maxWidth: 800, width: '100%', padding: '16px', background: 'var(--accent-yellow)' }}>
                            <div style={{ border: '4px solid var(--color-primary)', background: 'black', padding: '4px' }}>
                                <img src={selectedPhoto.url} alt={selectedPhoto.caption} style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                                <div>
                                    {selectedPhoto.caption && <p className="pixel-text" style={{ color: 'var(--color-primary)', margin: '0 0 8px' }}>"{selectedPhoto.caption}"</p>}
                                    <p className="pixel-text" style={{ color: 'var(--color-primary)', fontSize: 16, margin: 0 }}>BY {selectedPhoto.uploaded_by}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    {user?.id === selectedPhoto.user_id && (
                                        <button onClick={() => deletePhoto(selectedPhoto)} style={{
                                            background: 'var(--accent-red)',
                                        }}>DELETE</button>
                                    )}
                                    <button onClick={() => setSelectedPhoto(null)}>CLOSE</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}