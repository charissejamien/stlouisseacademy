"use client";

import { useState } from "react";
import ParentCreation from "./ParentCreation";
import EnrollmentForm from "./EnrollmentForm";
import FeeSettlement from "./FeeSettlement";

type Parent = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    contact_number?: string;
};

type StudentSummary = {
    firstName: string;
    lastName: string;
    gradeLevel: string;
};

export default function EnrollmentContainer() {
    const [step, setStep] = useState(1);
    const [parent, setParent] = useState<Parent | null>(null);
    const [enrolledStudents, setEnrolledStudents] = useState<StudentSummary[]>([]);

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
                />
            )}
        </div>
    );
}