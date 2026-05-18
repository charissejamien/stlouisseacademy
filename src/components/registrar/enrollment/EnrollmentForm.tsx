"use client";
import { Input } from "@/components/ui/input";
import { Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue} from "@/components/ui/select"

import { useActionState, useEffect, useState } from "react";
import { enrollStudent } from "@/app/(portal)/registrar/enrollment/actions";
import toast from 'react-hot-toast';

type Props = {
  gradeLevels: {grade_level:string}[];
  tuitionFees: {grade_level: string, entrance_fee: number, base_tuition: number, miscellaneous: number, total_tuition: number}[];
  discounts: {id:number, name: string, amount: number, category: string}[];
  books: {id: number, grade_level: string, amount: number}[];
};

export default function EnrollmentForm( { gradeLevels, tuitionFees, discounts, books } : Props ) {

    const basicInfo = [
        {label:"First Name", value:"firstName"},
        {label:"Middle Name", value:"middleName"},
        {label:"Last Name", value:"lastName"},
    ];
    const rel = ["Mother", "Father", "Sibling", "Grandparent", "Aunt", "Uncle", "Guardian"];
    const gender = ["Female", "Male"];

    const [selectedGrade, setSelectedGrade] = useState("");
    const [state, formAction] = useActionState(enrollStudent, {success:false, message:""})
    const [esc, setEsc] = useState(false);
    const [selectedDiscounts, setSelectedDiscounts] = useState<{id:number, name: string, amount: number}[]>([]);

    
    const currentFee = tuitionFees.find(f => f.grade_level === selectedGrade);
    const bookFee = books.find(f => f.grade_level === selectedGrade);

    {/* Calculations */}
    const percentageDeductions = selectedDiscounts.reduce((acc, d) => {

    const base = currentFee?.base_tuition ?? 0;
    return acc + (base * (d.amount / 100));
    }, 0);

    const totalLess = (esc ? 9000 : 0) + percentageDeductions;

    const totalTuitionFee = currentFee ? (currentFee.total_tuition - totalLess) : 0; 

    const toggleDiscount = (discount: {id: number, name: string, amount: number}) => {
    setSelectedDiscounts((prev) => {
        // Now TypeScript won't complain about d.id
        const exists = prev.find((d) => d.id === discount.id);
        if (exists) {
        return prev.filter((d) => d.id !== discount.id);
        } else {
        return [...prev, discount];
        }
    });
    };


    useEffect(() => {
        if(state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state])

    return(
        <form className="flex gap-5" action={formAction}>

            
            <div className="flex flex-col gap-5">
        
                <div className="bg-white p-5 rounded-md flex flex-col gap-3 w-fit">
                    <h2>Basic Student Information</h2>
                    <div className="flex gap-5">
                        {basicInfo.map((b) => (
                            <div key={b.value} className="flex flex-col">
                                <label>{b.label}</label>
                                <Input name={b.value} className="capitalize"/>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-5">
                        <div className="flex flex-col">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" className="h-9 w-50 py-1 px-3 text-[14px] rounded-sm bg-input/50"/>
                        </div>
                        <div className="flex flex-col">
                            <label>Residence</label>
                            <Input name="residence" className="capitalize w-80`"/>
                        </div>
                        <div className="flex flex-col">
                            <label>Gender</label>
                            <Select name="gender">
                                <SelectTrigger className="w-full w-50 rounded-sm">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Gender</SelectLabel>
                                    {gender.map((g) => (
                                        <SelectItem key={g} value={g}> {g} </SelectItem>
                                    ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-md flex flex-col gap-3 w-fit">
                    <h2>Academic Placement</h2>
                    <div className="flex gap-5">
                        {/* <GradeLevelSelect gradeLevels={gradeLevels} onChange={setSelectedGrade}/>
                        {["7", "8", "9", "10"].includes(selectedGrade) && (
                            <div className="flex items-center space-x-2 border py-1 px-3 rounded-sm bg-input/50">
                                <input type="checkbox" id="escRecipient" name="escRecipient" onChange={(e) => setEsc(e.target.checked)} className="h-4 w-4"/>
                                <label className="text-sm font-medium leading-none cursor-pointer">
                                    ESC Recipient (Junior High School)
                                </label>
                            </div>
                        )} */}
                    </div>
                    
                </div>

                {/* Parent Information */}
                <div className="bg-white p-5 rounded-md flex flex-col gap-3 w-fit">
                    <h2 className="font-medium">Parent/Guardian Information</h2>
                    <div className="flex gap-5">
                        <div className="flex flex-col">
                            <label>Full Name</label>
                            <Input className="w-70 capitalize" name="parent"/>
                        </div>
                        <div className="flex flex-col">
                            <label>Relationship</label>
                            <Select>
                                <SelectTrigger className="w-full w-40 rounded-sm">
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Relationship</SelectLabel>
                                    {rel.map((r) => (
                                        <SelectItem key={r} value={r}> {r} </SelectItem>
                                    ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <label>Contact Number</label>
                            <Input className="w-45"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-md flex flex-col gap-3 w-fit">
                    <h2 className="font-medium">Enrollment Settlement</h2>
                    <div className="flex flex-col">
                        <label>OR Number</label>
                        <Input className="w-50" name="orNum"/>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex flex-col">
                            <label>Amount</label>
                            <Input name="amount"/>
                        </div>
                        <div className="flex flex-col">
                            <label>Particulars</label>
                            <Input name="particulars"/>
                        </div>
                        <div className="flex flex-col">
                            <label>Mode of Payment</label>
                            <Input name="mop"/>
                        </div>
                    </div>

                </div>

                <button>submit</button>
            </div>

            <div className="text-white bg-sla-blue rounded-md p-5 w-100">
            <h2 className="font-medium">Fee Assessment</h2>

            {currentFee ? (
                <div className="mt-4 space-y-2">
                    <div>
                        <div className="flex justify-between">
                            <p className="color-sla-skyblue">Tuition Fee</p>
                            <p>P{currentFee.total_tuition.toLocaleString(undefined, {minimumFractionDigits:2 , maximumFractionDigits:2})}</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm opacity-80">
                                <p>Base Tuition</p>
                                <p>P{currentFee.base_tuition.toLocaleString(undefined, {minimumFractionDigits:2 , maximumFractionDigits:2})}</p>
                            </div>
                            <div className="flex justify-between text-sm opacity-80">
                                <p>Miscellaneous</p>
                                <p>P{currentFee.miscellaneous.toLocaleString(undefined, {minimumFractionDigits:2 , maximumFractionDigits:2})}</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <p>Books</p>
                            <p>P{bookFee?.amount.toLocaleString() ?? 0}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm opacity-60 mt-4 italic">Please select a grade level to see assessment.</p>
            )}

            <div>
                <p className="text-[12px] my-1">DISCOUNTS</p>
                <div className="flex flex-col gap-1">
                    {discounts.map((d, index) => {
                const isSelected = selectedDiscounts.some((sd) => sd.name === d.name);

                return (
                    <button
                    key={index}
                    type="button"
                    onClick={() => toggleDiscount(d)}
                    // 2. Use a template literal to switch classes
                    className={`border rounded-sm px-4 py-2 flex justify-between transition-all ${
                        isSelected 
                        ? "bg-white text-sla-blue font-medium shadow-sm" // Styles when selected
                        : "bg-transparent text-white hover:bg-white/10" // Styles when NOT selected
                    }`}
                    >
                    <p>{d.name}</p>
                    <p>{d.amount}%</p>
                    </button>
                );
                })}
                </div>

            </div>

            <div className="text-[12px] tracking-wide mt-5">
                <p>Subtotal</p>
                <div className="flex justify-between">
                    <p>Less</p>
                    <p>-P{totalLess.toLocaleString(undefined, {minimumFractionDigits:2 , maximumFractionDigits:2})}</p>
                </div>
                
            </div>

            <div className="bg-[#1A5EA1] rounded-sm py-2 flex flex-col items-center mt-10">
                <p className="text-[12px] uppercase tracking-wider">Total Assessment</p>
                <p className="text-[28px] font-semibold tracking-wider">P{totalTuitionFee.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                <input type="hidden" name="totalTuition" value={totalTuitionFee} />
            </div>

            
        </div>

        


        </form>
    );
}