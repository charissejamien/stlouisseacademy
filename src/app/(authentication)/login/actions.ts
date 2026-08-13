"use server"

import { createClient } from "@/lib/supabase/server"

export async function signInWithPassword(email: string, password: string) {
    
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) {
        throw new Error(error.message)
    }
}