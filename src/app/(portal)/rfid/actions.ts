"use server";

import { createClient } from "@/lib/supabase/server";

export interface RFIDLookupResult {
    success: boolean;
    formattedName: string;
    logType: "IN" | "OUT";
}

/**
 * Looks up a student by their text rfid number, determines IN/OUT status, and creates an attendance log entry.
 */
export async function lookupStudentByRFID(rfidTagId: string): Promise<RFIDLookupResult> {
    const supabase = await createClient();
    const cleanTag = rfidTagId.trim();

    if (!cleanTag) {
        throw new Error("Invalid scan payload.");
    }

    // 🎯 1. FIND THE STUDENT BY THE TEXT RFID COLUMN (e.g., "0121693700")
    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, first_name, middle_name, last_name")
        .eq("rfid", cleanTag)
        .maybeSingle();

    if (studentError) {
        console.error("Database query error inside lookupStudentByRFID:", studentError);
        throw new Error(`Database error: ${studentError.message}`);
    }

    if (!student) {
        throw new Error("Unknown Card: No student profile linked to this card number.");
    }

    // 🎯 2. DETERMINE AUTOMATIC LOG DIRECTION (IN vs OUT) FOR TODAY
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: latestLog, error: logError } = await supabase
        .from("attendance_logs")
        .select("log_type")
        .eq("student_id", student.id)
        .gte("scanned_at", startOfToday.toISOString())
        .order("scanned_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (logError) {
        console.error("Error checking today's directional log parameters:", logError);
        throw new Error("Failed to process transaction routing values.");
    }

    // If their last tap today was an IN, make this an OUT. Otherwise, it's an IN.
    const determinedLogType: "IN" | "OUT" = latestLog?.log_type === "IN" ? "OUT" : "IN";

    // 🎯 3. SAVE THE ATTENDANCE RECORD PERMANENTLY TO YOUR ATTENDANCE_LOGS TABLE
    const { error: insertError } = await supabase
        .from("attendance_logs")
        .insert({
            student_id: student.id,
            log_type: determinedLogType,
            is_offline_capture: false
        });

    if (insertError) {
        console.error("Failed to commit attendance log record entry:", insertError);
        throw new Error(`Failed to log timestamp: ${insertError.message}`);
    }

    // Format legal presentation names uppercase layout structures
    const lastNameUpper = (student.last_name || "").toUpperCase().trim();
    const firstNameUpper = (student.first_name || "").toUpperCase().trim();
    
    let middleInitial = "";
    if (student.middle_name) {
        middleInitial = ` ${student.middle_name.trim().charAt(0).toUpperCase()}.`;
    }

    return {
        success: true,
        formattedName: `${lastNameUpper}, ${firstNameUpper}${middleInitial}`,
        logType: determinedLogType
    };
}