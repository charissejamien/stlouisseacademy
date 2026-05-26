"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { getDiscounts, getGradeLevels } from "@/app/(portal)/admin/configuration/actions";
import { getActiveSchoolYear } from "@/app/(portal)/registrar/enrollment/actions";

type Parent = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    contact_number?: string;
};

type EnrollmentFormProps = {
    parent: Parent;
    onEnrollmentComplete: (students: { firstName: string; lastName: string; gradeLevel: string }[]) => void;
};

type StudentEnrollment = {
    formId: string; 
    firstName: string;
    middleName: string;
    lastName: string;
    gradeLevel: string;
    studentType: string;
};

export default function EnrollmentForm({ parent, onEnrollmentComplete }: EnrollmentFormProps) { 
    const studentTypes = ["New", "Transferee", "Returning"];

    const { data: schoolYear } = useQuery({ queryKey: ["schoolYear"], queryFn: getActiveSchoolYear });
    const { data: gradeLevels } = useQuery({ queryKey: ["gradeLevels"], queryFn: getGradeLevels });
    const { data: discounts } = useQuery({ queryKey: ["discounts"], queryFn: getDiscounts });

    const [students, setStudents] = useState<StudentEnrollment[]>([
        {
            formId: "initial-student",
            firstName: "",
            middleName: "",
            lastName: "",
            gradeLevel: "",
            studentType: "",
        }
    ]);

    const parentFullName = [parent.first_name, parent.middle_name, parent.last_name]
        .filter(Boolean)
        .join(" ");

    const updateStudentField = (index: number, field: keyof StudentEnrollment, value: string) => {
        setStudents((prev) =>
            prev.map((student, i) => (i === index ? { ...student, [field]: value } : student))
        );
    };

    const handleSubmit = () => {
        const hasMissingFields = students.some(
            (s) => !s.firstName || !s.lastName || !s.gradeLevel || !s.studentType
        );
        
        if (hasMissingFields) {
            alert("Please fill out all required student placement fields before proceeding.");
            return;
        }

        const studentSummaries = students.map(({ firstName, lastName, gradeLevel }) => ({
            firstName,
            lastName,
            gradeLevel
        }));

        // This uses the prop and moves you to step 3
        onEnrollmentComplete(studentSummaries); 
    };

    const addStudent = () => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        
        const newStudent: StudentEnrollment = {
            formId: uniqueId,
            firstName: "",
            middleName: "",
            lastName: "",
            gradeLevel: "",
            studentType: "",
        };
        
        setStudents((prev) => [...prev, newStudent]);
    };

    const removeStudent = (index: number) => {
        if (students.length === 1) return;
        setStudents((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="bg-muted p-4 rounded-md border border-input/40 flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">Enrolling student(s) under parent:</p>
                    <h3 className="text-xl font-bold text-sla-blue">{parentFullName}</h3>
                </div>
                <Button onClick={addStudent} variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Another Student
                </Button>
            </div>

            {students.map((student, index) => (
                <div key={student.formId} className="border-b border-dashed border-input pb-10 last:border-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Student #{index + 1}
                        </span>
                        {students.length > 1 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10 gap-2"
                                onClick={() => removeStudent(index)}
                            >
                                <Trash2 className="w-4 h-4" /> Remove Student
                            </Button>
                        )}
                    </div>

                    <div className="w-full flex gap-10">
                        <div className="flex flex-col gap-5 flex-1">
                            <Card>
                                <CardTitle className="px-5 pt-5">Academic Placement</CardTitle>
                                <CardContent className="flex gap-5 items-center">
                                    {schoolYear?.map((s) => (
                                        <Label key={s.id} className="font-semibold bg-input/50 py-3 px-5 rounded-md">
                                            SY {s.start_year} - {s.end_year}
                                        </Label>
                                    ))}
                                    <Select 
                                        value={student.gradeLevel} 
                                        onValueChange={(val) => updateStudentField(index, "gradeLevel", val)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Grade Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gradeLevels?.map((g) => (
                                                <SelectItem key={g.id} value={g.grade_level}>{g.grade_level}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select 
                                        value={student.studentType} 
                                        onValueChange={(val) => updateStudentField(index, "studentType", val)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Student Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {studentTypes.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>

                            <Card className="w-[750px]">
                                <CardTitle className="px-5 pt-5">Basic Information</CardTitle>
                                <CardContent>
                                    <FieldGroup className="flex flex-row gap-5">
                                        <Field className="w-250">
                                            <FieldLabel>First Name</FieldLabel>
                                            <Input 
                                                value={student.firstName} 
                                                onChange={(e) => updateStudentField(index, "firstName", e.target.value)} 
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Middle Name</FieldLabel>
                                            <Input 
                                                value={student.middleName} 
                                                onChange={(e) => updateStudentField(index, "middleName", e.target.value)} 
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Last Name</FieldLabel>
                                            <Input 
                                                value={student.lastName} 
                                                onChange={(e) => updateStudentField(index, "lastName", e.target.value)} 
                                            />
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div>
                            <Card className="w-[300px] px-5 bg-sla-blue text-white h-fit">
                                <CardTitle className="pt-5">Fee Assessment</CardTitle>
                                <CardContent>
                                    <div>
                                        <h3>Discounts</h3>
                                        <div className="flex flex-col gap-3">
                                            {discounts?.map((d) => (
                                                <div key={d.id} className="flex justify-between">
                                                    <Label>{d.name}</Label>
                                                    <Label>{d.amount}%</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={handleSubmit} className="w-fit px-10 ml-auto mt-5">
                Submit All Enrollments
            </Button>
        </div>
    );
}