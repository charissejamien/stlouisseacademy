"use client";

import { useState } from "react";

import StudentInformation from "@/components/(portal)/enrollment/StudentInformation";
import ParentInformation from "@/components/(portal)/enrollment/ParentInformation";
import FeeSettlement from "@/components/(portal)/enrollment/FeeSettlement";

import type { Student } from "./types";

import { Button } from "@/components/ui/button";
import { studentsSchema } from "./validation";

type StudentErrors = Record<
    number,
    Record<string, string>
>;

export default function Enrollment() {
    const steps = [
        "Student Information",
        "Parent Information",
        "Fee Settlement",
    ];

    const [currentStep, setCurrentStep] = useState(0);

    const [students, setStudents] = useState<Student[]>([
        {
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
            address: "",
            dateOfBirth: "",
            gender: "",
            schoolYear: "",
            gradeLevel: "",
            studentType: "",
        },
    ]);

    const [studentErrors, setStudentErrors] =
        useState<StudentErrors>({});

    /*
     * Validate Student Information
     */
    const validateStudents = (): boolean => {
        const result = studentsSchema.safeParse(students);

        if (result.success) {
            setStudentErrors({});
            return true;
        }

        const errors: StudentErrors = {};

        result.error.issues.forEach((issue) => {
            const [index, field] = issue.path;

            if (
                typeof index !== "number" ||
                typeof field !== "string"
            ) {
                return;
            }

            if (!errors[index]) {
                errors[index] = {};
            }

            errors[index][field] = issue.message;
        });

        setStudentErrors(errors);

        return false;
    };

    /*
     * Validate the current step before proceeding
     */
    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 0:
                return validateStudents();

            case 1:
                // TODO:
                // return validateParents();

                return true;

            case 2:
                // TODO:
                // return validateFeeSettlement();

                return true;

            default:
                return false;
        }
    };

    /*
     * Next button
     */
    const handleNext = () => {
        const isValid = validateCurrentStep();

        if (!isValid) {
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    /*
     * Previous button
     */
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className="w-[90%] lg:w-[80%] mx-auto mt-10">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold">
                    Enrollment Management
                </h2>

                <p className="text-muted-foreground">
                    Manage student enrollments and process enrollment
                    requests for the current school year
                </p>
            </div>

            {/* Steps */}
            <div className="flex gap-5 mt-10 justify-center">
                {steps.map((step, index) => {
                    const isCurrent = currentStep === index;
                    const isCompleted = index < currentStep;

                    return (
                        <div
                            key={step}
                            className={`flex flex-col gap-1 ${
                                isCurrent
                                    ? "text-primary"
                                    : isCompleted
                                      ? "text-primary"
                                      : "text-gray-600/70"
                            }`}
                        >
                            <p className="w-full flex justify-center">
                                <span
                                    className={`w-fit rounded-full border px-3 py-1 ${
                                        isCurrent
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isCompleted
                                              ? "border-primary bg-primary text-primary-foreground"
                                              : ""
                                    }`}
                                >
                                    {index + 1}
                                </span>
                            </p>

                            <div
                                className={`border-t-2 px-4 ${
                                    isCompleted
                                        ? "border-primary"
                                        : ""
                                }`}
                            />

                            <p>{step}</p>
                        </div>
                    );
                })}
            </div>

            {/* Current Step */}
            <div className="w-full flex justify-center mt-10">
                {currentStep === 0 && (
                    <StudentInformation
                        students={students}
                        setStudents={setStudents}
                        errors={studentErrors}
                    />
                )}

                {currentStep === 1 && (
                    <ParentInformation />
                )}

                {currentStep === 2 && (
                    <FeeSettlement
                        students={students}
                        setStudents={setStudents}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                >
                    Previous
                </Button>

                <Button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}