"use server"

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function inviteUserByEmail( email: string ) {

    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/setup-account`,
        }
    )

    if (error) {
        throw new Error (error.message);
    }
}

export async function listUsers() {

    const { data: {users}, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
        throw new Error (error.message);
    }

    return users;
}

