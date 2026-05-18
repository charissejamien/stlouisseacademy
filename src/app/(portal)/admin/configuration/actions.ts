"use server";

import { createClient } from "@/lib/supabase/server";



{/* School Year Actions*/}
export async function saveSchoolYear(startYear: string, endYear: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('school_years')
    .insert([{
        start_year: startYear,
        end_year: endYear,
    }]);

    if (error) {
        throw new Error (error.message);
    }
}

export async function getSchoolYears() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('school_years')
    .select('*');

    if (error) {
        throw new Error (error.message);
    }

    return data
}


{/* Grade Levels Actions*/}
export async function saveGradeLevel(category: string, level: string) {
    const supabase = await createClient();


    const {error} = await supabase
    .from('grade_levels')
    .insert([{
        grade_level : level,
        grade_category : category,
    }])
    .select("*");

    if (error) {
        return {success:false, message:error.message};
    }
    
    return {success:true, message:"Successfully Configured!"};
}

export async function getGradeLevels() {
    const supabase = await createClient();


    const {error} = await supabase
    .from('grade_levels')
    .select("*");

    if (error) {
        return {success:false, message:error.message};
    }
    
    return {success:true, message:"Successfully Configured!"};
}



{/* Books Actions */}
export async function saveBookFee(gradeLevel: string, amount: number) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('books')
    .insert({
        grade_level: gradeLevel,
        amount: amount
    })
    .select("*");

    if (error) {
        return {success:false, message:error.message};
    }
    
    return {success:true, message:"Successfully Configured!"};
}

export async function getBookFee() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('books')
    .select('*');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

export async function deleteBookFee(id: number) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('books')
    .delete()
    .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

{/* Tuition Fee Actions */}
export async function saveTuitionFee(gradeLevel: string, baseTuition: number, miscellaneous: number, totalTuition: number) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('books')
    .insert({
        grade_level: gradeLevel,
        base_tuition: baseTuition,
        miscellaneous : miscellaneous,
        total_tuition: totalTuition,
    });

    if (error) {
       throw new Error (error.message);
    }   
}


export async function getTuitionFees() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('tuition_fees')
    .select('*');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

export async function updateTuitionFee(
    id: number,
    baseTuition: number,
    miscellaneous: number,
    totalTuition: number
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('tuition_fees')
        .update({
            base_tuition: baseTuition,
            miscellaneous: miscellaneous,
            total_tuition: totalTuition,
        })
        .eq('id', id); 

    if (error) {
        throw new Error(error.message);
    }
}




