"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, ArrowLeft, User, Check, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Import your existing backend shared metrics
import { getParents, getBillingPeriods } from "../enrollment/actions";

interface ParentRecord {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
}

interface BillingPeriodRecord {
    id: string;
    period_name: string;
}

// Temporary placeholder mock structure for recent logs view
const mockRecentPayments = [
    { id: "1", or: "OR-99210", payee: "Cardo Dalisay", total: "₱7,000.00", date: "June 02, 2026", method: "Cash" },
    { id: "2", or: "OR-99211", payee: "Neri Miranda", total: "₱3,500.00", date: "June 01, 2026", method: "G-Cash" },
];

export default function RegistrarPaymentsPage() {
    const [view, setView] = useState<"dashboard" | "add-payment">("dashboard");
    const [mainSearchQuery, setMainSearchQuery] = useState("");

    if (view === "dashboard") {
        return (
            <div className="w-full flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-sla-blue">Payment Transactions</h1>
                        <p className="text-sm text-muted-foreground">Monitor official receipts ledger and register family financial parameters.</p>
                    </div>
                    <Button onClick={() => setView("add-payment")} className="bg-sla-blue text-white flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Record a Payment
                    </Button>
                </div>

                <Card>
                    <CardContent className="pt-6 flex flex-col gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by OR Number or Payer..."
                                value={mainSearchQuery}
                                onChange={(e) => setMainSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>OR Number</TableHead>
                                    <TableHead>Account Payer</TableHead>
                                    <TableHead>Transaction Date</TableHead>
                                    <TableHead>Channel</TableHead>
                                    <TableHead className="text-right">Total Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockRecentPayments.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-bold">{log.or}</TableCell>
                                        <TableCell>{log.payee}</TableCell>
                                        <TableCell className="text-muted-foreground">{log.date}</TableCell>
                                        <TableCell>{log.method}</TableCell>
                                        <TableCell className="text-right font-semibold text-sla-blue">{log.total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <AddPaymentTransactionScreen onBack={() => setView("dashboard")} />;
}

/* ────────────────────────────────────────────────────────────────────────── */

interface AddPaymentProps {
    onBack: () => void;
}

interface AllocationRow {
    rowId: string;
    studentId: string;
    studentName: string;
    gradeLevel: string;
    indicatorName: string;
    amount: string;
}

function AddPaymentTransactionScreen({ onBack }: AddPaymentProps) {
    const paymentMethods = ["Cash", "G-Cash", "Bank Transfer", "Check"];

    // Fetch parent list & allocation milestones straight from database cache
    const { data: parentsList = [] } = useQuery<ParentRecord[]>({ queryKey: ["parents"], queryFn: getParents });
    const { data: billingPeriods = [] } = useQuery<BillingPeriodRecord[]>({ queryKey: ["billingPeriods"], queryFn: getBillingPeriods });

    // Local Receipt States
    const [parentComboOpen, setParentComboOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState("");
    const [orNumber, setOrNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    
    // Dynamic Allocation Rows State Array
    const [allocations, setAllocations] = useState<AllocationRow[]>([]);

    const selectedParentData = parentsList.find((p) => p.id === selectedParentId);

    // 🔍 Simulation Mock: Fetching children linked to selected Parent UUID
    // In production, wire this to a useQuery dependent on selectedParentId
    const handleSelectParent = (parentId: string) => {
        setSelectedParentId(parentId);
        setParentComboOpen(false);

        // Simulated Database Pull of Siblings linked to parent
        // Replace this mockup with actual sub-student query variables later
        const dummySiblings = [
            { id: "stud-uuid-1", firstName: "Juan", lastName: "Dela Cruz", gradeLevel: "Grade 3" },
            { id: "stud-uuid-2", firstName: "Maria", lastName: "Dela Cruz", gradeLevel: "Grade 7" }
        ];

        // Automatically pre-populate allocation inputs for each kid to save time!
        const initialRows = dummySiblings.map((sibling, index) => ({
            rowId: `row-${index}-${Date.now()}`,
            studentId: sibling.id,
            studentName: `${sibling.firstName} ${sibling.lastName}`,
            gradeLevel: sibling.gradeLevel,
            indicatorName: billingPeriods[0]?.period_name || "",
            amount: ""
        }));

        setAllocations(initialRows);
    };

    const addExtraRow = (studentId: string, studentName: string, grade: string) => {
        setAllocations((prev) => [
            ...prev,
            {
                rowId: `extra-${Date.now()}`,
                studentId,
                studentName,
                gradeLevel: grade,
                indicatorName: "",
                amount: ""
            }
        ]);
    };

    const removeRow = (rowId: string) => {
        if (allocations.length === 1) return;
        setAllocations((prev) => prev.filter((r) => r.rowId !== rowId));
    };

    const updateRowField = (rowId: string, field: keyof AllocationRow, value: string) => {
        setAllocations((prev) =>
            prev.map((r) => (r.rowId === rowId ? { ...r, [field]: value } : r))
        );
    };

    const submitPaymentForm = () => {
        if (!selectedParentId) return toast.error("Please specify a paying parent profile target.");
        if (!orNumber.trim()) return toast.error("Please supply a valid Official Receipt (OR) identification string.");
        
        const trackingValidation = allocations.some(a => !a.indicatorName || !a.amount || Number(a.amount) <= 0);
        if (trackingValidation) return toast.error("Please ensure every student allocation row lists a milestone and amount.");

        toast.success("Family collection entries committed safely into transaction history ledger!");
        onBack();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>
                <h1 className="text-xl font-bold tracking-tight text-sla-blue">Record Client Payment Transaction</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base text-muted-foreground uppercase tracking-wider">1. Locate Client Financer</CardTitle></CardHeader>
                        <CardContent>
                            <Field className="w-full">
                                <FieldLabel>Search Paying Parent Profile</FieldLabel>
                                <Popover open={parentComboOpen} onOpenChange={setParentComboOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={parentComboOpen} className="w-full justify-between mt-1 text-left font-normal">
                                            {selectedParentData 
                                                ? `${selectedParentData.first_name} ${selectedParentData.last_name} (${selectedParentData.email || 'No email log'})`
                                                : "Search parent by first name, last name, or account credentials..."
                                            }
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[500px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Type parent lookup context..." />
                                            <CommandList>
                                                <CommandEmpty>No registered parent matching parameter parameters discovered.</CommandEmpty>
                                                <CommandGroup>
                                                    {parentsList.map((parent) => (
                                                        <CommandItem
                                                            key={parent.id}
                                                            value={`${parent.first_name} ${parent.last_name}`}
                                                            onSelect={() => handleSelectParent(parent.id)}
                                                        >
                                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold">{parent.first_name} {parent.last_name}</span>
                                                                <span className="text-xs text-muted-foreground">{parent.email || "No email documented"}</span>
                                                            </div>
                                                            <Check className={`ml-auto h-4 w-4 ${selectedParentId === parent.id ? "opacity-100" : "opacity-0"}`} />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </CardContent>
                    </Card>

                    {selectedParentId && (
                        <Card className="border-primary/40 shadow-sm animate-in fade-in duration-200">
                            <CardHeader className="flex flex-row justify-between items-center border-b pb-3">
                                <CardTitle className="text-base text-sla-blue">2. Allocate Distributed Student Ledger Items</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 pt-6">
                                {/* Grouping and looping by unique student ID contexts natively */}
                                {Array.from(new Set(allocations.map(a => a.studentId))).map((studentId) => {
                                    const studentRows = allocations.filter(a => a.studentId === studentId);
                                    const sampleRow = studentRows[0];

                                    return (
                                        <div key={studentId} className="border p-4 rounded-lg bg-muted/20 flex flex-col gap-4">
                                            <div className="flex justify-between items-center bg-muted/40 p-2 rounded">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">{sampleRow.studentName}</span>
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-input/80">{sampleRow.gradeLevel}</span>
                                                </div>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => addExtraRow(studentId, sampleRow.studentName, sampleRow.gradeLevel)}
                                                    className="h-8 text-xs text-primary"
                                                >
                                                    + Split Payment indicator
                                                </Button>
                                            </div>

                                            {studentRows.map((row) => (
                                                <div key={row.rowId} className="flex gap-4 items-end animate-in slide-in-from-top-1">
                                                    <Field className="flex-1">
                                                        <FieldLabel>Target Milestone Indicator</FieldLabel>
                                                        <Select value={row.indicatorName} onValueChange={(val) => updateRowField(row.rowId, "indicatorName", val)}>
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select indicator month" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {billingPeriods.map(p => (
                                                                    <SelectItem key={p.id} value={p.period_name}>{p.period_name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>

                                                    <Field className="w-48">
                                                        <FieldLabel>Amount Paid (₱)</FieldLabel>
                                                        <Input 
                                                            type="number" 
                                                            placeholder="0.00" 
                                                            value={row.amount} 
                                                            onChange={(e) => updateRowField(row.rowId, "amount", e.target.value)} 
                                                            className="mt-1"
                                                        />
                                                    </Field>

                                                    {allocations.filter(a => a.studentId === studentId).length > 1 && (
                                                        <Button variant="ghost" size="icon" onClick={() => removeRow(row.rowId)} className="text-destructive mb-0.5">
                                                            <Plus className="w-4 h-4 rotate-45" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="xl:col-span-1">
                    <Card className="shadow-md border-slate-300">
                        <CardHeader><CardTitle className="text-base text-slate-800">Receipt Parameters</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Field>
                                <FieldLabel>Official Receipt (OR) Number</FieldLabel>
                                <Input value={orNumber} onChange={(e) => setOrNumber(e.target.value)} placeholder="e.g., OR-100293" className="mt-1 font-bold text-sla-blue tracking-wide" />
                            </Field>

                            <Field>
                                <FieldLabel>Mode of Payment</FieldLabel>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentMethods.map(m => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* <Separator className="my-2" /> */}

                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-semibold text-muted-foreground">Computed Remittance:</span>
                                <span className="text-xl font-bold text-sla-blue">
                                    ₱{allocations.reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <Button onClick={submitPaymentForm} disabled={!selectedParentId} className="w-full bg-sla-blue text-white py-6 font-bold mt-2">
                                Commit Transaction Entry
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}