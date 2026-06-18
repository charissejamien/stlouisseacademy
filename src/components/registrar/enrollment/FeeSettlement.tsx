"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { getTuitionFees, getBooks, saveCompleteEnrollment, getBillingPeriods } from "@/app/(portal)/registrar/enrollment/actions";

interface Parent {
    id: string; 
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
    backdatedEnrollmentDate?: string;
}

interface FeeSettlementProps {
    parent: Parent;
    enrolledStudents: StudentData[];
    onComplete: () => void;
}

interface TuitionFeeRecord {
    id: string; 
    grade_level: string;
    base_tuition: number;
    miscellaneous: number;
    total_tuition: number;
    entrance_fee: number;
}

interface BookRecord {
    id: string; 
    grade_level: string;
    amount: number;
}

interface PaymentItem {
    rowId: string;
    paymentSpecifics: string;
    amountPaid: string;
}

interface StudentAllocationGroup {
    studentName: string;
    items: PaymentItem[];
}

interface BillingPeriodRecord {
    id: string;
    period_name: string;
    due_date: string;
}

export default function FeeSettlement({ parent, enrolledStudents, onComplete }: FeeSettlementProps) {
    const paymentMethods = ["Cash", "G-Cash", "Bank Transfer"];

    const { data: billingPeriods = [] } = useQuery<BillingPeriodRecord[]>({
        queryKey: ["billingPeriods"],
        queryFn: getBillingPeriods
    });
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

    // Formats today's date safely as a default YYYY-MM-DD local string fallback descriptor
    const [transactionDate, setTransactionDate] = useState(() => {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localToday = new Date(today.getTime() - (offset * 60 * 1000));
        return localToday.toISOString().split("T")[0];
    });

    // ✅ PURE LAZY INITIALIZATION: Eradicates component render impurity alerts
    const [allocations, setAllocations] = useState<StudentAllocationGroup[]>(() => 
        enrolledStudents.map((s, idx) => ({
            studentName: `${s.firstName} ${s.lastName}`,
            items: [
                { 
                    rowId: `initial-row-${idx}`, 
                    paymentSpecifics: "Entrance Fee", 
                    amountPaid: "" 
                }
            ]
        }))
    );

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

    // ✅ DETERMINISTIC ACTION STATE: Generates clean list counters instead of volatile math hooks
    const addPaymentRow = (studentIndex: number) => {
        setAllocations((prev) =>
            prev.map((group, idx) => {
                if (idx !== studentIndex) return group;

                const nextRowNumber = group.items.length + 1;
                const newId = `allocated-row-${studentIndex}-${nextRowNumber}`;

                return {
                    ...group,
                    items: [
                        ...group.items, 
                        { 
                            rowId: newId, 
                            paymentSpecifics: "Advance Tuition Fee", 
                            amountPaid: "" 
                        }
                    ]
                };
            })
        );
    };

    const removePaymentRow = (studentIndex: number, rowId: string) => {
        setAllocations((prev) =>
            prev.map((group, idx) => {
                if (idx !== studentIndex || group.items.length === 1) return group;
                return {
                    ...group,
                    items: group.items.filter((item) => item.rowId !== rowId)
                };
            })
        );
    };

    const updatePaymentRowField = (studentIndex: number, rowId: string, field: keyof PaymentItem, value: string) => {
        setAllocations((prev) =>
            prev.map((group, idx) => {
                if (idx !== studentIndex) return group;
                return {
                    ...group,
                    items: group.items.map((item) => (item.rowId === rowId ? { ...item, [field]: value } : item))
                };
            })
        );
    };

    const mutation = useMutation({
        mutationFn: () => saveCompleteEnrollment({
            parentId: parent.id,
            students: computedBreakdowns.map((student, idx) => ({
                ...student,
                backdatedEnrollmentDate: student.backdatedEnrollmentDate || transactionDate,
                paymentsDistributed: allocations[idx].items.map((item) => ({
                    paymentSpecifics: item.paymentSpecifics,
                    amountPaid: Number(item.amountPaid || 0)
                }))
            })),
            payment: {
                orNumber,
                paymentMethod
            }
        }),
        onSuccess: () => {
            toast.success("All student records and initial composite items saved cleanly!");
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

        const missingAmounts = allocations.some((group) =>
            group.items.some((item) => !item.amountPaid || Number(item.amountPaid) <= 0)
        );
        if (missingAmounts) {
            toast.error("Please ensure every specified payment row has a valid numeric amount.");
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
                </div>

                <div className="xl:col-span-2">
                    <Card className="border-primary/40 shadow-md">
                        <CardTitle className="px-5 pt-5 text-xl text-sla-blue">Process Payment Entry</CardTitle>
                        <CardContent className="flex flex-col gap-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/40 p-4 rounded-md border">
                                
                                <Field>
                                    <FieldLabel>Transaction Date</FieldLabel>
                                    <Input 
                                        type="date"
                                        value={transactionDate} 
                                        onChange={(e) => setTransactionDate(e.target.value)}
                                        className="bg-white border text-slate-900 cursor-pointer text-sm" 
                                        style={{ colorScheme: "light" }}
                                    />
                                    <span className="text-[10px] text-amber-600 font-medium mt-0.5 block px-0.5">
                                        ⚠️ Changes financial post timestamp
                                    </span>
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

                            <div className="flex flex-col gap-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">Distributed Composite Payment Details</h3>
                                
                                {allocations.map((group, studentIdx) => (
                                    <div key={studentIdx} className="p-4 border rounded-md bg-card shadow-sm flex flex-col gap-4">
                                        <div className="flex justify-between items-center border-b pb-2 bg-muted/20 px-2 rounded">
                                            <span className="font-bold text-sla-blue">For Student: {group.studentName}</span>
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 text-xs flex items-center gap-1"
                                                onClick={() => addPaymentRow(studentIdx)}
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Fee Allocation Row
                                            </Button>
                                        </div>

                                        {group.items.map((item) => (
                                            <div key={item.rowId} className="flex flex-col md:flex-row gap-4 items-end">
                                                <Field className="flex-1">
                                                    <FieldLabel>Payment Allocation Specifics</FieldLabel>
                                                    <Select 
                                                        value={item.paymentSpecifics} 
                                                        onValueChange={(val) => updatePaymentRowField(studentIdx, item.rowId, "paymentSpecifics", val)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Allocation Month" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {billingPeriods.map((period) => (
                                                                <SelectItem key={period.id} value={period.period_name}>
                                                                    {period.period_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>

                                                <Field className="flex-1">
                                                    <FieldLabel>Amount Tendered Paid (₱)</FieldLabel>
                                                    <Input 
                                                        type="number" 
                                                        value={item.amountPaid} 
                                                        onChange={(e) => updatePaymentRowField(studentIdx, item.rowId, "amountPaid", e.target.value)} 
                                                        placeholder="0.00" 
                                                    />
                                                </Field>

                                                {group.items.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10 mb-0.5"
                                                        onClick={() => removePaymentRow(studentIdx, item.rowId)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
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