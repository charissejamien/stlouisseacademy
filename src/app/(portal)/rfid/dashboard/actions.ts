"use server";

import { createClient } from "@/lib/supabase/server";

export interface LogDetail {
    id: string;
    log_type: "IN" | "OUT";
    formatted_time: string;
}

export interface MasterListRow {
    uuid: string;
    display_id: string;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    group_label: string;
    status: "IN" | "OUT" | "No Log";
    formatted_time: string;
    all_logs_today: LogDetail[];
}

interface SupabaseLogResult {
    id: string;
    student_id: string | null;
    employee_id_uuid: string | null;
    log_type: "IN" | "OUT";
    scanned_at: string;
}

interface EnrollmentJoin {
    grade_level: string;
    school_years: { is_active: boolean } | null;
}

interface SupabaseStudentResult {
    id: string;
    student_id: string | null;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    enrollments: EnrollmentJoin[] | null;
}

// 🛡️ Strict Join Relations Interfaces for Employees
interface AssignmentJoin {
    department: string;
    school_year_id: string | null;
}

interface SupabaseEmployeeResult {
    id: string;
    employee_id: string | null;
    first_name: string;
    last_name: string;
    gender: "Male" | "Female";
    employee_assignments: AssignmentJoin[] | null;
}

interface MasterAttendanceData {
    students: MasterListRow[];
    employees: MasterListRow[];
    gradeLevels: string[];
    departments: string[];
    metrics: {
        presentStudents: number;
        totalStudents: number;
        presentEmployees: number;
        totalEmployees: number;
    };
}


export async function getMasterAttendanceList(selectedDate?: string): Promise<MasterAttendanceData> {
    const supabase = await createClient();

    const targetDate = selectedDate ? new Date(selectedDate) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch Active School Year Token
    const { data: activeYearData } = await supabase
        .from("school_years")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

    const currentSchoolYearId = activeYearData?.id;

    // 2. Fetch All Students Sorted Alphabetically
    const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(`id, student_id, first_name, last_name, gender, enrollments ( grade_level, school_years ( is_active ) )`)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });

    if (studentsError) throw new Error(`Student fetch failed: ${studentsError.message}`);

    // 3. Fetch All Employees Sorted Alphabetically (Utilizing direct column maps 🛠️)
    const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select(`id, employee_id, first_name, last_name, gender, employee_assignments ( department, school_year_id )`)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });

    if (employeesError) throw new Error(`Employee fetch failed: ${employeesError.message}`);

    // 4. Fetch All Unified Logs for the Current Day Window
    const { data: logsData, error: logsError } = await supabase
        .from("attendance_logs")
        .select("id, student_id, employee_id_uuid, log_type, scanned_at")
        .gte("scanned_at", startOfDay.toISOString())
        .lte("scanned_at", endOfDay.toISOString())
        .order("scanned_at", { ascending: true });

    if (logsError) throw new Error(`Log fetch failed: ${logsError.message}`);

    // Group logs by entity category mapping blocks
    const studentLogsMap: Record<string, SupabaseLogResult[]> = {};
    const employeeLogsMap: Record<string, SupabaseLogResult[]> = {};

    ((logsData as SupabaseLogResult[]) ?? []).forEach((log) => {
        if (log.student_id) {
            if (!studentLogsMap[log.student_id]) studentLogsMap[log.student_id] = [];
            studentLogsMap[log.student_id].push(log);
        } else if (log.employee_id_uuid) {
            if (!employeeLogsMap[log.employee_id_uuid]) employeeLogsMap[log.employee_id_uuid] = [];
            employeeLogsMap[log.employee_id_uuid].push(log);
        }
    });

    const gradeLevelsSet = new Set<string>();
    const departmentsSet = new Set<string>();

    let checkedInStudentsCount = 0;
    let checkedInEmployeesCount = 0;

    const typedStudents = (studentsData ?? []) as unknown as SupabaseStudentResult[];
    const typedEmployees = (employeesData ?? []) as unknown as SupabaseEmployeeResult[];

    // Transform Student Records Into Cohesive Presentation Objects
    const studentsList: MasterListRow[] = typedStudents.map((student) => {
        const activeEnrollment = student.enrollments?.find((e) => e.school_years?.is_active === true) || student.enrollments?.[0];
        const grade = activeEnrollment?.grade_level ?? "Unassigned";
        if (grade !== "Unassigned") gradeLevelsSet.add(grade);

        const sLogs = studentLogsMap[student.id] || [];
        const latestLog = sLogs[sLogs.length - 1];
        if (latestLog?.log_type === "IN") checkedInStudentsCount++;

        return {
            uuid: student.id,
            display_id: student.student_id ?? "N/A",
            first_name: student.first_name,
            last_name: student.last_name,
            gender: student.gender,
            group_label: grade,
            status: latestLog ? latestLog.log_type : "No Log",
            formatted_time: latestLog ? new Date(latestLog.scanned_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "--:--",
            all_logs_today: sLogs.map((l) => ({ 
                id: l.id, 
                log_type: l.log_type, 
                formatted_time: new Date(l.scanned_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }) 
            }))
        };
    });

    // Transform Employee Records Into Cohesive Presentation Objects
    const employeesList: MasterListRow[] = typedEmployees.map((emp) => {
        const assignments = emp.employee_assignments ?? [];
        
        // Isolate historical records by targeting the current active school year string node
        const activeAssignment = assignments.find((a) => a.school_year_id === currentSchoolYearId) || assignments[0];
        const dept = activeAssignment?.department ?? "General Operations";
        if (dept) departmentsSet.add(dept);

        const eLogs = employeeLogsMap[emp.id] || [];
        const latestLog = eLogs[eLogs.length - 1];
        if (latestLog?.log_type === "IN") checkedInEmployeesCount++;

        return {
            uuid: emp.id,
            display_id: emp.employee_id ?? "N/A",
            first_name: emp.first_name,
            last_name: emp.last_name,
            gender: emp.gender,
            group_label: dept,
            status: latestLog ? latestLog.log_type : "No Log",
            formatted_time: latestLog ? new Date(latestLog.scanned_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "--:--",
            all_logs_today: eLogs.map((l) => ({ 
                id: l.id, 
                log_type: l.log_type, 
                formatted_time: new Date(l.scanned_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }) 
            }))
        };
    });

    return {
        students: studentsList,
        employees: employeesList,
        gradeLevels: Array.from(gradeLevelsSet).sort(),
        departments: Array.from(departmentsSet).sort(),
        metrics: {
            presentStudents: checkedInStudentsCount,
            totalStudents: studentsList.length,
            presentEmployees: checkedInEmployeesCount,
            totalEmployees: employeesList.length
        }
    };
}