"use server"

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function inviteUserByEmail(data: {
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  email: string
  role: string
}) {
  const {
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    role,
  } = data

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm`,
      }
    )

  if (authError) {
    throw new Error(authError.message)
  }

  if (!authData.user) {
    throw new Error(
      "Unable to create the invited user."
    )
  }

  const { error: profileError } =
    await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        suffix: suffix || null,
        role,
      })

  if (profileError) {
    throw new Error(profileError.message)
  }
}

export async function listUsers() {

    const {
        data: { users: authUsers },
        error: authError,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
        throw new Error(authError.message);
    }

    const userIds = authUsers.map((user) => user.id);

    const { data: profiles, error: profileError } = await supabaseAdmin
        .from("users")
        .select("id, first_name, middle_name, last_name, suffix, role")
        .in("id", userIds);

    if (profileError) {
        throw new Error(profileError.message);
    }

    const profileMap = new Map(
        (profiles ?? []).map((profile) => [profile.id, profile])
    );

    return authUsers.map((authUser) => {
        const profile = profileMap.get(authUser.id);

        return {
            id: authUser.id,
            email: authUser.email,
            first_name: profile?.first_name,
            middle_name: profile?.middle_name,
            last_name: profile?.last_name,
            suffix: profile?.suffix,
            role: profile?.role,
            last_sign_in_at: authUser.last_sign_in_at,
            banned_until: authUser.banned_until,
        };
    });
}

export async function disableUser(userId: string) {

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
            ban_duration: "876000h",
        }
    );

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
}

export async function enableUser(userId: string) {

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
            ban_duration: "none",
        }
    );

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
}
