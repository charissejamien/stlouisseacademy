"use server";

import { createClient } from "@/lib/supabase/server";

const fees = [ 
    {name: "tuitionPreElem", label: "Pre Elementary"},
    {name: "tuitionElem", label: "Elementary"},
    {name: "tuitionJHS", label: "Junior High School"},
    {name:"logo", label:"Logo"},
    {name:"upperCloth", label:"Upper Cloth"},
    {name:"lowerCloth", label:"Lower Cloth"},
    {name:"ssgMem", label:"SSG Membership"},
    {name:"studentPub", label:"Student Publication"},
    {name:"ptaMem", label:"PTA Membership"},
];

export interface FeeData {
    description: string;
    amount: number;
}


export async function saveFees(state:{message:string, success:boolean}, formData:FormData ) {

    const supabase = await createClient();

    const feeUpdate = fees.map((fee) => ({
        description: fee.label,
        amount: formData.get(fee.name),
    }));

    const {error} = await supabase
    .from('fees')
    .upsert(feeUpdate);

    if(error) {
        return {success:false, message:error.message};
    }

    return {success:true, message:"Fees Updated!"};

}

export default async function getFees () {
    
    const supabase = await createClient();

    const {data} = await supabase
    .from('fees')
    .select('description');

    return data as FeeData[];
}