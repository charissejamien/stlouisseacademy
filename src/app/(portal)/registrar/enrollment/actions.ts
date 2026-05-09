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

export async function enrollStudent(state:{success:boolean, message:string}, formData:FormData) {

    const supabase = await createClient();

    const firstName = formData.get("firstName");
    const middleName = formData.get("middleName");
    const lastName = formData.get("lastName");
    const gender = formData.get("gender");
    const gradeLevel = formData.get("gradeLevel");
    const parent = formData.get("parent");
    const dateOfBirth = formData.get("dob");

    const studentId = await generateStudentId();

    const {error} = await supabase
    .from('students')
    .insert([{
        first_name : firstName,
        middle_name : middleName,
        last_name : lastName,
        gender : gender,
        date_of_birth : dateOfBirth,
        grade_level : gradeLevel,
        parent : parent,
        student_id : studentId
    }])

    if (error) {
        return {success:false, message:error.message}
    }

    return {success:true, message:"Student Enrolled"}
}


export async function getDiscountByCategory(categories: string[]) {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('discounts')
    .select('*')
    .in('category', categories);

    if(error) {
        console.log(error.message)
    }

    return data || [];
}


export async function getFeesByGrade(gradeLevel: string) {
    const supabase = await createClient();

    // 1. Create a map that connects your form values to your DB slugs
    const gradeToSlugMap: Record<string, string> = {
        "nursery": "pre-elementary",
        "preKinder": "pre-elementary",
        "kinder": "pre-elementary",
        "1": "elementary",
        "2": "elementary",
        "3": "elementary",
        "4": "elementary",
        "5": "elementary",
        "6": "elementary",
        "7": "junior-high-school",
        "8": "junior-high-school",
        "9": "junior-high-school",
        "10": "junior-high-school",
    };

    // 2. Translate the grade
    const slug = gradeToSlugMap[gradeLevel];

    if (!slug) {
        console.log("No slug found for grade:", gradeLevel);
        return [];
    }

    // 3. Query using the translated slug
    const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('slug', slug); // Now this will match 'elementary', 'pre-elementary', etc.

    if (error) {
        console.error("Supabase Error:", error.message);
        return [];
    }

    return data;
}