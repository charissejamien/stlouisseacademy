"use server";

import { createClient } from "@/lib/supabase/server";

export interface StudentRegistryItem {
    id: string;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    full_name: string;
    grade_level: string;
}

export async function getAllStudentsAlphabetical(): Promise<StudentRegistryItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    if (!data) return [];

    return data.map((student) => {
        // Formats name safely, dropping missing middle names seamlessly
        const nameParts = [student.last_name + ",", student.first_name, student.middle_name];
        const formattedFullName = nameParts.filter(Boolean).join(" ");

        return {
            id: student.id,
            student_id: student.student_id || "N/A",
            first_name: student.first_name || "",
            middle_name: student.middle_name || null,
            last_name: student.last_name || "",
            full_name: formattedFullName,
            grade_level: student.grade_level || "Not Assigned",
        };
    });
}


interface LinkRFIDPayload {
    studentId: string;
    rfidTagId: string;
}

/**
 * Commits a hardware RFID unique tag identifier string to a targeted student row
 */
export async function assignStudentRFID({ studentId, rfidTagId }: LinkRFIDPayload) {
    const supabase = await createClient();

    // First check if this card is already assigned to a different student to prevent mix-ups
    const { data: existingTag } = await supabase
        .from("students")
        .select("id, first_name, last_name")
        .eq("rfid", rfidTagId.trim())
        .maybeSingle();

    if (existingTag && existingTag.id !== studentId) {
        throw new Error(
            `This RFID card is already linked to another active student profile entry.`
        );
    }

    // Update the targeted student profile row
    const { data, error } = await supabase
        .from("students")
        .update({
            rfid: rfidTagId.trim()
        })
        .eq("id", studentId)
        .select();

    if (error) {
        console.error("Database update failed inside assignStudentRFID:", error);
        throw new Error(`Failed to map hardware token parameters: ${error.message}`);
    }

    return { success: true, data };
}