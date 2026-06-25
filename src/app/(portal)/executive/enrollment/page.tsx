"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import your sub-steps directly from the registrar's module folder
import EnrollmentForm from "@/components/registrar/enrollment/EnrollmentForm";
import FeeSettlement from "@/components/registrar/enrollment/FeeSettlement";

type StudentData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    gradeLevel: string;
    studentType: string;
};

// ⚡ AUTOMATED COGNITO PROVISIONAL PARENT CONTRACT
// Bypasses step 1 database requirements by utilizing a master staging fallback token anchor
const STAGING_PARENT_CONTEXT = {
    id: "staging-unlinked-parent-id", // Ensure this matches your staging parent row ID in Supabase
    first_name: "Staging",
    last_name: "Unlinked Parent",
};

export default function ExecutiveEnrollment() {
    const [step, setStep] = useState(2);
    const [enrolledStudents, setEnrolledStudents] = useState<StudentData[]>([]);

    const handleResetAllSteps = () => {
        setEnrolledStudents([]);
        setStep(2);
    };

    const handleGoBack = () => {
        if (step > 2) {
            setStep((prev) => prev - 1);
        }
    };

    return (
        <div className="w-[90%] mx-auto flex flex-col gap-6">
            
            {/* Context Section Header Banner */}
            <div className="mt-10 mb-2 border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold text-sla-blue tracking-widest uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                        Executive Accounting Reconciliation Desk
                    </span>
                    <h2 className="text-slate-900 text-[24px] font-black tracking-tight mt-2">
                        Rapid Student & Ledger Staging
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Bypassing parent profile constraints. Inputting metrics under tracking anchor: <span className="font-bold font-mono text-slate-700">Staging / Unlinked Parent</span>
                    </p>
                </div>

                {/* Simulated Process Step Indicator Tracker */}
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground bg-muted/50 p-2 border rounded-lg h-fit">
                    {step > 2 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleGoBack}
                            className="h-7 text-xs flex items-center gap-1.5 hover:bg-white"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </Button>
                    )}
                    <span className={`px-2.5 py-1 rounded-md ${step === 2 ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}>
                        1. Profiles Entry
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className={`px-2.5 py-1 rounded-md ${step === 3 ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}>
                        2. Initial Fee Settlement
                    </span>
                </div>
            </div>

            {/* PIPELINE RENDERING STEP FLOW HOOKS */}
            <div className="w-full">
                {/* Step 2: Student Placement Profiler */}
                {step === 2 && (
                    <EnrollmentForm 
                        parent={STAGING_PARENT_CONTEXT} 
                        onEnrollmentComplete={(studentsData) => {
                            setEnrolledStudents(studentsData);
                            setStep(3); 
                        }}
                    />
                )}

                {/* Step 3: Immediate Fee Settlement Allocation Ledger */}
                {step === 3 && (
                    <FeeSettlement 
                        parent={STAGING_PARENT_CONTEXT} 
                        enrolledStudents={enrolledStudents} 
                        onComplete={handleResetAllSteps}
                    />
                )}
            </div>
        </div>
    );
}