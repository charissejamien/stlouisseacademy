"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text:string) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,"");
}

export async function saveNewFees(state:{success:boolean, message:string}, formData:FormData) {
    const supabase = await createClient();

    const name = formData.get('description')?.toString() || "";
    const category = formData.get('category')
    const amount = formData.get('amount')
    const supabaseId = slugify(name);

    const {error} = await supabase
    .from('fees')
    .insert([{
        name : name,
        category : category,
        amount : amount,
        slug : supabaseId,
    }])

    if (error) {
        return {success:false, message:error.message}
    }

    revalidatePath('/admin/fees')
    return {success:true, message:"success!"}
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