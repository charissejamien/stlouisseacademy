"use server";

import { createClient } from "@/lib/supabase/server";

{/* Enrollment Actions */}


{/* Student Information Actions */}
export async function getSchoolYears() {

    const supabase = await createClient();

    const { data, error } = await supabase
    .from("school_years")
    .select("*")

    if (error) {
        throw new Error (error.message)
    }

    return data;
}

export async function getGradeLevels() {

    const supabase = await createClient();

    const { data, error } = await supabase
    .from("grade_levels")
    .select("*")
    .order("order_index", {ascending:true})

    if (error) {
        throw new Error (error.message)
    }

    return data;
}




{/* Parent Information Actions */}




{/* Fee Settlement Actions */}