"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { saveSchoolFee } from "@/app/admin/fees/actions";
import toast from 'react-hot-toast';


export default function FeesInput () {

    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [state, formAction] = useActionState(saveSchoolFee, {success:false, message:""});
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state.message) {
            if (state.success) {
                toast.success(state.message);
                formRef.current?.reset();
            } else {
                toast.error(state.message)
            }
        }
    }, [state]);

    const totalTuition = Number(val1) + Number(val2);

    const gradeCategory = ["Pre-Elementary", "Elementary", "Junior High School"];

    return(

        <div className="w-[80%] mx-auto md:w-[95%]">
            <div className="mt-10 mb-10 bg-white p-5 rounded-md">
                <h2 className="text-sla-blue font-semibold">Configure School Fees</h2>
                    <form ref={formRef} action={formAction} className="flex flex-col">
                        <div className="flex gap-5 ml-5">
                            <select name="category">
                                {gradeCategory.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            <Input placeholder="Grade Level" name="gradeLevel" required/>
                            <Input placeholder="Entrance Fee" name="entranceFee" required/>
                            <Input placeholder="Base Tuition" value={val1} onChange={(e) => setVal1(e.target.value)} name="baseTuition" required/>
                            <Input placeholder="Miscellaneous" value={val2} onChange={(e) => setVal2(e.target.value)} name="miscellaneous" required/>
                            <Input name="totalTuition" value={totalTuition}/>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="bg-sla-blue text-white px-4 py-2 rounded-sm text-[14px]">Configure School Fee</button>
                        </div>
                        
                    </form>
            </div>
        </div>
    );
}