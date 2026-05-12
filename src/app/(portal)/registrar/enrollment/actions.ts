"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function enrollStudent(state: {success:boolean, message:string}, formData:FormData) {

    const supabase = await createClient();

    const firstName = formData.get("firstName") as string;
    const middleName = formData.get("middleName");
    const lastName = formData.get("lastName");
    const gender = formData.get("gender");
    const gradeLevel = formData.get("gradeLevel");
    const parent = formData.get("parent");
    const dateOfBirth = formData.get("dob");

    const totalTuition = formData.get("totalTuition");

    const studentId = await generateStudentId();
    const isEscRecipient = formData.get("escRecipient") === "on";


    if(!firstName.trim()) {
        return {success:false, message:"Fill out fields"}
    }

    const {error: studentError} = await supabase
    .from('students')
    .insert([{
        first_name : firstName,
        middle_name : middleName,
        last_name : lastName,
        gender : gender,
        date_of_birth : dateOfBirth === "" ? null : dateOfBirth,
        grade_level : gradeLevel,
        parent : parent,
        student_id : studentId,
        esc_recipient : isEscRecipient
    }]);

    if (studentError) {
        return {success:false, message:studentError.message}
    }

    const {error: accountCardError} = await supabase
    .from('student_account_card')
    .insert([{
        student_id: studentId,
        total_tuition_fee: totalTuition
    }]);
    

    if (accountCardError) {
        return {success:false, message:accountCardError.message}
    }

    revalidatePath('registrar/enrollment');
    return {success:true, message:"Student Enrolled"}
}

export async function getTuitionFees() {
    const supabase = await createClient();

    const {data, error} = await supabase
    .from('tuition_fees')
    .select('*')

    if (error) {
        console.log(error.message)
    }

    return data || [];
}


export async function getDiscounts() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('discounts')
    .select('*')

    if(error) {
        console.log(error.message)
    }

    return data || [];
}

export async function getBooksFees() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('books')
    .select('*')

    if(error) {
        console.log(error.message)
    }

    return data || [];
}

