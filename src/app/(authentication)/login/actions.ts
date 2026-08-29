"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signInWithPassword(
  email: string,
  password: string
) {
  const supabase = await createClient()

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Failed to logout: ${error.message}`)
  }

  redirect("/login")
}