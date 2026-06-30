"use server";

import { createClient } from "@/lib/supabase/server";



export async function saveSchoolYear(startYear: string, endYear: string) {
    const supabase = await createClient();

    // 1. Find the most recent school year in your database to use as a template template
    const { data: previousYear } = await supabase
        .from("school_years")
        .select("id")
        .order("start_year", { ascending: false })
        .limit(1)
        .maybeSingle();

    // 2. Insert the brand new school year row
    const { data: newYear, error: syError } = await supabase
        .from("school_years")
        .insert({
            start_year: startYear.trim(),
            end_year: endYear.trim(),
            is_active: false // Keep it false until you intentionally turn the toggle switch ON
        })
        .select("id")
        .single();

    if (syError) throw new Error(`Failed to create school year: ${syError.message}`);

    // 3. 🚀 THE AUTO-ROLLOVER MATCH: If you have an old year, copy its fee settings forward
    if (previousYear) {
        // Fetch the tuition parameters tied to the previous school year row id
        const { data: oldFees } = await supabase
            .from("academic_year_fees") // Ensure this table name matches your Supabase layout
            .select("grade_level_id, tuition_amount, miscellaneous_amount")
            .eq("school_year_id", previousYear.id);

        if (oldFees && oldFees.length > 0) {
            // Re-map the exact same fee rows but point them to the new school year row id
            const rolledFees = oldFees.map(fee => ({
                school_year_id: newYear.id,
                grade_level_id: fee.grade_level_id,
                tuition_amount: fee.tuition_amount,
                miscellaneous_amount: fee.miscellaneous_amount
            }));

            // Insert the duplicated fees matrix straight into your ledger schema
            const { error: cloneError } = await supabase
                .from("academic_year_fees")
                .insert(rolledFees);

            if (cloneError) {
                console.error("School year created, but fee rollover encountered a fault:", cloneError);
            }
        }
    }

    return { success: true };
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
    .select("*")
    .order("grade_level", {ascending: false})

    if (error) {
        throw new Error(error.message)
    }

    return data
}



{/* Books Actions */}
export async function saveBookFee(gradeLevel: string, amount: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('books')
    .insert({
        grade_level: gradeLevel,
        amount: parseFloat(amount)
    })
    .select("*");

    if (error) {
        return {success:false, message:error.message};
    }
    
    return {success:true, message:"Successfully Configured!"};
}

export async function updateBookFee(id: string, amount: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('books')
    .update({
        amount: parseFloat(amount)
    })
    .eq("id", id)

    if (error) {
        throw new Error(error.message)
    }

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

export async function deleteBookFee(id: string) {
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
export async function saveTuitionFee(
    gradeLevel: string, 
    baseTuition: number, 
    miscellaneous: number, 
    totalTuition: number, 
    entranceFee: number
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tuition_fees')
        .insert({
            grade_level: gradeLevel,
            base_tuition: baseTuition,
            miscellaneous: miscellaneous,
            total_tuition: totalTuition,
            entrance_fee: entranceFee,
        })
        .select();

    if (error) {
        throw new Error(error.message);
    }   

    return data;
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

{/* Other Fees Actions */}
export async function saveOtherFee(category: string, feeName: string, feeAmount: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('other_fees')
    .insert({
        category: category,
        name: feeName,
        amount: parseFloat(feeAmount),
    });

    if (error) {
        throw new Error(error.message);
    }
}

export async function getOtherFees() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('other_fees')
    .select('*');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}

{/* Merchandise Actions */}
type SizePrice = {
    size: string;
    price: string;
};

export async function saveMerchandise(
    merchandiseName: string,
    unit: string,
    hasSizes: boolean,
    sizes: SizePrice[]
    ) {
    const supabase = await createClient();

    const { data: merchandise, error: merchandiseError } = await supabase
        .from("merchandise")
        .insert({
        name: merchandiseName,
        unit,
        has_sizes: hasSizes,
        })
        .select()
        .single();

    if (merchandiseError) {
        throw new Error(merchandiseError.message);
    }

    if (hasSizes && sizes.length > 0) {

        const sizeRows = sizes.map((s) => ({
            product_id: merchandise.id,
            size: s.size,
            price: parseFloat(s.price),
        }));

        const { error: sizeError } = await supabase
        .from("merchandise_sizes")
        .insert(sizeRows);

        if (sizeError) {
        throw new Error(sizeError.message);
        }
    }
}

export async function getMerchandise() {
    const supabase = await createClient();

    const {data , error} = await supabase
    .from('merchandise')
    .select(`*, merchandise_sizes (*)`);

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

export async function deleteVariant(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("merchandise_sizes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

{/* Discounts Actions */}
export async function saveDiscount(name: string, category: string, amount: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("discounts")
        .insert({
            name: name,
            category: category,
            amount: parseFloat(amount)
        });
    if (error) throw new Error(error.message);
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

export async function updateDiscount(id: string, amount: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('discounts')
    .update({
        amount: parseFloat(amount)
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

export async function getSubsidies() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('category', 'Subsidy');

    if (error) {
        throw new Error(error.message)
    }
    
    return data
}


export async function saveSubsidy(name: string, amount: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("discounts")
        .insert({
            name: name,
            category: "Subsidy",
            amount: parseFloat(amount)
        });
        
    if (error) throw new Error(error.message);
}



export interface ExpenseCategoryRecord {
    id: string;
    name: string;
    keywords: string;
}

// ==========================================
// EXPENSE CATEGORIES SMART RULES OPERATIONS
// ==========================================

export async function getExpenseCategories(): Promise<ExpenseCategoryRecord[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("expenses_categories")
        .select("id, name, keywords")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function saveExpenseCategory(name: string, keywords: string): Promise<void> {
    if (!name || !name.trim()) throw new Error("Category name cannot be empty.");
    const supabase = await createClient();
    const { error } = await supabase
        .from("expenses_categories")
        .insert({
            name: name.trim(),
            keywords: keywords.toLowerCase().trim()
        });

    if (error) {
        if (error.code === "23505") throw new Error(`The category "${name}" already exists.`);
        throw new Error(error.message);
    }
}

export async function updateExpenseCategory(id: string, name: string, keywords: string): Promise<void> {
    if (!id) throw new Error("Missing targeted category reference mapping.");
    const supabase = await createClient();
    const { error } = await supabase
        .from("expenses_categories")
        .update({
            name: name.trim(),
            keywords: keywords.toLowerCase().trim()
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
}

export async function deleteExpenseCategory(id: string): Promise<void> {
    if (!id) throw new Error("Missing deletion row reference.");
    const supabase = await createClient();
    const { error } = await supabase
        .from("expenses_categories")
        .delete()
        .eq("id", id);

    if (error) {
        if (error.code === "23503") throw new Error("Cannot delete this category because it has logged expenses linked to it.");
        throw new Error(error.message);
    }
}





