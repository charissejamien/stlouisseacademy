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
    .select('*')
    .order("start_year", { ascending: true })

    if (error) {
        throw new Error (error.message);
    }

    return data
}

export async function deleteSchoolYear(id: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('school_years')
    .delete()
    .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}

export async function handleSchoolYearChange( id: string, checked: boolean) {
    const supabase = await createClient()

    if (!checked) {
    const { error } = await supabase
        .from("school_years")
        .update({
        is_active: false,
        })
        .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

    return
    }

    const { error: resetError } = await supabase
    .from("school_years")
    .update({
        is_active: false,
    })
    .not("id", "is", null)

    if (resetError) {
    throw new Error(resetError.message)
    }

    const { error: activeError } = await supabase
    .from("school_years")
    .update({
        is_active: true,
    })
    .eq("id", id)

    if (activeError) {
        throw new Error(activeError.message)
    }
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


    const {data , error} = await supabase
    .from('grade_levels')
    .select("*");

    if (error) {
        throw new Error(error.message)
    }

    return data
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



{/* Merchandise Actions */}
export async function saveMerchandise (merchandiseName: string, unit: string, price: number, hasSizes: boolean) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('merchandise')
    .insert({
        name: merchandiseName,
        unit: unit,
        price: price,
        has_sizes: hasSizes
    });

    if (error) {
        throw new Error (error.message);
    }
}

export async function getMerchandise() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('merchandise')
    .select('*');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

export async function deleteMerchandise(id: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('merchandise')
    .delete()
    .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}

{/* Discounts Actions */}
export async function saveDiscount (name: string, category: string, amount: number) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('discounts')
    .insert({
        name: name,
        category: category,
        amount: amount
    });

    if (error) {
        throw new Error (error.message);
    }
}

export async function getDiscounts() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('discounts')
    .select('*');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

export async function updateDiscount(id: string, amount: number) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('discounts')
    .update({
        amount: amount
    })
    .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}

export async function deleteDiscount(id: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('discounts')
    .delete()
    .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}




