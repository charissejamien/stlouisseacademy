"use client";

import { Input } from "@/components/ui/input";
import { saveBooksConfiguration } from "@/app/(portal)/admin/configuration/actions";
import toast from "react-hot-toast";
import { useActionState, useEffect } from "react";

export default function ConfigureBooks() {

    const [state, formAction] = useActionState(saveBooksConfiguration, {success:false, message:" "})

    useEffect(() => {
        if(state.message) {
            if(state.success) {
                toast.success(state.message)
            } else {
                toast.error(state.message)
            }
        }
    }, [state]);

     return(

        <div className="w-[80%] mx-auto md:w-[95%]">
            <div className="mt-10 mb-10 bg-white p-5 rounded-md">
                <h2 className="text-sla-blue font-semibold">Configure Books</h2>
                <form action={formAction} className="flex gap-5">
                    <Input placeholder="Grade Level" name="gradeLevel"/>
                    <Input placeholder="Amount" name="amount"/>
                    <button>Configure Books</button>
                </form>
            </div>
        </div>
    );
}