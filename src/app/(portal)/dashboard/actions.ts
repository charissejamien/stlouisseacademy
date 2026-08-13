"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUser() {

    const supabase = await createClient()

    const { data: {user}, error: userError } = await supabase.auth.getUser();

    if (userError || !user ) {
        throw new Error ("Not authenticated");
    }

    const { data: userInfo, error} = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

    if (error) {
        throw new Error (error.message);
    }

    return userInfo;
}