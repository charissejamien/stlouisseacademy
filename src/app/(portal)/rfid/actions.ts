"use server";

import { createClient } from "@/lib/supabase/server";

export interface RFIDLookupResult {
    success: boolean;
    formattedName: string;
    logType: "IN" | "OUT";
    profileUrl: string | null;
    roleType: "STUDENT" | "EMPLOYEE";
}

interface AttendanceInsertPayload {
    log_type: "IN" | "OUT";
    is_offline_capture: boolean;
    student_id?: string;
    employee_id_uuid?: string;
}

export async function lookupStudentByRFID(rfidTagId: string): Promise<RFIDLookupResult> {
    const supabase = await createClient();
    const cleanTag = rfidTagId.trim();

    if (!cleanTag) {
        throw new Error("Invalid scan payload.");
    }

    let matchedEntity: { 
        id: string; 
        first_name: string; 
        middle_name: string | null; 
        last_name: string; 
        profile: string | null; 
    } | null = null;
    
    let role: "STUDENT" | "EMPLOYEE" = "STUDENT";

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, first_name, middle_name, last_name, profile")
        .eq("rfid", cleanTag)
        .maybeSingle();

    if (studentError) {
        throw new Error(`Database routing failure: ${studentError.message}`);
    }

    if (student) {
        matchedEntity = student;
        role = "STUDENT";
    } else {
        const { data: employee, error: employeeError } = await supabase
            .from("employees")
            .select("id, first_name, middle_name, last_name, profile")
            .eq("rfid", cleanTag)
            .maybeSingle();

        if (employeeError) {
            throw new Error(`Database routing failure: ${employeeError.message}`);
        }

        if (employee) {
            matchedEntity = employee;
            role = "EMPLOYEE";
        }
    }

    if (!matchedEntity) {
        throw new Error("Unknown Card: No registered personnel files linked to this card.");
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const lookupField = role === "STUDENT" ? "student_id" : "employee_id_uuid";

    const { data: latestLog, error: logError } = await supabase
        .from("attendance_logs")
        .select("log_type")
        .eq(lookupField, matchedEntity.id)
        .gte("scanned_at", startOfToday.toISOString())
        .order("scanned_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (logError) {
        throw new Error("Failed to process transaction routing metrics.");
    }

    const determinedLogType: "IN" | "OUT" = latestLog?.log_type === "IN" ? "OUT" : "IN";

    const insertPayload: AttendanceInsertPayload = {
        log_type: determinedLogType,
        is_offline_capture: false,
        ...(role === "STUDENT" 
            ? { student_id: matchedEntity.id } 
            : { employee_id_uuid: matchedEntity.id }
        )
    };

    const { error: insertError } = await supabase
        .from("attendance_logs")
        .insert(insertPayload);

    if (insertError) {
        throw new Error(`Failed to commit log timestamp: ${insertError.message}`);
    }

    const lastNameUpper = (matchedEntity.last_name || "").toUpperCase().trim();
    const firstNameUpper = (matchedEntity.first_name || "").toUpperCase().trim();
    
    let middleInitial = "";
    if (matchedEntity.middle_name) {
        middleInitial = ` ${matchedEntity.middle_name.trim().charAt(0).toUpperCase()}.`;
    }

    return {
        success: true,
        formattedName: `${lastNameUpper}, ${firstNameUpper}${middleInitial}`,
        logType: determinedLogType,
        profileUrl: matchedEntity.profile,
        roleType: role
    };
}