"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";


export async function saveSchoolFee(state:{success:boolean, message:string}, formData:FormData) {
    const supabase = await createClient();

    const category = formData.get("category");
    const gradeLevel = formData.get("gradeLevel");
    const entranceFee = formData.get("entranceFee");
    const baseTuition = formData.get("baseTuition");
    const miscellaneous = formData.get("miscellaneous");
    const totalTuition = formData.get("totalTuition");

    const {error} = await supabase
    .from('tuition_fees')
    .insert([{
        grade_level : gradeLevel,
        grade_category : category,
        entrance_fee : entranceFee,
        base_tuition : baseTuition,
        miscellaneous : miscellaneous,
        total_tuition : totalTuition
    }]);

    if (error) {
        return {success:false, message:error.message};
    }

    return {success:true, message:"Successfully Configured!"};
}

export async function getFees () {
    
    const supabase = await createClient();

    const {data, error} = await supabase
    .from('fees')
    .select('*');

    if (error) {
        console.log(error.message);
    }

    return data;
}


export async function updateFee(formData:FormData){
    const supabase = await createClient();

    const description = formData.get("description");
    const amount = formData.get("amount");

    const {error} = await supabase
    .from('fees')
    .update({description, amount})

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/admin/fees"); 
    return { success: true, message: "Fee updated!" };
}

export async function deleteFee(id: string) {
    const supabase = await createClient();

    const {error} = await supabase
    .from('fees')
    .delete()
    .eq("id", id);


    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('admin/fees');
}


export async function saveDiscount(state: {success:boolean, message:string}, formData:FormData) {
    const supabase = await createClient();

    const name = formData.get("description");
    const amount = formData.get("amount");
    const category = formData.get("category")

    const {error} = await supabase
    .from('discounts')
    .insert([{
        name : name,
        amount : amount,
        category : category
    }]);

    if (error) {
        return {success:false, message: error.message}
    }

    return {success:true, message: "Discount posted!"}

}

export async function getDiscount() {
    const supabase = await createClient();


    const {data , error} = await supabase
    .from('discounts')
    .select('*');

    if (error) {
        console.log(error.message);
    }

    return data;
}


export async function saveGradeLevelConfiguration(state:{success:boolean, message:string}, formData:FormData) {
    const supabase = await createClient();

    const category = formData.get("category");
    const gradeLevel = formData.get("gradeLevel");

    const {error} = await supabase
    .from('grade_levels')
    .insert([{
        grade_level : gradeLevel,
        grade_category : category,
    }]);

    if (error) {
        return {success:false, message:error.message};
    }
    
    return {success:true, message:"Successfully Configured!"};
}