"use client";

import { useState } from "react";
import ParentCreation from "./ParentCreation";
import EnrollmentForm from "./EnrollmentForm";
import FeeSettlement from "./FeeSettlement";

type Parent = {
    id: number;
    first_name: string;
    last_name: string;
};

type StudentData = {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    gradeLevel: string;
    studentType: string;
};

export default function EnrollmentContainer() {
    const [step, setStep] = useState(1);
    const [parent, setParent] = useState<Parent | null>(null);
    const [enrolledStudents, setEnrolledStudents] = useState<StudentData[]>([]);

    const handleResetAllSteps = () => {
        setParent(null);
        setEnrolledStudents([]);
        setStep(1);
    };

    return (
        <div>
            {step === 1 && (
                <ParentCreation
                    onSuccess={(parentData: Parent) => {
                        setParent(parentData);
                        setStep(2);
                    }}
                />
            )}

            {step === 2 && parent && (
                <EnrollmentForm 
                    parent={parent} 
                    onEnrollmentComplete={(studentsData) => {
                        setEnrolledStudents(studentsData);
                        setStep(3);
                    }}
                />
            )}

            {step === 3 && parent && (
                <FeeSettlement 
                    parent={parent} 
                    enrolledStudents={enrolledStudents} 
                    onComplete={handleResetAllSteps}
                />
            )}
        </div>
    );
}