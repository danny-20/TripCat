import { supabase } from "@/lib/supabase";
import { createContext, PropsWithChildren, useEffect } from "react";

type AuthData = {

};
const AuthContext = createContext<AuthData>({});

export default function AuthProvider({ children }: PropsWithChildren) {

    useEffect(() => {
        const fetchSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            console.log(data)
        }
        console.log("Auth provider is mounted")

    }, [])

    return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}