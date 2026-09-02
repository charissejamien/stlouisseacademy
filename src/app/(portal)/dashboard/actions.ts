"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: userInfo, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return userInfo;
}

export async function getMyStudents() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: parent, error: parentError } = await supabase
    .from("parents")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (parentError) {
    throw new Error(parentError.message);
  }

  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select(
      `
    id,
    student_id,
    first_name,
    middle_name,
    last_name,
    enrollments (
      id,
      school_year_id,
      grade_level,
      school_years (
        id,
        is_active
      )
    )
  `,
    )
    .eq("parent_id", parent.id)
    .order("last_name", { ascending: true });

  if (studentsError) {
    throw new Error(studentsError.message);
  }

  return students;
}
