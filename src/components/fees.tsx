"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input"


export default function FeesInput () {

    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");

    const totalTuition = Number(val1) + Number(val2);

    const gradeCategory = [
        {label: "Pre Elementary", value:"preElementary"},
        {label: "Elementary", value:"elementary"},
        {label: "Junior High School", value:"juniorHighSchool"}
    ];

    return(

        <div className="w-[80%] mx-auto md:w-[95%]">
            <div className="mt-10 mb-10 bg-white p-5 rounded-md">
                <h2 className="text-sla-blue font-semibold">Configure School Fees</h2>
                    <div className="flex gap-5 ml-5">
                        <select name="" id="">
                        {gradeCategory.map((g) => (
                            <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                        </select>
                        <Input placeholder="Grade Level" />
                        <Input placeholder="Base Tuition" value={val1} onChange={(e) => setVal1(e.target.value)} />
                        <Input placeholder="Miscellaneous" value={val2} onChange={(e) => setVal2(e.target.value)} />
                        <div className="w-200">Total Tuition: P{totalTuition}</div>
                    </div>
            </div>
        </div>
    );
}