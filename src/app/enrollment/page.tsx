"use client";

import { Input } from "@/components/ui/input"
import { useActionState, useEffect } from "react";
import { Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select"
import toast from 'react-hot-toast';
import { enrollStudent } from "../actions";

const nameInputs = [
        {name:"firstName", label:"First Name"}, {name:"middleName", label:"Middle Name"}, {name:"lastName", label:"Last Name"},
    ];

    const gradeLevels = [
        {name:"nursery", label:"Nursery"},
        {name:"preKinder", label:"Pre-Kindergarten"},
        {name:"kinder", label:"Kindergarten"},
        {name:"1", label:"Grade 1"},
        {name:"2", label:"Grade 2"},
        {name:"3", label:"Grade 3"},
        {name:"4", label:"Grade 4"},
        {name:"5", label:"Grade 5"},
        {name:"6", label:"Grade 6"},
        {name:"7", label:"Grade 7"},
        {name:"8", label:"Grade 8"},
        {name:"9", label:"Grade 9"},
        {name:"10", label:"Grade 10"}
    ];

    const guardianRelationship = ["Mother", "Father", "Grandparent", "Aunt", "Uncle", "Cousin", "Sibling", "Guardian"]


export default function Enrollment() {

    const [state, formAction] = useActionState(enrollStudent, {success:false, message:""})

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
        <div className="w-[80%] mx-auto mt-20">

            <h2 className="text-sla-blue font-semibold text-[28px]">Student Enrollment</h2>

            <section>
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
                                <Input name="gender" placeholder="Gender"/>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm">
                        <h2>Academic Placement</h2>
                        <Select name="gradeLevel">
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

        </div>
    );
}