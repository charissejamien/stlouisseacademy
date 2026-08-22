"use server"

import { createClient } from "@/lib/supabase/server"

import { getActiveSchoolYear } from "@/app/actions";

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

export async function getStudentsCount() {

    const supabase = await createClient();

    const activeSchoolYear = await getActiveSchoolYear();

    const{ data , error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("school_year_id", activeSchoolYear);

    if (error) {
        throw new Error(error.message)
    }

    return data;

}