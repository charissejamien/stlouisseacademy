"use client";

import { Input } from "@/components/ui/input"
import { useActionState, useEffect, useState } from "react";
import { Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select"
import toast from 'react-hot-toast';

import { enrollStudent , getFeesByGrade } from "@/app/enrollment/actions";
import { useQuery } from "@tanstack/react-query";

const nameInputs = [
        {name:"firstName", label:"First Name"}, {name:"middleName", label:"Middle Name"}, {name:"lastName", label:"Last Name"},
    ];

    const gradeLevels = [
        {name:"nursery", label:"Nursery", category: "preElementary"},
        {name:"preKinder", label:"Pre-Kindergarten", category: "preElementary"},
        {name:"kinder", label:"Kindergarten", category: "preElementary"},
        {name:"1", label:"Grade 1", category: "elementary"},
        {name:"2", label:"Grade 2", category: "elementary"},
        {name:"3", label:"Grade 3", category: "elementary"},
        {name:"4", label:"Grade 4", category: "elementary"},
        {name:"5", label:"Grade 5", category: "elementary"},
        {name:"6", label:"Grade 6", category: "elementary"},
        {name:"7", label:"Grade 7", category: "juniorHigh"},
        {name:"8", label:"Grade 8", category: "juniorHigh"},
        {name:"9", label:"Grade 9", category: "juniorHigh"},
        {name:"10", label:"Grade 10", category: "juniorHigh"}
    ];


    const guardianRelationship = ["Mother", "Father", "Grandparent", "Aunt", "Uncle", "Cousin", "Sibling", "Guardian"]


export default function EnrollmentForm() {
    


    const [state, formAction] = useActionState(enrollStudent, {success:false, message:""})
    const [selectedGrade, setSelectedGrade] = useState("");

    useEffect(() => {
        if(state.message) {
            if(state.success) {
                toast.success(state.message)
            } else {
                toast.error(state.message)
            }
        }
    }, [state]);


    const { data: fees, isLoading, error } = useQuery({
        queryKey: ['fees', selectedGrade],
        queryFn: () => getFeesByGrade(selectedGrade),
        enabled: !!selectedGrade, // Only fetch if a grade is selected
        placeholderData: (previousData) => previousData,
    })
    
    if(isLoading) return <p>Loading....</p>;
    if(error) return <p>error</p>;

    return(
        <div className="w-[80%] mx-auto mt-20 flex gap-10">
            <section>
                <h2 className="text-sla-blue font-semibold text-[28px]">Student Enrollment</h2>
                <form action={formAction} className="flex flex-col gap-5">
                    <div className="bg-white p-5 rounded-sm">
                        <h2>Basic Student Information</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-5">
                                {nameInputs.map((item) =>
                                    <Input key={item.name} placeholder={item.label} name={item.name} />
                                )}
                            </div>
                            <div>
                                <Select name="gender">
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Select a Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Gender</SelectLabel>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Male">Male</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm">
                        <h2>Academic Placement</h2>
                        <Select name="gradeLevel" onValueChange={(val) => setSelectedGrade(val)}>
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue placeholder="Select a Grade Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Grade Level</SelectLabel>
                                    {gradeLevels.map((grade) => 
                                        <SelectItem key={grade.name} value={grade.name}>{grade.label}</SelectItem>
                                    )}
                                </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="bg-white p-5 rounded-sm">
                        <h2>Parent/Guardian Information</h2>
                        <div className="flex gap-5">
                            <Input name="parent" placeholder="Full Name" className="capitalize"/>
                            <Select name="relationship">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Select a Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Relationship</SelectLabel>
                                        {guardianRelationship.map((rel) => 
                                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input name="contactNumber" placeholder="Contact Number"/>
                        </div>
                    </div>

                    <button className="bg-sla-blue text-white p-2">Enroll Student</button>
                </form>
            </section>


            <section>
                <div className="bg-sla-blue text-white p-5 rounded-md w-100">
                <h2 className="font-medium text-[20px]">Fee Assessment</h2>

                <div className="mt-5">
                        {isLoading ? (
                            <p>Calculating fees...</p>
                        ) : fees ? (
                            fees.map((fee) => (
                                <div key={fee.id} className="flex justify-between border-b py-2">
                                    <p>{fee.name}</p>
                                    <p>P{fee.amount}</p>
                                </div>
                            ))
                        ) : (
                            <p>Please select a grade level to see fees.</p>
                        )}
                    </div>

                <div className="mt-5">
                    <h2 className="text-[14px] uppercase">Discounts</h2>
                    <div className="flex flex-col gap-2">
                        
                    </div>
                </div>


                <div className="mt-5">
                    <p className="text-[14px]">Subtotal</p>
                    <p className="text-[14px]">Discounts</p>
                </div>

                <div className="bg-[#1A5EA1] rounded-sm flex flex-col text-center py-2 mt-5">
                    <p className="text-[#C2C2D8] uppercase text-[12px] tracking-wide">Total Assessment</p>
                    <p className="font-semibold text-[30px] tracking-wider">P16,000.00</p>
                </div>
        </div>
            </section>

        </div>
    );
}