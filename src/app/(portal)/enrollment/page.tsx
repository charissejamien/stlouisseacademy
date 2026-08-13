"use client"

import StudentInformation from "@/components/(portal)/enrollment/StudentInformation";
import ParentInformation from "@/components/(portal)/enrollment/ParentInformation";
import FeeSettlement from "@/components/(portal)/enrollment/FeeSettlement";
import type { Student } from "./types";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Enrollment() {

    const steps = ["Student Information", "Parent Information", "Fee Settlement"];
    const [currentStep, setCurrentStep] = useState(0)

    const [students, setStudents] = useState<Student[]>([{
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        schoolYear: "",
        gradeLevel: "",
        studentType: ""
    }]);

    return(
        <div className="w-[90%] lg:w-[80%] mx-auto mt-10">
            <h2>Enrollment Management</h2>
            <p>Manage student enrollments and process enrollment requests for the current school year</p>

            <div className="flex gap-5 mt-10 justify-center">
                {steps.map((s, index) => {
                    const isCurrent = currentStep === index;
                    const isCompleted = index < currentStep;

                    return(
                        <div key={s} className="flex flex-col gap-1 text-gray-600/70">
                            <p className="w-full flex justify-center">
                                <span className="w-fit rounded-[50%] border-1 px-3 py-1">{index + 1}</span>
                            </p>
                            <div className="border-t-2 px-4" />
                            <p>{s}</p>
                        </div>
                    )
                })}
            </div>
            
            <div className="w-full flex justify-center">
                {currentStep === 0 && (
                    <StudentInformation 
                        students={students} 
                        setStudents={setStudents}
                    />
                )}
                {currentStep === 1 && <ParentInformation/>}
                {currentStep === 2 && (
                    <FeeSettlement
                        students={students}
                        setStudents={setStudents}
                    />
                )}
            </div>

            <div>
                <Button 
                    className=""
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                    Previous
                </Button>
                <Button 
                    className=""
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}