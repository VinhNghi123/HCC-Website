import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user.id)
            else setProfile(null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId) => {
        const { data, error: selectError } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
        console.log('fetchProfile - select result:', { data, selectError })
        if (data) {
            setProfile(data)
        } else {
            // No profile row yet — backfill from auth metadata
            const { data: { user } } = await supabase.auth.getUser()
            console.log('fetchProfile - user metadata:', user?.user_metadata)
            const memberName = user?.user_metadata?.member_name
            if (memberName) {
                const { data: newProfile, error: upsertError } = await supabase
                    .from('profiles')
                    .upsert({ id: userId, member_name: memberName })
                    .select()
                    .maybeSingle()
                console.log('fetchProfile - upsert result:', { newProfile, upsertError })
                if (!upsertError && newProfile) setProfile(newProfile)
            } else {
                console.log('fetchProfile - no member_name in metadata!')
            }
        }
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
    }

    const signUp = async (email, password, memberName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { member_name: memberName } }
        })

        // Explicitly create the profile row so it appears in the profiles table.
        // supabase.auth.signUp does NOT auto-insert profiles — we must do it here.
        if (!error && data?.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                member_name: memberName,
            })
            if (profileError) console.error('Profile insert error:', profileError)
        }

        return { data, error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)