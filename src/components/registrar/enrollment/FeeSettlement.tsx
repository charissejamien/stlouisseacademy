"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { getTuitionFees, getBooks, saveCompleteEnrollment } from "@/app/(portal)/registrar/enrollment/actions";

interface Parent {
    id: number;
    first_name: string;
    last_name: string;
}

interface StudentData {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    gradeLevel: string;
    studentType: string;
}

interface FeeSettlementProps {
    parent: Parent;
    enrolledStudents: StudentData[];
    onComplete: () => void;
}

interface TuitionFeeRecord {
    id: number;
    grade_level: string;
    base_tuition: number;
    miscellaneous: number;
    total_tuition: number;
    entrance_fee: number;
}

interface BookRecord {
    id: number;
    grade_level: string;
    amount: number;
}

interface StudentPaymentAllocation {
    studentIndex: number;
    studentName: string;
    paymentSpecifics: string;
    amountPaid: string;
}

export default function FeeSettlement({ parent, enrolledStudents, onComplete }: FeeSettlementProps) {
    const paymentMethods = ["Cash", "G-Cash", "Bank Transfer"];
    const paymentSpecificsOptions = ["Entrance Fee", "Enrollment Fee"];

    const { data: tuitionFeesList = [] } = useQuery<TuitionFeeRecord[]>({ 
        queryKey: ["tuitionFees"], 
        queryFn: getTuitionFees 
    });
    
    const { data: booksList = [] } = useQuery<BookRecord[]>({ 
        queryKey: ["books"], 
        queryFn: getBooks 
    });

    const [orNumber, setOrNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const [allocations, setAllocations] = useState<StudentPaymentAllocation[]>(
        enrolledStudents.map((s, idx) => ({
            studentIndex: idx,
            studentName: `${s.firstName} ${s.lastName}`,
            paymentSpecifics: "Entrance Fee",
            amountPaid: ""
        }))
    );

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const parentFullName = `${parent.first_name} ${parent.last_name}`;

    const computedBreakdowns = enrolledStudents.map((student) => {
        const tuitionMatch = tuitionFeesList.find((t) => t.grade_level === student.gradeLevel);
        const bookMatch = booksList.find((b) => b.grade_level === student.gradeLevel);

        const tuitionTotal = tuitionMatch ? Number(tuitionMatch.total_tuition) : 0;
        const bookTotal = bookMatch ? Number(bookMatch.amount) : 0;

        return {
            ...student,
            tuitionTotal,
            bookTotal,
        };
    });

    const overallTuitionFee = computedBreakdowns.reduce((sum, item) => sum + item.tuitionTotal, 0);
    const overallBookFee = computedBreakdowns.reduce((sum, item) => sum + item.bookTotal, 0);
    const totalAssessmentDue = overallTuitionFee + overallBookFee;

    const updateAllocationField = (index: number, field: keyof StudentPaymentAllocation, value: string) => {
        setAllocations((prev) =>
            prev.map((alloc, i) => (i === index ? { ...alloc, [field]: value } : alloc))
        );
    };

    const mutation = useMutation({
    mutationFn: () => saveCompleteEnrollment({
        parentId: parent.id,
        students: computedBreakdowns.map((student, idx) => ({
            ...student,
            paymentSpecifics: allocations[idx].paymentSpecifics,
            amountPaid: Number(allocations[idx].amountPaid || 0)
        })),
        // Change paymentGlobal to payment here to match the SaveCompleteEnrollmentPayload type interface
        payment: {
            orNumber,
            paymentMethod
        }
    }),
    onSuccess: () => {
        toast.success("All student records and distributed payment items saved successfully!");
        onComplete();
    },
    onError: (error: Error) => {
        toast.error(error.message || "An issue occurred while writing enrollment parameters.");
    }
});

    const handleEnrollmentSubmit = () => {
        if (!orNumber) {
            toast.error("Please provide an Official Receipt (OR) Number.");
            return;
        }

        const hasInvalidAmounts = allocations.some(a => !a.amountPaid || Number(a.amountPaid) <= 0);
        if (hasInvalidAmounts) {
            toast.error("Please input a valid distributed payment amount for each student row.");
            return;
        }

        mutation.mutate();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="bg-muted p-4 rounded-md border border-input/40">
                <p className="text-sm text-muted-foreground">Fee Settlement Phase for Parent:</p>
                <h3 className="text-xl font-bold text-sla-blue">{parentFullName}</h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-1 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold tracking-tight">Student Ledger Summaries</h2>
                    {computedBreakdowns.map((student, idx) => (
                        <div key={idx} className="p-5 rounded-lg border bg-card shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 border-b pb-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <h4 className="font-bold text-base">{student.firstName} {student.lastName}</h4>
                                <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-input">
                                    {student.gradeLevel}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground pt-1">
                                <div className="flex justify-between"><span>Tuition:</span> <span className="font-medium text-foreground">₱{student.tuitionTotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Books:</span> <span className="font-medium text-foreground">₱{student.bookTotal.toLocaleString()}</span></div>
                            </div>
                        </div>
                    ))}

                    <Card className="mt-2">
                        <CardTitle className="px-5 pt-5 text-lg">Comprehensive Balance Due</CardTitle>
                        <CardContent className="flex flex-col gap-2 mt-2 text-sm">
                            <div className="flex justify-between border-b pb-1">
                                <span>Total Class Tuition Base:</span>
                                <span>₱{overallTuitionFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span>Total Curriculum Book Fees:</span>
                                <span>₱{overallBookFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 text-base font-bold text-sla-blue">
                                <span>Gross Total Assessment:</span>
                                <span>₱{totalAssessmentDue.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="xl:col-span-2">
                    <Card className="border-primary/40 shadow-md">
                        <CardTitle className="px-5 pt-5 text-xl text-sla-blue">Process Payment Entry</CardTitle>
                        <CardContent className="flex flex-col gap-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/40 p-4 rounded-md border">
                                <Field>
                                    <FieldLabel>Transaction Date</FieldLabel>
                                    <Input value={currentDate} disabled className="bg-muted text-muted-foreground" />
                                </Field>
                                <Field>
                                    <FieldLabel>Official Receipt (OR) Number</FieldLabel>
                                    <Input value={orNumber} onChange={(e) => setOrNumber(e.target.value)} placeholder="Enter OR Sequence ID" />
                                </Field>
                                <Field>
                                    <FieldLabel>Payment Method Channel</FieldLabel>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentMethods.map((method) => (
                                                <SelectItem key={method} value={method}>{method}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Distributed Payment Allocation Per Student Row</h3>
                                
                                {allocations.map((alloc, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-md bg-card shadow-sm">
                                        <Field>
                                            <FieldLabel className="font-medium text-foreground">For Student</FieldLabel>
                                            <Input value={alloc.studentName} disabled className="bg-muted text-muted-foreground font-semibold" />
                                        </Field>

                                        <Field>
                                            <FieldLabel>Payment Specifics</FieldLabel>
                                            <Select 
                                                value={alloc.paymentSpecifics} 
                                                onValueChange={(val) => updateAllocationField(idx, "paymentSpecifics", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentSpecificsOptions.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Amount Paid (₱)</FieldLabel>
                                            <Input 
                                                type="number" 
                                                value={alloc.amountPaid} 
                                                onChange={(e) => updateAllocationField(idx, "amountPaid", e.target.value)} 
                                                placeholder="0.00" 
                                            />
                                        </Field>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                onClick={handleEnrollmentSubmit} 
                                className="w-full bg-sla-blue font-bold tracking-wide text-white py-6 text-base mt-2"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Executing Distributed System Write..." : "Complete & Enroll All Students"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}