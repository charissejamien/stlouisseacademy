"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Imported step backtrack indicator icon
import { Button } from "@/components/ui/button";
import ParentCreation from "../registrar/enrollment/ParentCreation";
import EnrollmentForm from "./EnrollmentForm";
import FeeSettlement from "./FeeSettlement";

type Parent = {
    id: string; 
    first_name: string;
    last_name: string;
};

type StudentData = {
    firstName: string;
    middleName?: string;
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

    // 🔙 State decrementor mapping logic
    const handleGoBack = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* 🗺️ DYNAMIC STEP HEADER WITH ACCESSIBLE BACK CONTROLS */}
            <div className="flex items-center justify-between bg-card p-4 border rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    {step > 1 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleGoBack}
                            className="flex items-center gap-2 hover:bg-muted font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                        </Button>
                    )}
                    <h1 className="text-xl font-bold tracking-tight text-sla-blue">
                        Registrar Student Enrollment Portal
                    </h1>
                </div>
                
                {/* Visual Step Tracker Pipeline */}
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground px-2">
                    <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1. Parent</span>
                    <span className="text-slate-300">/</span>
                    <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2. Profiles</span>
                    <span className="text-slate-300">/</span>
                    <span className={`px-2.5 py-1 rounded-full ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3. Settlement</span>
                </div>
            </div>

            {/* STEP VIEWS CONTEXT RENDERING ENGINE */}
            <div className="w-full">
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
        </div>
    );
}