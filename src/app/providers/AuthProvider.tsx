import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type AuthData = {
    session: Session | null;
    loading: boolean;
    profile: any;
    isAdmin: boolean;
};


const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    isAdmin: false
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    // useEffect(() => {
    //     let authListener: any;

    //     const fetchSession = async () => {
    //         const { data: { session } } = await supabase.auth.getSession()
    //         setSession(session);


    //         if (session) {
    //             const { data } = await supabase
    //                 .from('profiles')
    //                 .select('*')
    //                 .eq('id', session.user.id)
    //                 .single();
    //             setProfile(data || null)
    //         }
    //         setLoading(false);
    //     }
    //     fetchSession();
    //     supabase.auth.onAuthStateChange((_event, session) => { setSession(session) })

    // }, [])
    useEffect(() => {
        let authListener: any;

        const load = async () => {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            // Load profile
            if (session) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();
                setProfile(data || null);
            }

            setLoading(false);

            // Setup listener with unsubscribe
            authListener = supabase.auth.onAuthStateChange(
                async (_event, newSession) => {
                    setSession(newSession);

                    if (newSession) {
                        const { data } = await supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", newSession.user.id)
                            .single();

                        setProfile(data || null);
                    } else {
                        setProfile(null);
                    }
                }
            );
        };

        load();

        // Cleanup to prevent infinite loops
        return () => {
            if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    return <AuthContext.Provider value={{ session, loading, profile, isAdmin: profile?.group === "ADMIN" }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);