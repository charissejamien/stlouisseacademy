
"use client";
import { saveDiscount } from "@/app/admin/fees/actions";
import { useActionState, useEffect } from "react";
import toast from 'react-hot-toast';

export default function Discounts () {

const category = ["academic", "payment", "sibling", "special"]


const [state, formAction] = useActionState(saveDiscount, {success:false, message:""})


useEffect(() => {
    if(state.message) {
        if (state.success) {
            toast.success(state.message);
        } else {
             toast.error(state.message);
        }
    }
}, [state] )


    return(
        <div className="w-[80%] mx-auto mt-20 mb-20">

            <section>
                <h2 className="mb-5">Add Discounts</h2>
                <form action={formAction} className="bg-white p-5">
                    <div className="flex gap-5">

                        <div className="flex flex-col">
                            <label htmlFor="">Add Discount Specification</label>
                            <input type="text" name="description" className="bg-background py-1 w-80"/>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="">Add Discount Amount</label>
                            <input type="text" name="amount" className="bg-background py-1"/>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="">Add Discount Category</label>
                            <select name="category" className="bg-background py-1 capitalize px-2">
                                {category.map((c) => (
                                    <option value={c} key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>

                    

                    <button className="bg-sla-blue text-white px-4 py-1 rounded-sm mt-5">Submit</button>
                            
                </form>

            </section>



        </div>

    );
}