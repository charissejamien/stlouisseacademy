"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, ArrowLeft, User, Check, ChevronsUpDown, Printer, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Server action bindings with explicit types
import { getParents, getBillingPeriods } from "../enrollment/actions";
import { 
    getStudentsAndBalancesByParent, 
    createFamilyPayments,
    getRecentPayments, 
    SiblingStudent 
} from "@/app/(portal)/registrar/payments/actions"; 

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

interface AllocationRow {
    rowId: string;
    studentId: string;
    studentName: string;
    gradeLevel: string;
    totalTuition: number;
    remainingBalance: number;
    indicatorName: string;
    amount: string;
}

interface AddPaymentProps {
    onBack: () => void;
}

interface PaymentTransactionRecord {
    id: string;
    or_number: string;
    payee_name: string;
    created_at: string;
    mode_of_payment: string;
    amount: number;
}

export default function RegistrarPaymentsPage() {
    const [view, setView] = useState<"dashboard" | "add-payment">("dashboard");
    const [mainSearchQuery, setMainSearchQuery] = useState("");

    // 🔄 Fetching live data from backend actions instead of mock array logs
    const { data: recentPayments = [], isLoading } = useQuery<PaymentTransactionRecord[]>({
        queryKey: ["recentPayments"],
        queryFn: getRecentPayments,
    });

    if (view === "dashboard") {
        // 🔍 Dynamic multi-field filter sequence evaluating live input
        const filteredPayments = recentPayments.filter((log) => {
            const query = mainSearchQuery.toLowerCase().trim();
            if (!query) return true;
            return (
                log.or_number?.toLowerCase().includes(query) ||
                log.payee_name?.toLowerCase().includes(query)
            );
        });

        // ⏱️ Clean array windowing to display exactly the top 10 rows safely
        const targetedTenPayments = filteredPayments.slice(0, 10);

        return (
            <div className="w-full flex flex-col gap-6 mt-10 ml-10">
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground italic">
                                            Retrieving recent transaction logs from the database...
                                        </TableCell>
                                    </TableRow>
                                ) : targetedTenPayments.length > 0 ? (
                                    targetedTenPayments.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-bold text-slate-900">{log.or_number}</TableCell>
                                            <TableCell>{log.payee_name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(log.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>{log.mode_of_payment}</TableCell>
                                            <TableCell className="text-right font-semibold text-sla-blue">
                                                ₱{Number(log.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground italic">
                                            No recent payment transactions match your query criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
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

function AddPaymentTransactionScreen({ onBack }: AddPaymentProps) {
    const paymentMethods = ["Cash", "G-Cash", "Bank Transfer", "Check"];
    const queryClient = useQueryClient();

    const { data: parentsList = [] } = useQuery<ParentRecord[]>({ queryKey: ["parents"], queryFn: getParents });
    const { data: billingPeriods = [] } = useQuery<BillingPeriodRecord[]>({ queryKey: ["billingPeriods"], queryFn: getBillingPeriods });

    const [parentComboOpen, setParentComboOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState("");
    const [orNumber, setOrNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [allocations, setAllocations] = useState<AllocationRow[]>([]);
    const [isFetchingSiblings, setIsFetchingSiblings] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    const selectedParentData = parentsList.find((p) => p.id === selectedParentId);

    const { mutate: processPayment, isPending } = useMutation({
        mutationFn: createFamilyPayments,
        onSuccess: () => {
            toast.success("Family collection entries committed safely!");
            queryClient.invalidateQueries({ queryKey: ["siblingBalances"] });
            queryClient.invalidateQueries({ queryKey: ["recentPayments"] }); // ✅ Refresh dashboard ledger immediately
            setIsReceiptModalOpen(true);
        },
        onError: (error) => {
            toast.error(`Database Error: ${error.message}`);
        }
    });

    const handleSelectParent = async (parentId: string) => {
        setSelectedParentId(parentId);
        setParentComboOpen(false);
        setIsFetchingSiblings(true);
        
        const loader = toast.loading("Fetching family balance configurations...");
        try {
            const records: SiblingStudent[] = await getStudentsAndBalancesByParent(parentId);
            
            if (records && records.length > 0) {
                const initialRows = records.map((sibling: SiblingStudent, index: number) => ({
                    rowId: `row-${index}-${parentId}`, 
                    studentId: sibling.id,
                    studentName: `${sibling.firstName} ${sibling.lastName}`,
                    gradeLevel: sibling.gradeLevel,
                    totalTuition: sibling.totalTuition,
                    remainingBalance: sibling.remainingBalance,
                    indicatorName: billingPeriods[0]?.period_name || "",
                    amount: ""
                }));
                setAllocations(initialRows);
            } else {
                setAllocations([]);
                toast.error("No active student records linked to this profile.");
            }
        } catch (err: any) {
            toast.error(`Could not complete balance pull sequence: ${err.message}`);
        } finally {
            toast.dismiss(loader);
            setIsFetchingSiblings(false);
        }
    };

    const addExtraRow = (studentId: string, studentName: string, grade: string, tuition: number, balance: number) => {
        setAllocations((prev) => [
            ...prev,
            {
                rowId: `extra-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                studentId,
                studentName,
                gradeLevel: grade,
                totalTuition: tuition,
                remainingBalance: balance,
                indicatorName: "",
                amount: ""
            }
        ]);
    };

    const removeRow = (rowId: string) => {
        setAllocations((prev) => prev.filter((r) => r.rowId !== rowId));
    };

    const excludeStudentFromTransaction = (studentId: string) => {
        setAllocations((prev) => prev.filter((r) => r.studentId !== studentId));
        toast.success("Student skipped from this payment remittance bundle.");
    };

    const updateRowField = (rowId: string, field: keyof AllocationRow, value: string) => {
        setAllocations((prev) =>
            prev.map((r) => (r.rowId === rowId ? { ...r, [field]: value } : r))
        );
    };

    const submitPaymentForm = () => {
        if (!selectedParentId) return toast.error("Please specify a paying parent profile target.");
        if (!orNumber.trim()) return toast.error("Please supply a valid Official Receipt (OR) identification string.");
        if (allocations.length === 0) return toast.error("Please ensure at least one student line item is allocated before committing.");
        
        const trackingValidation = allocations.some(a => !a.indicatorName || !a.amount || Number(a.amount) <= 0);
        if (trackingValidation) return toast.error("Please ensure every active allocation row lists an indicator and valid amount.");

        const payload = allocations.map(a => ({
            student_id: a.studentId,
            or_number: orNumber,
            amount: Number(a.amount),
            mode_of_payment: paymentMethod,
            billing_period: a.indicatorName
        }));

        processPayment(payload);
    };

    const handleCloseReceiptModal = () => {
        setIsReceiptModalOpen(false);
        onBack();
    };

    return (
        <div className="w-full flex flex-col gap-6 mt-10 ml-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} disabled={isPending} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Button>
                <h1 className="text-xl font-bold tracking-tight text-sla-blue">Record Client Payment Transaction</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2 flex flex-col gap-6">
                    
                    {/* SECTION 1: PARENT COMBOBOX */}
                    <Card>
                        <CardHeader><CardTitle className="text-base text-muted-foreground uppercase tracking-wider">1. Locate Client Financer</CardTitle></CardHeader>
                        <CardContent>
                            <Field className="w-full">
                                <FieldLabel>Search Paying Parent Profile</FieldLabel>
                                <Popover open={parentComboOpen} onOpenChange={setParentComboOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" disabled={isPending} className="w-full justify-between mt-1 text-left font-normal">
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
                                                <CommandEmpty>No registered parent matching parameters discovered.</CommandEmpty>
                                                <CommandGroup>
                                                    {parentsList.map((p) => (
                                                        <CommandItem
                                                            key={p.id}
                                                            value={`${p.first_name} ${p.last_name}`}
                                                            onSelect={() => handleSelectParent(p.id)}
                                                        >
                                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold">{p.first_name} {p.last_name}</span>
                                                                <span className="text-xs text-muted-foreground">{p.email || "No email documented"}</span>
                                                            </div>
                                                            <Check className={`ml-auto h-4 w-4 ${selectedParentId === p.id ? "opacity-100" : "opacity-0"}`} />
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

                    {/* SECTION 2: STUDENT ALLOCATIONS LOOP */}
                    {selectedParentId && (
                        <Card className="border-primary/40 shadow-sm">
                            <CardHeader className="border-b pb-3">
                                <CardTitle className="text-base text-sla-blue">2. Allocate Distributed Student Ledger Items</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6 pt-6">
                                {isFetchingSiblings ? (
                                    <p className="text-sm text-muted-foreground italic p-4">Loading real-time family database profiles and account statements...</p>
                                ) : allocations.length > 0 ? (
                                    Array.from(new Set(allocations.map(a => a.studentId))).map((studentId) => {
                                        const studentRows = allocations.filter(a => a.studentId === studentId);
                                        const sampleRow = studentRows[0];

                                        return (
                                            <div key={studentId} className="border p-4 rounded-lg bg-muted/20 flex flex-col gap-4 relative overflow-hidden group">
                                                <div className="flex justify-between items-center bg-muted/40 p-2 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-800">{sampleRow.studentName}</span>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-input/80">{sampleRow.gradeLevel}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm" 
                                                            disabled={isPending}
                                                            onClick={() => addExtraRow(studentId, sampleRow.studentName, sampleRow.gradeLevel, sampleRow.totalTuition, sampleRow.remainingBalance)}
                                                            className="h-8 text-xs text-primary bg-white"
                                                        >
                                                            + Split Payment Indicator
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={isPending}
                                                            onClick={() => excludeStudentFromTransaction(studentId)}
                                                            className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1 font-semibold"
                                                            title="Exclude this child from this payment entry form"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-md border border-slate-100 shadow-sm text-sm">
                                                    <div className="flex flex-col gap-0.5 border-r pr-2">
                                                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Total Annual Tuition</span>
                                                        <span className="font-semibold text-slate-700">
                                                            ₱{sampleRow.totalTuition.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 pl-2">
                                                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">Current Remaining Balance</span>
                                                        <span className={`font-bold ${sampleRow.remainingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                            ₱{sampleRow.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {studentRows.map((row) => (
                                                    <div key={row.rowId} className="flex gap-4 items-end animate-in slide-in-from-top-1 duration-200">
                                                        <Field className="flex-1">
                                                            <FieldLabel>Target Milestone Indicator</FieldLabel>
                                                            <Select disabled={isPending} value={row.indicatorName} onValueChange={(val) => updateRowField(row.rowId, "indicatorName", val)}>
                                                                <SelectTrigger className="mt-1 bg-white">
                                                                    <SelectValue placeholder="Select indicator" />
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
                                                                disabled={isPending}
                                                                placeholder="0.00" 
                                                                value={row.amount} 
                                                                onChange={(e) => updateRowField(row.rowId, "amount", e.target.value)} 
                                                                className="mt-1 font-semibold bg-white"
                                                            />
                                                        </Field>

                                                        {allocations.filter(a => a.studentId === studentId).length > 1 && (
                                                            <Button variant="ghost" size="icon" disabled={isPending} onClick={() => removeRow(row.rowId)} className="text-destructive mb-0.5">
                                                                <Plus className="w-4 h-4 rotate-45" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center bg-amber-50/50 border border-amber-200 rounded-lg text-amber-800 text-sm flex flex-col items-center gap-2">
                                        <span>No active sibling distribution modules remain in this payment payload.</span>
                                        <Button variant="outline" size="sm" onClick={() => handleSelectParent(selectedParentId)} className="mt-1 h-8 bg-white text-amber-900 border-amber-300">
                                            Reset Sibling Manifest
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* SIDEBAR PANEL */}
                <div className="xl:col-span-1">
                    <Card className="shadow-md border-slate-300 sticky top-6">
                        <CardHeader><CardTitle className="text-base text-slate-800">Receipt Parameters</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Field>
                                <FieldLabel>Official Receipt (OR) Number</FieldLabel>
                                <Input disabled={isPending} value={orNumber} onChange={(e) => setOrNumber(e.target.value)} placeholder="e.g., OR-100293" className="mt-1 font-bold text-sla-blue tracking-wide" />
                            </Field>

                            <Field>
                                <FieldLabel>Mode of Payment</FieldLabel>
                                <Select disabled={isPending} value={paymentMethod} onValueChange={setPaymentMethod}>
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

                            <Separator className="my-2" />

                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm font-semibold text-muted-foreground">Computed Remittance:</span>
                                <span className="text-xl font-bold text-sla-blue">
                                    ₱{allocations.reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <Button 
                                onClick={submitPaymentForm} 
                                disabled={!selectedParentId || allocations.length === 0 || isPending} 
                                className="w-full bg-sla-blue text-white py-6 font-bold mt-2 flex items-center justify-center gap-2"
                            >
                                {isPending ? "Saving Transaction Record..." : "Commit Transaction Entry"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 🖨️ RECEIPT PRINT MODAL */}
            <Dialog open={isReceiptModalOpen} onOpenChange={handleCloseReceiptModal}>
                <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-2xl border">
                    <DialogHeader className="print:hidden flex flex-col items-center text-center border-b pb-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                        <DialogTitle className="text-xl font-bold text-slate-900 mt-2">Transaction Saved Successfully</DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">Ledger records updated. Provide a printed verification draft to the parent below.</p>
                    </DialogHeader>

                    <div id="printable-receipt-area" className="flex flex-col pt-2 font-mono text-xs text-slate-800">
                        <div className="text-center flex flex-col gap-0.5 pb-4 border-b border-dashed border-slate-400">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">St. Louisse Academy</h2>
                            <p className="text-[10px] text-slate-500">Official Student Account Collection Summary</p>
                            <p className="text-[10px] text-slate-500">{new Date().toLocaleString()}</p>
                        </div>

                        <div className="py-4 flex flex-col gap-1.5 border-b border-dashed border-slate-400">
                            <div className="flex justify-between">
                                <span className="text-slate-500">OFFICIAL RECEIPT:</span>
                                <span className="font-bold text-slate-900">{orNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">ACCOUNT PAYER:</span>
                                <span className="font-bold text-slate-900 uppercase">
                                    {selectedParentData ? `${selectedParentData.first_name} ${selectedParentData.last_name}` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">PAYMENT METHOD:</span>
                                <span className="font-bold text-slate-900">{paymentMethod}</span>
                            </div>
                        </div>

                        <div className="py-4 flex flex-col gap-3 border-b border-dashed border-slate-400">
                            <p className="font-bold text-[10px] tracking-wider text-slate-400 uppercase">Student Distribution Log</p>
                            {allocations.map((row, idx) => (
                                <div key={idx} className="flex flex-col gap-0.5 bg-slate-50 p-2 rounded border border-slate-100">
                                    <div className="flex justify-between font-bold text-slate-900">
                                        <span>{row.studentName} ({row.gradeLevel})</span>
                                        <span>₱{Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 italic">
                                        <span>Milestone Target: {row.indicatorName}</span>
                                        <span>Post Balance: ₱{(row.remainingBalance - Number(row.amount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-900">TOTAL REMITTED:</span>
                            <span className="text-lg font-black text-sla-blue border-b-2 border-double border-slate-900 px-1">
                                ₱{allocations.reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="print:hidden flex gap-2 border-t pt-4 mt-4 w-full">
                        <Button variant="outline" onClick={handleCloseReceiptModal} className="flex-1 text-slate-700">
                            Close & Exit
                        </Button>
                        <Button onClick={() => window.print()} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
                            <Printer className="w-4 h-4" /> Print Receipt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}