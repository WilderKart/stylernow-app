"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User } from "@/types/db";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithEmail: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithEmail: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    // Map Supabase Session User to our internal User type
                    setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        role: (session.user.user_metadata.role as any) || 'cliente',
                        created_at: session.user.created_at,
                    });
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signInWithEmail = async (email: string) => {
        // For Dev/Demo purposes, we might still want a quick way to 'simulate' login if backend isn't fully ready with users,
        // BUT the request was strict about replacing mocks.
        // So we will implement the real flow request (Magic Link or Password).
        // For now, let's assume Magic Link as it's default Supabase.

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error("Error signing in:", error);
            throw error;
        }

        // Note: This relies on the user checking their email.
        // To keep the 'Demo' feel for the Auditor without breaking the 'Real Auth' rule, 
        // we would ideally need a pre-seeded user or a password login. 
        // Assuming Password login for consistency with typical 'Login' forms:

        /* 
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: 'example-password', // This would need actual input from the UI
        });
        */
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithEmail, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
