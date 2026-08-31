"use server"

import { createClient } from "@/lib/supabase/server";

export async function getClassById(classId: string) {

    const supabase = await createClient();

  const { data, error } = await supabase
    .from("sections")
    .select(`
      id,
      section_name,
      section_code,
      class_size,
      adviser_id,
      grade_level (
        id,
        grade_level,
        grade_category,
        max_students_per_section
      ),
      school_year (
        id,
        start_year,
        end_year,
        is_active
      )
    `)
    .eq("id", classId)
    .single();

  if (error) {
    throw new Error(`Failed to get class: ${error.message}`);
  }

  return data;
}
