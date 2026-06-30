"use server";

import { createClient } from "@/lib/supabase/server";

export interface EscStudentItem {
    id: string;
    fullName: string;
    enrollmentStatus: string;
    dateEnrolled: string;
    isEsc: boolean;
}

export interface EscGradeGroup {
    gradeLevel: string;
    totalStudents: number;
    totalGrantees: number;
    totalProjectedSubsidy: number;
    students: EscStudentItem[];
}

interface RelationalStudent {
    first_name: string;
    last_name: string;
}

interface EnrollmentRow {
    id: string;
    student_id: string | null;
    grade_level: string | null;
    status: string | null;
    created_at: string | null;
    isESC: boolean | null;
    students: unknown;
}

// Strict Junior High School tracking tracks matching your institutional tiers
const JHS_GRADES = ["7", "8", "9", "10"];

/**
 * Compiles JHS rosters grouped cleanly by grade levels.
 * Automatically defaults unconfigured isESC rows to true (Active Grantee).
 */
export async function getJhsEscGroupedRoster(activeSchoolYearId: string): Promise<Record<string, EscGradeGroup>> {
    const supabase = await createClient();

    // 🎯 1. FORCE THE DATABASE UPDATE FIRST & AWAIT IT COMPLETELY
    // We target variations like "7", "Grade 7", etc., to capture everything
    const targetGradesFilter = [...JHS_GRADES, ...JHS_GRADES.map(g => `Grade ${g}`)];

    const { error: patchError } = await supabase
        .from("enrollments")
        .update({ isESC: true })
        .eq("school_year_id", activeSchoolYearId)
        .is("isESC", null) // Finds all records that are still raw NULL
        .in("grade_level", targetGradesFilter); 

    if (patchError) {
        console.error("Critical: Automatic ESC database batch update failed:", patchError);
    }

    // 🎯 2. FETCH THE FRESH DATA *AFTER* THE UPDATE PROMISE RESOLVES
    const { data, error } = await supabase
        .from("enrollments")
        .select(`
            id,
            student_id,
            grade_level,
            status,
            created_at,
            isESC,
            students (
                first_name,
                last_name
            )
        `)
        .eq("school_year_id", activeSchoolYearId);

    if (error) {
        throw new Error(`Failed to load school roster ledger: ${error.message}`);
    }

    const rawRows = data as unknown as EnrollmentRow[] | null;
    
    const groups: Record<string, EscGradeGroup> = {};
    JHS_GRADES.forEach((grade) => {
        groups[grade] = {
            gradeLevel: `Grade ${grade}`,
            totalStudents: 0,
            totalGrantees: 0,
            totalProjectedSubsidy: 0,
            students: []
        };
    });

    (rawRows || []).forEach((row) => {
        if (!row.student_id || !row.grade_level) return;

        const rawGrade = row.grade_level.toString().trim();
        
        const dynamicLookupKey = JHS_GRADES.find(
            g => g === rawGrade || `grade ${g}`.toLowerCase() === rawGrade.toLowerCase()
        );

        if (!dynamicLookupKey) return; 

        const studentInfo = row.students as RelationalStudent | null;
        const displayLabel = studentInfo ? `${studentInfo.last_name}, ${studentInfo.first_name}` : "Unknown Profile";

        // 🎯 UI Fallback Match: If anything still slipped past the database patch query, 
        // treat it as true on the client interface view.
        const currentEscStatus = row.isESC === null ? true : row.isESC;

        groups[dynamicLookupKey].students.push({
            id: row.id, 
            fullName: displayLabel,
            enrollmentStatus: row.status || "Pending Verification",
            dateEnrolled: row.created_at ? new Date(row.created_at).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }) : "—",
            isEsc: currentEscStatus
        });

        groups[dynamicLookupKey].totalStudents += 1;
        if (currentEscStatus) {
            groups[dynamicLookupKey].totalGrantees += 1;
            groups[dynamicLookupKey].totalProjectedSubsidy += 9000;
        }
    });

    JHS_GRADES.forEach((g) => {
        groups[g].students.sort((a, b) => a.fullName.localeCompare(b.fullName));
    });

    return groups;
}

/**
 * Mutates and overwrites an enrollment record's isESC state flag.
 */
export async function toggleStudentEscStatus(enrollmentId: string, updatedState: boolean): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("enrollments")
        .update({ isESC: updatedState })
        .eq("id", enrollmentId);

    if (error) {
        throw new Error(`Overwriting grant status failed: ${error.message}`);
    }
}