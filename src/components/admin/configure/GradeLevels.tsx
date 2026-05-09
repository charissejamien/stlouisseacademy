"use client";
import { Input } from "@/components/ui/input";
import { saveGradeLevelConfiguration } from "@/app/(portal)/admin/configuration/actions";
import { useActionState, useEffect } from "react";
import toast from 'react-hot-toast';

export default function ConfigureGradeLevels() {

    const [state, formAction] = useActionState(saveGradeLevelConfiguration, {success:false, message:""})
    const gradeCategory = ["Pre-Elementary", "Elementary", "Junior High School"];

    useEffect(() => {
        if(state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message)
            }
        }
    }, [state]);

    return(
        <div className="w-[80%] mx-auto md:w-[95%]">
            <div className="mt-10 mb-10 bg-white p-5 rounded-md">
                <h2 className="text-sla-blue font-semibold">Configure Grade Levels</h2>
                <form className="flex gap-10" action={formAction}>
                    <select name="category">
                        {gradeCategory.map((g) => (
                             <option key={g} value={g}>{g}</option>
                                ))}
                    </select>
                    <Input placeholder="Grade Level" name="gradeLevel" required/>
                    <button className="bg-sla-blue text-white px-4 py-2 rounded-sm text-[14px] w-70">Configure Level</button>
                </form>
            </div>
        </div>
    );
}