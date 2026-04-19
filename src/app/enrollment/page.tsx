"use client";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useEffect } from "react";


export default function Enrollment () {

const [selectedGrade, setSelectedGrade] = useState("nursery");
const [selectedDiscount, setSelectedDiscount] = useState<string[]>([]);


useEffect(() => {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  // This should print your URL in the browser console
}, []);

const studentInfo = [
    {id:"firstName", label:"First Name", key:"firstName"},
    {id:"middleName", label:"Middle Name", key:"middleName"},
    {id:"lastName", label:"Last Name", key:"lastName"},
];

const gradeLevel = [
    {value:"", option:"Select Grade"},
    {value:"nursery", option:"Nursery", level:"preElementary"},
    {value:"preKinder", option:"Pre-Kinder", level:"preElementary"},
    {value:"kinder", option:"Kinder", level:"preElementary"},
    {value:"gradeOne", option:"Grade 1", level:"elementary"},
    {value:"gradeTwo", option:"Grade 2", level:"elementary"},
    {value:"gradeThree", option:"Grade 3", level:"elementary"},
    {value:"gradeFour", option:"Grade 4", level:"elementary"},
    {value:"gradeFive", option:"Grade 5", level:"elementary"},
    {value:"gradeSix", option:"Grade 6", level:"elementary"},
    {value:"gradeSeven", option:"Grade 7", level:"juniorHigh"},
    {value:"gradeEight", option:"Grade 8", level:"juniorHigh"},
    {value:"gradeNine", option:"Grade 9", level:"juniorHigh"},
    {value:"gradeTen", option:"Grade 10", level:"juniorHigh"},
];

const toggleDiscount = (id:string) => {
  if (selectedDiscount.includes(id)) {
    // REMOVE if already there
    setSelectedDiscount(selectedDiscount.filter((d) => d !== id));
  } else {
    // ADD if not there
    setSelectedDiscount([...selectedDiscount, id]);
  }
};


const escGrantee = [
    {name:"escGrantee", id:"yes", label:"Yes"},
    {name:"escGrantee", id:"no", label:"No"},
];

const fees = [
    {id:"preElementary", totalTuition:18950, sslgMembership:30, tuition:9800, misc:9150},
    {id:"elementary", totalTuition:17665, sslgMembership:30, tuition:9895, misc:7770},
    {id:"juniorHigh", totalTuition:15380, sslgMembership:50, tuition:8725, misc:6655},
];

const discounts = [
    {id:"sibling", label:"Sibling Discount", rate:5},
    {id:"full", label:"Full Payment Discount", rate:10},
    {id:"half", label:"Half Payment Discount", rate:2},

];

const selectedGradeData = gradeLevel.find((g) => g.value === selectedGrade);
const feeAssessment = fees.find((f) => f.id === selectedGradeData?.level);
const subtotal = feeAssessment ? feeAssessment.totalTuition + feeAssessment.sslgMembership : "0";


    return(
        <div className="w-[80%] mx-auto">

            <h2 className="text-sla-blue font-semibold text-[32px]">Student Enrollment</h2>
            <div className="flex gap-2">
                <input type="checkbox" name="multipleEnrollment" id="multipleEnrollment" />
                <p>Multiple Enrollment</p>
            </div>

            <div className="flex">

                <div className="flex flex-col gap-4">
                    <div className="bg-white p-5 flex flex-col gap-4">
                        <h2 className="font-semibold text-[18px]">Basic Student Information</h2>
                        <div className="flex uppercase gap-2">
                            {studentInfo.map((item) => 
                            <div className="flex flex-col">
                                <label htmlFor={item.id}>{item.label}</label>
                                <input type="text" key={item.key} className="border border-gray-muted rounded-sm py-1"/>
                            </div>
                            )}
                        </div>
                    </div>
                     <div className="bg-white p-5 flex flex-col gap-4">
                        <h2 className="font-semibold text-[18px]">Academic Placement</h2>
                        <div className="flex gap-20">
                            <div className="flex flex-col">
                                <label htmlFor="gradeLevel">Grade Level</label>
                                <select name="academicPlacement" id="academicPlacement" onChange={(e) => setSelectedGrade(e.target.value)}>
                                {gradeLevel.map((item) =>
                                    <option value={item.value}>{item.option}</option>
                                )} 
                                </select>
                            </div>
                            <div>
                                <p>ESC Grantee</p>
                                <div className="flex gap-4">
                                    {escGrantee.map((item) =>
                                    <div className="flex gap-1">
                                        <input type="radio" name={item.name} id={item.id} />
                                        <label htmlFor={item.name}>{item.label}</label>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-sla-blue text-white p-8 rounded-md">
                    <h2 className="text-[20px]">Fee Assessment</h2>
                    
                    <div className="flex flex-col gap-2 mt-5">
                        <div>
                            <div className="flex justify-between">
                                <p className="text-[#A9C7FF]">Tuition Fee</p>
                                <p className="font-semibold">P{feeAssessment ? feeAssessment.totalTuition.toLocaleString() : "0"}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#A9C7FF] text-[12px] leading-tight">Tuition</p>
                                <p className="text-[12px]  leading-none">P{feeAssessment ? feeAssessment.tuition.toLocaleString() : "0"}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-[#A9C7FF] text-[12px]  leading-tight">Miscellaneous</p>
                                <p className="text-[12px] leading-none">P{feeAssessment ? feeAssessment.misc.toLocaleString() : "0"}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-[#A9C7FF]">SSLG Membership</p>
                            <p className="font-semibold">P{feeAssessment ? feeAssessment.sslgMembership.toLocaleString() : "0"}</p>
                        </div>
                    </div>

                    <div className="my-6 h-[0.1px] bg-[#9CB8F3]"></div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-[12px] uppercase">Discounts</h2>
                        {discounts.map((item) => {
                        // Check if this discount is currently selected
                        const isSelected = selectedDiscount.includes(item.id);

                        return (
                            <div
                            key={item.id}
                            onClick={() => toggleDiscount(item.id)}
                            className={`flex justify-between border rounded-sm p-2 text-[14px] cursor-pointer transition-all
                                ${isSelected 
                                ? "bg-white text-sla-blue border-white" // Style when active
                                : "border-[#A9C7FF] hover:bg-[#1253cd]" // Style when inactive
                                }`}
                            >
                            <p>{item.label}</p>
                            <p>{item.rate}%</p>
                            </div>
                        );
                        })}
                    </div>

                    <div className="flex flex-col gap-1 mt-5">
                        <div className="flex justify-between">
                            <p className="text-[12px]">Subtotal</p>
                            <p>{subtotal}</p>
                        </div>
                        <div>
                            <p className="text-[12px]">Discounts</p>
                        </div>
                    </div>

                    <div className="bg-[#1A5EA1] flex flex-col py-2 px-8 rounded-sm mt-5">
                        <p className="text-center text-[10px] uppercase tracking-[1px]">Total Assessment</p>
                        <p className="text-center text-[28px] font-semibold tracking-[2px]">P16,000.00</p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}