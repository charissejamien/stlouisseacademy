"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateStudentId() {

    const year = new Date().getFullYear().toString();

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select("student_id")
        .like("student_id", `${year}%`)
        .order("student_id", { ascending: false })
        .limit(1);

    if (error) {
        throw error;
    }

    let nextNumber = 1;
 
    if (data && data.length > 0) {

        const latestId = data[0].student_id;
        const latestNumber = parseInt(latestId.slice(4));
        nextNumber = latestNumber + 1;
    }

    const paddedNumber = String(nextNumber).padStart(4, "0");

    return `${year}${paddedNumber}`;
}

export async function enrollStudent(firstName: string, middleName: string, lastName: string, gradeLevel: string, studentType: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('students')
    .insert({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        grade_level: gradeLevel,
        student_type: studentType
    })

    if (error) {
        throw new Error(error.message)
    }
    
}


export async function getActiveSchoolYear() {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from('school_years')
    .select('*')
    .eq('is_active', true)

    if(error) {
        throw new Error(error.message);
    }

    return data
}


export async function registerParent(
    firstName: string,
    middleName: string,
    lastName:string,
    email:string,
    contactNumber:string
    ) 
{
    const supabase = await createClient();

    const {data,error} = await supabase
    .from('parents')
    .insert({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        contact_number: contactNumber
    })
    .select()
    .single()

    if (error) {
        throw new Error(error.message)
    }

    return data;
}

export async function getParents() {
    const supabase = await createClient();

    const {data,error} = await supabase
    .from('parents')
    .select('*')

    if (error) {
        throw new Error(error.message)
    }

    return data
}

