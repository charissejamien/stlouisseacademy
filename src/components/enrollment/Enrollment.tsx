"use client";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import GradeLevelSelect from "../GradeLevelSelect";
import { useActionState, useEffect, useState } from "react";
import { enrollStudent } from "@/app/enrollment/actions";
import toast from 'react-hot-toast';

type GradeLevel = {
  grade_level: string;
};

type Props = {
  gradeLevels: GradeLevel[];
};

export default function EnrollmentForm( { gradeLevels } : Props ) {

    const basicInfo = [
        {label:"First Name", value:"firstName"},
        {label:"Middle Name", value:"middleName"},
        {label:"Last Name", value:"lastName"},
    ];
    const rel = ["Mother", "Father", "Sibling", "Grandparent", "Aunt", "Uncle", "Guardian"];
    const gender = ["Female", "Male"];

    const [selectedGrade, setSelectedGrade] = useState("");
    const [state, formAction] = useActionState(enrollStudent, {success:false, message:""})

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
        <form className="flex flex-col gap-5" action={formAction}>

            

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
                <div>
                    <GradeLevelSelect gradeLevels={gradeLevels} onChange={setSelectedGrade}/>
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

            <button>submit</button>
        </form>
    );
}