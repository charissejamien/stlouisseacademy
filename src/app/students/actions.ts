"use server";

import { createClient } from "@/lib/supabase/server";


export async function getClassList() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('students')
    .select('*')

    if (error) {
        console.log(error.message);
    }

    return data;
}


type Student = {
    student_id: string;
    first_name: string;
    last_name: string;
};


export async function getStudentProfile(
    id: string
): Promise<Student | null> {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("student_id", id)
        .single();

    if (error) {
        console.log(error.message);
        return null;
    }

    console.log("ID from params:", id);

    return data;
}