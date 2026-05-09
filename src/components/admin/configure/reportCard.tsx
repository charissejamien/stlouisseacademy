"use client";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { saveSubjectConfiguration } from "@/app/(portal)/admin/configuration/actions";
import toast from "react-hot-toast";

export default function ConfigureReportCard() {

    const [state, formAction] = useActionState(saveSubjectConfiguration, {success:false, message:("")});

    useEffect(() => {
        if(state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return(

        <div className="w-[80%] mx-auto md:w-[95%]">
            <div className="mt-10 mb-10 bg-white p-5 rounded-md">
                <h2 className="text-sla-blue font-semibold">Configure Subjects</h2>
                <form className="flex gap-5" action={formAction}>
                    <Input placeholder="Subject" name="subject"/>
                    <button className="bg-sla-blue text-white px-4 py-2 rounded-sm text-[14px] w-70">Add Subject</button>
                </form>
            </div>
        </div>
    );
}