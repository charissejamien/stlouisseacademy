"use server";

import { createClient } from "@/lib/supabase/server";

export interface RFIDLookupResult {
    success: boolean;
    formattedName: string; // E.g., "ALAGBAY, NAIAH CELESTINE T."
}

/**
 * Looks up an RFID tag ID in the database and returns the matching student's details.
 */
export async function lookupStudentByRFID(rfidTagId: string): Promise<RFIDLookupResult> {
    const supabase = await createClient();
    const cleanTag = rfidTagId.trim();

    const { data: student, error } = await supabase
        .from("students")
        .select("first_name, middle_name, last_name")
        .eq("rfid", cleanTag)
        .maybeSingle();

    if (error) {
        console.error("Database query error inside lookupStudentByRFID:", error);
        throw new Error(`Database error: ${error.message}`);
    }

    if (!student) {
        throw new Error("Unknown Card: No student linked to this RFID tag.");
    }

    // Format name parts: LASTNAME, FIRSTNAME MIDDLE_INITIAL.
    const lastNameUpper = (student.last_name || "").toUpperCase().trim();
    const firstNameUpper = (student.first_name || "").toUpperCase().trim();
    
    let middleInitial = "";
    if (student.middle_name) {
        middleInitial = ` ${student.middle_name.trim().charAt(0).toUpperCase()}.`;
    }

    const formattedName = `${lastNameUpper}, ${firstNameUpper}${middleInitial}`;

    return {
        success: true,
        formattedName, // 🔄 Matches frontend expectations
    };
}