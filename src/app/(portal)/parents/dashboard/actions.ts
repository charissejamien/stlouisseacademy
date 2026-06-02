"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentsByParent(parentId: string) {
    const supabase = await createClient();

    // Pulls all students linked to the target Parent UUID
    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            first_name,
            middle_name,
            last_name,
            enrollments (
                grade_level
            )
        `)
        .eq("parent", parentId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}