"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentLogDetail {
    id: string;
    log_type: "IN" | "OUT";
    formatted_time: string;
}

export interface MasterListRow {
    student_uuid: string;
    student_id: string;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    grade_level: string;
    status: "IN" | "OUT" | "No Log";
    formatted_time: string;
    all_logs_today: StudentLogDetail[]; // Holds all taps chronologically
}

interface SchoolYearJoin {
    is_active: boolean;
}

interface EnrollmentJoin {
    grade_level: string;
    school_years: SchoolYearJoin | null;
}

interface SupabaseStudentResult {
    id: string;
    student_id: string;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    enrollments: EnrollmentJoin[] | null;
}

interface SupabaseLogResult {
    id: string;
    student_id: string;
    log_type: "IN" | "OUT";
    scanned_at: string;
}

interface MasterAttendanceData {
    students: MasterListRow[];
    gradeLevels: string[];
}

/**
 * FETCH THE ALPHABETICAL MASTER LIST OF STUDENTS WITH MULTIPLE ATTENDANCE LOG TRACKS
 */
export async function getMasterAttendanceList(selectedDate?: string): Promise<MasterAttendanceData> {
    const supabase = await createClient();

    const targetDate = selectedDate ? new Date(selectedDate) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch all students sorted alphabetically
    const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(`
            id,
            student_id,
            first_name,
            last_name,
            gender,
            enrollments (
                grade_level,
                school_years ( is_active )
            )
        `)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });

    if (studentsError) {
        console.error("Error fetching student master list:", studentsError);
        throw new Error(`Failed to load master list: ${studentsError.message}`);
    }

    // 2. Fetch all raw logs chronologically for the day window
    const { data: logsData, error: logsError } = await supabase
        .from("attendance_logs")
        .select("id, student_id, log_type, scanned_at")
        .gte("scanned_at", startOfDay.toISOString())
        .lte("scanned_at", endOfDay.toISOString())
        .order("scanned_at", { ascending: true }); // Chronological order

    if (logsError) {
        console.error("Error fetching logs for the selected date:", logsError);
        throw new Error(`Failed to load attendance logs: ${logsError.message}`);
    }

    // 3. Group logs by student UUID array mapping
    const logsGroupedByStudent: Record<string, SupabaseLogResult[]> = {};
    if (logsData) {
        (logsData as SupabaseLogResult[]).forEach((log) => {
            if (!logsGroupedByStudent[log.student_id]) {
                logsGroupedByStudent[log.student_id] = [];
            }
            logsGroupedByStudent[log.student_id].push(log);
        });
    }

    const typedStudents = (studentsData ?? []) as unknown as SupabaseStudentResult[];
    const gradeLevelsSet = new Set<string>();

    // 4. Transform into cohesive rows with complete log records
    const masterList: MasterListRow[] = typedStudents.map((student) => {
        const activeEnrollment = student.enrollments?.find(
            (e: EnrollmentJoin) => e.school_years?.is_active === true
        ) || student.enrollments?.[0];

        const grade = activeEnrollment?.grade_level ?? "Unassigned";
        if (grade !== "Unassigned") gradeLevelsSet.add(grade);

        const studentLogs = logsGroupedByStudent[student.id] || [];
        
        // Map individual tap items
        const mappedLogs: StudentLogDetail[] = studentLogs.map((l) => ({
            id: l.id,
            log_type: l.log_type,
            formatted_time: new Date(l.scanned_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            })
        }));

        // The absolute latest log determines current display status
        const latestLog = studentLogs[studentLogs.length - 1];

        return {
            student_uuid: student.id,
            student_id: student.student_id ?? "N/A",
            first_name: student.first_name ?? "Unknown",
            last_name: student.last_name ?? "Student",
            gender: student.gender || "Male",
            grade_level: grade,
            status: latestLog ? latestLog.log_type : "No Log",
            formatted_time: latestLog ? new Date(latestLog.scanned_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }) : "--:--",
            all_logs_today: mappedLogs
        };
    });

    return {
        students: masterList,
        gradeLevels: Array.from(gradeLevelsSet).sort()
    };
}