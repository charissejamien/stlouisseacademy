"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAllStudents(gradeLevel? : string) {

    const supabase = await createClient();

    let query = supabase
    .from("students")
    .select(`
        *,
        enrollments!inner (
            *,
            school_years!inner (
                is_active
            )
        )
    `)
    .eq("enrollments.school_years.is_active", true)
    .order("last_name", {ascending: true});

    if (gradeLevel) {
        query = query.eq(
            "enrollments.grade_level",
            gradeLevel
        )
    } 

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}