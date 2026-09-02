"use server";

import { createClient } from "@/lib/supabase/server";

export async function getParents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parents")
    .select("id, first_name, middle_name, last_name, email, contact_number")
    .order("last_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getStudentsWithoutParents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select("id, first_name, middle_name, last_name")
    .is("parent_id", null)
    .order("last_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function linkStudentToParent(studentId: string, parentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("students")
    .update({
      parent_id: parentId,
    })
    .eq("id", studentId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
