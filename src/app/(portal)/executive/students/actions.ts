"use server";

import { createClient } from "@/lib/supabase/server";

export interface MasterStudentRow {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: string;
    date_added: string;
    grade_level: string;
    student_type: string;
    status: string;
    parent_name: string;
}

export async function getMasterStudentList(): Promise<MasterStudentRow[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            student_id,
            first_name,
            middle_name,
            last_name,
            gender,
            created_at,
            parents (
                first_name,
                last_name
            ),
            enrollments (
                grade_level,
                student_type,
                status,
                school_years (
                    is_active
                )
            )
        `);

    if (error) {
        console.error("Master student list server fetch error:", error);
        throw new Error(`Failed to pull student matrix dataset: ${error.message}`);
    }

    if (!data) return [];

    return data.map((student: any) => {
        const activeEnrollment = student.enrollments?.find(
            (e: any) => e.school_years?.is_active === true
        ) || student.enrollments?.[0];

        const parentProfile = student.parents;
        const compiledParentName = parentProfile
            ? `${parentProfile.first_name} ${parentProfile.last_name}`
            : "Staged (Unlinked)";

        return {
            id: student.id,
            student_id: student.student_id,
            first_name: student.first_name,
            middle_name: student.middle_name,
            last_name: student.last_name,
            gender: student.gender,
            date_added: new Date(student.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            grade_level: activeEnrollment?.grade_level || "Not Assigned",
            student_type: activeEnrollment?.student_type || "Regular",
            status: activeEnrollment?.status || "Staged (Unlinked)",
            parent_name: compiledParentName,
        };
    });
}