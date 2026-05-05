"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentInfo () {

    const supabase = await createClient();

    const {data , error} = await supabase
    .from('students')
    .select('*')
    .eq('id', "0121775459");

    return data;
}