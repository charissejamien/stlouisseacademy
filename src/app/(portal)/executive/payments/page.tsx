// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Search, Plus, ArrowLeft, User, Check, ChevronsUpDown, Printer, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Field, FieldLabel } from "@/components/ui/field";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem as CustomCommandItem } from "@/components/ui/command";
// import { Separator } from "@/components/ui/separator";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// // Server action bindings
// import { GetBillingPeriods } from "../../payments/actions";
// import { getMasterStudentList } from "../students/actions";
// import { getStudentBalanceProfile, createStudentPayments, getRecentPayments, PaymentTransactionRecord, StudentBalanceProfile } from "./actions";

// // Define structural schemas for structural sub-dependencies
// interface MasterStudentListItem {
//     id: string;
//     student_id: string;
//     first_name: string;
//     last_name: string;
//     grade_level?: string;
// }

// interface BillingPeriodItem {
//     id: string;
//     period_name: string;
// }

// interface AllocationRow {
//     rowId: string;
//     studentId: string;
//     studentName: string;
//     gradeLevel: string;
//     totalTuition: number;
//     remainingBalance: number;       
//     totalBooksFee: number;          
//     remainingBooksBalance: number;  
//     indicatorName: string;          
//     amount: string;
//     allocationType: "tuition" | "books"; 
// }

// interface AddPaymentProps {
//     onBack: () => void;
// }

// export default function ExecutivePaymentsPage() {
//     const [view, setView] = useState<"dashboard" | "add-payment">("dashboard");
//     const [mainSearchQuery, setMainSearchQuery] = useState("");

//     const { data: recentPayments = [], isLoading } = useQuery<PaymentTransactionRecord[]>({
//         queryKey: ["recentPayments"],
//         queryFn: getRecentPayments,
//     });

//     if (view === "dashboard") {
//         const filteredPayments = recentPayments.filter((log) => {
//             const query = mainSearchQuery.toLowerCase().trim();
//             if (!query) return true;
//             return (
//                 log.or_number?.toLowerCase().includes(query) ||
//                 log.payee_name?.toLowerCase().includes(query)
//             );
//         });

//         const targetedTenPayments = filteredPayments.slice(0, 10);

//         return (
//             <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-6 antialiased">
//                 <div className="flex justify-between items-center border-b pb-6">
//                     <div>
//                         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Transactions</h1>
//                         <p className="text-sm text-muted-foreground mt-1">Monitor official receipts ledger and register student financial parameters directly.</p>
//                     </div>
//                     <Button onClick={() => setView("add-payment")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-11 flex items-center gap-2 shadow-xs">
//                         <Plus className="w-4 h-4" /> Record a Payment
//                     </Button>
//                 </div>

//                 <Card className="shadow-xs border-slate-200 bg-white">
//                     <CardContent className="pt-6 flex flex-col gap-4">
//                         <div className="relative w-full md:w-96">
//                             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-0.5" />
//                             <Input
//                                 placeholder="Search by OR Number or Payer..."
//                                 value={mainSearchQuery}
//                                 onChange={(e) => setMainSearchQuery(e.target.value)}
//                                 className="pl-9 h-10 text-xs bg-white border-slate-200"
//                             />
//                         </div>

//                         <Table>
//                             <TableHeader className="bg-slate-50/70">
//                                 <TableRow>
//                                     <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">OR Number</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Payee</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transaction Date</TableHead>
//                                     <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Channel</TableHead>
//                                     <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Amount</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody className="text-xs text-slate-700">
//                                 {isLoading ? (
//                                     <TableRow>
//                                         <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground italic">
//                                             Retrieving recent transaction logs from the database...
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : targetedTenPayments.length > 0 ? (
//                                     targetedTenPayments.map((log) => (
//                                         <TableRow key={log.id} className="hover:bg-slate-50/40">
//                                             <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{log.or_number}</td>
//                                             <td className="py-3.5 px-4 font-semibold">{log.payee_name}</td>
//                                             <td className="py-3.5 px-4 text-muted-foreground">
//                                                 {new Date(log.created_at).toLocaleDateString("en-US", {
//                                                     year: "numeric", month: "long", day: "numeric",
//                                                 })}
//                                             </td>
//                                             <td className="py-3.5 px-4 font-medium text-slate-500">{log.mode_of_payment}</td>
//                                             <td className="py-3.5 px-4 text-right font-black text-indigo-600">
//                                                 PHP {Number(log.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                             </td>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground italic">
//                                             No recent payment transactions match your query criteria.
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     return <AddPaymentTransactionScreen onBack={() => setView("dashboard")} />;
// }

// /* -------------------------------------------------------------------------- */

// function AddPaymentTransactionScreen({ onBack }: AddPaymentProps) {
//     const paymentMethods = ["Cash", "G-Cash", "Bank Transfer", "Check"];
//     const queryClient = useQueryClient();

//     const { data: studentsList = [] } = useQuery<MasterStudentListItem[]>({ 
//         queryKey: ["masterStudentList"], 
//         queryFn: () => getMasterStudentList() as Promise<MasterStudentListItem[]>
//     });
    
//     const { data: billingPeriods = [] } = useQuery<BillingPeriodItem[]>({ 
//         queryKey: ["billingPeriods"], 
//         queryFn: GetBillingPeriods as () => Promise<BillingPeriodItem[]> 
//     });

//     const [studentComboOpen, setStudentComboOpen] = useState(false);
//     const [orNumber, setOrNumber] = useState("");
//     const [paymentMethod, setPaymentMethod] = useState("Cash");
//     const [allocations, setAllocations] = useState<AllocationRow[]>([]);
//     const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

//     const [transactionDate, setTransactionDate] = useState(() => {
//         const today = new Date();
//         const offset = today.getTimezoneOffset();
//         const localToday = new Date(today.getTime() - (offset * 60 * 1000));
//         return localToday.toISOString().split("T")[0];
//     });

//     const handleCloseReceiptModal = () => {
//         setIsReceiptModalOpen(false);
//         onBack();
//     };

//     const { mutate: processPayment, isPending } = useMutation({
//         mutationFn: createStudentPayments,
//         onSuccess: () => {
//             toast.success("Student payment split entries committed safely!");
//             queryClient.invalidateQueries({ queryKey: ["recentPayments"] });
//             setIsReceiptModalOpen(true);
//         },
//         onError: (error: Error) => {
//             toast.error(`Database Error: ${error.message}`);
//         }
//     });

//     // Appends multiple separate students cleanly to the allocation stack
//     const handleSelectStudent = async (uuid: string) => {
//         setStudentComboOpen(false);
        
//         // Block duplicates on form layout
//         if (allocations.some(a => a.studentId === uuid)) {
//             toast.error("This student is already added to the form breakdown block.");
//             return;
//         }

//         const loader = toast.loading("Computing target sibling ledger metrics...");
//         try {
//             const record: StudentBalanceProfile | null = await getStudentBalanceProfile(uuid);
            
//             if (record) {
//                 const newRow: AllocationRow = {
//                     rowId: `row-${Date.now()}-${uuid}`, 
//                     studentId: record.id,
//                     studentName: `${record.firstName} ${record.lastName}`,
//                     gradeLevel: record.gradeLevel,
//                     totalTuition: record.totalTuition,
//                     remainingBalance: record.remainingTuitionBalance,
//                     totalBooksFee: record.totalBooksFee,
//                     remainingBooksBalance: record.remainingBooksBalance,
//                     indicatorName: billingPeriods[0]?.period_name || "",
//                     amount: "",
//                     allocationType: "tuition"
//                 };
//                 setAllocations((prev) => [...prev, newRow]);
//             } else {
//                 toast.error("Failed to parse account card balance records.");
//             }
//         } catch (err) {
//             const errorInstance = err as Error;
//             toast.error(`Could not parse configuration: ${errorInstance.message}`);
//         } finally {
//             toast.dismiss(loader);
//         }
//     };

//     // Adds extra payment split line items for a specific student card block
//     const addExtraRowForStudent = (sample: AllocationRow) => {
//         setAllocations((prev) => [
//             ...prev,
//             {
//                 rowId: `extra-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
//                 studentId: sample.studentId,
//                 studentName: sample.studentName,
//                 gradeLevel: sample.gradeLevel,
//                 totalTuition: sample.totalTuition,
//                 remainingBalance: sample.remainingBalance,
//                 totalBooksFee: sample.totalBooksFee,
//                 remainingBooksBalance: sample.remainingBooksBalance,
//                 indicatorName: "",
//                 amount: "",
//                 allocationType: "tuition"
//             }
//         ]);
//     };

//     const removeRow = (rowId: string) => {
//         setAllocations((prev) => prev.filter((r) => r.rowId !== rowId));
//     };

//     // Remove an entire student context cluster with all their split lines
//     const removeEntireStudentCluster = (studentId: string) => {
//         setAllocations((prev) => prev.filter((r) => r.studentId !== studentId));
//     };

//     const updateRowField = (rowId: string, field: keyof AllocationRow, value: string) => {
//         setAllocations((prev) =>
//             prev.map((r) => {
//                 if (r.rowId === rowId) {
//                     const update: AllocationRow = { ...r, [field]: value };
//                     if (field === "indicatorName") {
//                         update.allocationType = value.includes("Materials") ? "books" : "tuition";
//                     }
//                     return update;
//                 }
//                 return r;
//             })
//         );
//     };

//     const submitPaymentForm = () => {
//         if (allocations.length === 0) return toast.error("Please add at least one student profile allocation.");
//         if (!orNumber.trim()) return toast.error("Please supply a valid Official Receipt (OR) identification string.");
        
//         const trackingValidation = allocations.some(a => !a.indicatorName || !a.amount || Number(a.amount) <= 0);
//         if (trackingValidation) return toast.error("Please verify that every split milestone target contains a valid payment amount.");

//         // SHARED CONTRACT HANDSHAKE: Every child slice loops and maps onto the SAME shared OR number string payload contract!
//         const payload = allocations.map(a => ({
//             student_id: a.studentId,
//             or_number: orNumber,
//             amount: Number(a.amount),
//             mode_of_payment: paymentMethod,
//             payment_specifics: a.allocationType === "books" 
//                 ? "Books & Learning Materials Bundle" 
//                 : a.indicatorName,
//             created_at: new Date(transactionDate).toISOString()
//         }));

//         processPayment(payload);
//     };

//     // Group rows dynamically by studentId for rendering structured layout interfaces
//     const studentGroupIds = Array.from(new Set(allocations.map(a => a.studentId)));

//     return (
//         <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-6 antialiased">
//             <div className="flex items-center gap-4 border-b pb-6">
//                 <Button variant="ghost" size="sm" onClick={onBack} disabled={isPending} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-bold px-0">
//                     <ArrowLeft className="w-4 h-4" /> Back to Dashboard
//                 </Button>
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">Record Student Direct Remittance</h1>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
//                 <div className="xl:col-span-2 flex flex-col gap-6">
            
//                     {/* STEP 1: LOCATE STUDENT PROFILE WINDOW */}
//                     <Card className="shadow-xs border-slate-200 bg-white">
//                         <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Select Student Profile (Add Multiple for Siblings)</CardTitle></CardHeader>
//                         <CardContent>
//                             <Field className="w-full">
//                                 <FieldLabel className="text-xs font-bold text-slate-700">Search Student Name or System ID</FieldLabel>
//                                 <Popover open={studentComboOpen} onOpenChange={setStudentComboOpen}>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" role="combobox" disabled={isPending} className="w-full justify-between mt-1.5 h-10 text-xs text-left text-slate-700 font-normal bg-white border-slate-200">
//                                             <span>Search and append students here...</span>
//                                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-[500px] p-0" align="start">
//                                         <Command>
//                                             <CommandInput placeholder="Type student lookup search terms..." className="text-xs" />
//                                             <CommandList>
//                                                 <CommandEmpty>No students found matching those parameters.</CommandEmpty>
//                                                 <CommandGroup>
//                                                     {studentsList.map((s) => (
//                                                         <CustomCommandItem
//                                                             key={s.id}
//                                                             value={`${s.last_name} ${s.first_name} ${s.student_id}`}
//                                                             onSelect={() => handleSelectStudent(s.id)}
//                                                             className="text-xs cursor-pointer"
//                                                         >
//                                                             <User className="mr-2 h-4 w-4 text-slate-400" />
//                                                             <div className="flex flex-col">
//                                                                 <span className="font-bold text-slate-900">{s.last_name}, {s.first_name}</span>
//                                                                 <span className="text-[10px] text-slate-400">ID Reference: {s.student_id} • Grade: {s.grade_level || "N/A"}</span>
//                                                             </div>
//                                                             <Check className={`ml-auto h-4 w-4 text-indigo-600 ${allocations.some(a => a.studentId === s.id) ? "opacity-100" : "opacity-0"}`} />
//                                                         </CustomCommandItem>
//                                                     ))}
//                                                 </CommandGroup>
//                                             </CommandList>
//                                         </Command>
//                                     </PopoverContent>
//                                 </Popover>
//                             </Field>
//                         </CardContent>
//                     </Card>

//                     {/* STEP 2: RENDER SEPARATE BLOCK ACCORDIONS FOR SELECTED SIBLINGS */}
//                     {studentGroupIds.map((stId) => {
//                         const studentRows = allocations.filter(a => a.studentId === stId);
//                         const baseline = studentRows[0];

//                         return (
//                             <Card key={stId} className="shadow-xs border-slate-200 bg-white animate-in fade-in duration-200">
//                                 <CardHeader className="border-b pb-3 bg-slate-50/40 flex flex-row justify-between items-center">
//                                     <div className="flex items-center gap-2">
//                                         <span className="font-bold text-slate-900 text-sm">{baseline.studentName}</span>
//                                         <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{baseline.gradeLevel}</span>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <Button 
//                                             type="button" 
//                                             variant="outline" 
//                                             size="sm" 
//                                             disabled={isPending}
//                                             onClick={() => addExtraRowForStudent(baseline)}
//                                             className="h-7 text-[11px] font-bold text-indigo-600 border-indigo-100 bg-white hover:bg-indigo-50"
//                                         >
//                                             + Add Allocation
//                                         </Button>
//                                         <Button 
//                                             type="button" 
//                                             variant="ghost" 
//                                             size="sm" 
//                                             disabled={isPending}
//                                             onClick={() => removeEntireStudentCluster(stId)}
//                                             className="h-7 text-[11px] font-bold text-rose-600 hover:bg-rose-50"
//                                         >
//                                             <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Student
//                                         </Button>
//                                     </div>
//                                 </CardHeader>
//                                 <CardContent className="flex flex-col gap-4 pt-4">
//                                     {/* Side-by-Side Dual Ledger Breakdown View */}
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                         <div className="bg-white p-2.5 rounded-lg border text-[11px] flex flex-col gap-1">
//                                             <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tuition Balance</span>
//                                             <span className="font-bold text-indigo-600 text-xs">PHP {baseline.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//                                         </div>
//                                         <div className="bg-white p-2.5 rounded-lg border text-[11px] flex flex-col gap-1">
//                                             <span className="text-[9px] text-amber-600 uppercase font-bold tracking-wider">Books Balance</span>
//                                             <span className="font-bold text-amber-600 text-xs">PHP {baseline.remainingBooksBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
//                                         </div>
//                                     </div>

//                                     {studentRows.map((row) => (
//                                         <div key={row.rowId} className="flex gap-4 items-end bg-slate-50/40 p-3 rounded-xl border border-dashed">
//                                             <Field className="flex-1">
//                                                 <FieldLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Allocation</FieldLabel>
//                                                 <Select disabled={isPending} value={row.indicatorName} onValueChange={(val) => updateRowField(row.rowId, "indicatorName", val)}>
//                                                     <SelectTrigger className="mt-1 bg-white border-slate-200 h-9 text-xs">
//                                                         <SelectValue placeholder="Select destination parameter" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {billingPeriods.map(p => (
//                                                             <SelectItem key={p.id} value={p.period_name} className="text-xs">{p.period_name}</SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </Field>

//                                             <Field className="w-44">
//                                                 <FieldLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</FieldLabel>
//                                                 <Input 
//                                                     type="number" 
//                                                     disabled={isPending}
//                                                     placeholder="0.00" 
//                                                     value={row.amount} 
//                                                     onChange={(e) => updateRowField(row.rowId, "amount", e.target.value)} 
//                                                     className="mt-1 h-9 text-xs font-bold bg-white border-slate-200"
//                                                 />
//                                             </Field>

//                                             {studentRows.length > 1 && (
//                                                 <Button variant="ghost" size="icon" disabled={isPending} onClick={() => removeRow(row.rowId)} className="text-rose-600 h-9 w-9">
//                                                     <Plus className="w-4 h-4 rotate-45" />
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>
//                         );
//                     })}
//                 </div>

//                 {/* SIDEBAR BINDINGS PANEL */}
//                 <div className="xl:col-span-1">
//                     <Card className="shadow-md border-slate-200 bg-white sticky top-6">
//                         <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Details</CardTitle></CardHeader>
//                         <CardContent className="flex flex-col gap-4">
                            
//                             <Field>
//                                 <FieldLabel className="text-xs font-bold text-slate-700">Transaction Date</FieldLabel>
//                                 <Input 
//                                     type="date"
//                                     disabled={isPending}
//                                     value={transactionDate} 
//                                     onChange={(e) => setTransactionDate(e.target.value)}
//                                     className="mt-1.5 bg-white border cursor-pointer text-slate-900 text-xs font-medium h-10" 
//                                     style={{ colorScheme: "light" }}
//                                 />
//                             </Field>

//                             <Field>
//                                 <FieldLabel className="text-xs font-bold text-slate-700">OR Number</FieldLabel>
//                                 <Input disabled={isPending} value={orNumber} onChange={(e) => setOrNumber(e.target.value)} placeholder="e.g., OR-100293" className="mt-1.5 h-10 font-bold text-indigo-600 tracking-wide border-slate-200" />
//                             </Field>

//                             <Field>
//                                 <FieldLabel className="text-xs font-bold text-slate-700">Mode of Payment</FieldLabel>
//                                 <Select disabled={isPending} value={paymentMethod} onValueChange={setPaymentMethod}>
//                                     <SelectTrigger className="mt-1.5 h-10 border-slate-200 text-xs font-medium">
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {paymentMethods.map(m => (
//                                             <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             <Separator className="my-2" />

//                             <div className="flex justify-between items-center py-2 text-xs">
//                                 <span className="font-bold text-slate-400 uppercase tracking-wider">Total Amount</span>
//                                 <span className="text-xl font-black text-indigo-600">
//                                     PHP {allocations.reduce((sum, r) => sum + Number(r.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                                 </span>
//                             </div>

//                             <Button 
//                                 onClick={submitPaymentForm} 
//                                 disabled={allocations.length === 0 || isPending} 
//                                 className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-12 mt-2 flex items-center justify-center gap-2 shadow-xs"
//                             >
//                                 {isPending ? "Posting..." : "Post Transaction"}
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             {/* STATEMENT SLATE PRINT DRAWER MODAL */}
// <Dialog
//     open={isReceiptModalOpen}
//     onOpenChange={handleCloseReceiptModal}
// >
//     <DialogContent
//         className="
//             min-w-2xl
//             max-w-5xl
//             p-0
//             bg-white
//             rounded-xl
//             border
//             shadow-2xl
//             overflow-hidden
//         "
//     >
//         {/* =====================================================
//             PRINTABLE RECEIPT
//         ====================================================== */}
//         <div className="receipt-print">
//             <div className="receipt-paper p-6 text-black bg-white">

//                 {/* =================================================
//                     HEADER
//                 ================================================== */}
//                 <DialogHeader className="space-y-0">
//                     <div className="flex justify-between items-start gap-6">

//                         {/* School / Business Information */}
//                         <div className="flex-1">
//                             <h2 className="text-xl font-bold tracking-tight">
//                                 St. Louisse Academy Inc.
//                             </h2>

//                             <p className="text-[10px] text-slate-700 mt-0.5">
//                                 P. Burgos St., Poblacion, Daanbantayan, Cebu
//                             </p>

//                             <p className="text-[10px] font-medium mt-1">
//                                 VAT REG TIN:
//                             </p>
//                         </div>

//                         {/* Invoice Information */}
//                         <div className="text-right min-w-[170px]">
//                             <p className="text-xl font-bold text-blue-700 tracking-tight">
//                                 SERVICE INVOICE
//                             </p>

//                             <p className="text-base font-bold mt-1">
//                                 NO. 00{orNumber}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Date */}
//                     <div className="flex justify-end mt-2">
//                         <div className="text-[10px]">
//                             <span className="font-semibold">
//                                 DATE:
//                             </span>{" "}

//                             {new Date(transactionDate).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                 }
//                             )}
//                         </div>
//                     </div>
//                 </DialogHeader>


//                 {/* =================================================
//                     MAIN RECEIPT BODY
//                 ================================================== */}
//                 <div className="flex gap-3 mt-4">

//                     {/* =================================================
//                         LEFT SIDE — 75%
//                     ================================================== */}
//                     <div className="w-3/4">

//                         {/* =================================================
//                             CUSTOMER INFORMATION
//                         ================================================== */}
//                         <div className="border border-black/70">
//                             <div className="grid grid-cols-2">

//                                 {/* Customer Name */}
//                                 <div className="border-r border-black/50 px-3 py-2">
//                                     <p className="text-[9px] font-bold text-slate-500">
//                                         CUSTOMER NAME
//                                     </p>

//                                     <p className="text-[11px] font-semibold min-h-[16px]">
//                                         &nbsp;
//                                     </p>
//                                 </div>

//                                 {/* TIN */}
//                                 <div className="px-3 py-2">
//                                     <p className="text-[9px] font-bold text-slate-500">
//                                         TIN
//                                     </p>

//                                     <p className="text-[11px] font-semibold min-h-[16px]">
//                                         &nbsp;
//                                     </p>
//                                 </div>

//                                 {/* Address */}
//                                 <div className="border-t border-r border-black/50 px-3 py-2">
//                                     <p className="text-[9px] font-bold text-slate-500">
//                                         ADDRESS
//                                     </p>

//                                     <p className="text-[11px] font-semibold min-h-[16px]">
//                                         &nbsp;
//                                     </p>
//                                 </div>

//                                 {/* Business Style */}
//                                 <div className="border-t border-black/50 px-3 py-2">
//                                     <p className="text-[9px] font-bold text-slate-500">
//                                         BUSINESS STYLE
//                                     </p>

//                                     <p className="text-[11px] font-semibold min-h-[16px]">
//                                         &nbsp;
//                                     </p>
//                                 </div>

//                             </div>
//                         </div>


//                         {/* =================================================
//                             PAYMENTS TABLE
//                         ================================================== */}
//                         <div className="mt-4">
//                             <table className="w-full border-collapse border border-black/70 table-fixed">

//                                 <thead>
//                                     <tr className="bg-slate-100">

//                                         <th className="w-[7%] border border-black/60 px-2 py-2 text-[9px] font-bold text-center">
//                                             QTY
//                                         </th>

//                                         <th className="w-[48%] border border-black/60 px-2 py-2 text-[9px] font-bold text-left">
//                                             DESCRIPTION / STUDENT
//                                         </th>

//                                         <th className="w-[20%] border border-black/60 px-2 py-2 text-[9px] font-bold text-left">
//                                             REFERENCE
//                                         </th>

//                                         <th className="w-[25%] border border-black/60 px-2 py-2 text-[9px] font-bold text-right">
//                                             AMOUNT
//                                         </th>

//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {Array.from({
//                                         length: Math.max(7, allocations?.length || 0),
//                                     }).map((_, idx) => {
//                                         const row = allocations?.[idx];

//                                         return (
//                                             <tr
//                                                 key={idx}
//                                                 className="h-[30px]"
//                                             >

//                                                 {/* QTY */}
//                                                 <td className="border border-black/50 px-2 py-1 text-[9px] text-center align-middle">
//                                                     {row ? "1" : ""}
//                                                 </td>

//                                                 {/* DESCRIPTION */}
//                                                 <td className="border border-black/50 px-2 py-1 text-[9px] align-middle">
//                                                     {row ? (
//                                                         <div className="flex flex-col">
//                                                             <span className="font-bold">
//                                                                 {row.studentName}
//                                                             </span>

//                                                             <span className="text-[8px] text-slate-500">
//                                                                 {row.indicatorName}
//                                                             </span>
//                                                         </div>
//                                                     ) : (
//                                                         <span>
//                                                             &nbsp;
//                                                         </span>
//                                                     )}
//                                                 </td>

//                                                 {/* REFERENCE */}
//                                                 <td className="border border-black/50 px-2 py-1 text-[9px] align-middle">
//                                                     {row?.indicatorName
//                                                         ? row.indicatorName.slice(0, 18)
//                                                         : ""}
//                                                 </td>

//                                                 {/* AMOUNT */}
//                                                 <td className="border border-black/50 px-2 py-1 text-[9px] text-right font-semibold align-middle">
//                                                     {row
//                                                         ? `PHP ${Number(
//                                                               row.amount || 0
//                                                           ).toLocaleString(
//                                                               undefined,
//                                                               {
//                                                                   minimumFractionDigits: 2,
//                                                                   maximumFractionDigits: 2,
//                                                               }
//                                                           )}`
//                                                         : ""}
//                                                 </td>

//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>

//                             </table>
//                         </div>


//                         {/* =================================================
//                             PRINTER INFORMATION
//                         ================================================== */}
//                         <div className="mt-5 border border-black/60">

//                             {/* Row 1 */}
//                             <div className="grid grid-cols-3">

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-2 py-1 text-[7px] font-bold text-center">
//                                         PROPRIETOR NAME
//                                     </p>

//                                     <p className="px-2 py-1.5 text-[8px] font-medium text-center">
//                                         Cebu Godspeed Printers
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-2 py-1 text-[7px] font-bold text-center">
//                                         PRINTER'S NAME
//                                     </p>

//                                     <p className="px-2 py-1.5 text-[8px] font-medium text-center">
//                                         Katharine C. Lerias
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="bg-slate-100 border-b border-black/40 px-2 py-1 text-[7px] font-bold text-center">
//                                         PRINTER'S CONTACT NUMBER
//                                     </p>

//                                     <p className="px-2 py-1.5 text-[8px] font-medium text-center">
//                                         272-1031 / 516-1653
//                                     </p>
//                                 </div>

//                             </div>


//                             {/* Row 2 */}
//                             <div className="grid grid-cols-5 border-t border-black/40">

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         TIN
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         243-222-565-000000 VAT REG.
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         ADDRESS
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         Little Baguio, Cogon, Pardo
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         PRINTER'S ACCREDITATION NO.
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         082MP20190000000003
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         DATE ISSUED
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         Jan. 08, 2019
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         EXPIRY DATE
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         Jan. 08, 2024
//                                     </p>
//                                 </div>

//                             </div>


//                             {/* Row 3 */}
//                             <div className="grid grid-cols-4 border-t border-black/40">

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         PTU NO.
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         BOUND
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         NO. OF BOOKS/PADS
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         300
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         SETS PER BKLT
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         50
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         COPIES PER SET
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         2
//                                     </p>
//                                 </div>

//                             </div>


//                             {/* Row 4 */}
//                             <div className="grid grid-cols-4 border-t border-black/40">

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         SERIAL NO.
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         7,501-22,500
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         BIR ATP NO.
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         OCN2AU0002596843
//                                     </p>
//                                 </div>

//                                 <div className="border-r border-black/40">
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         DATE ISSUED
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         01/19/21
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <p className="bg-slate-100 border-b border-black/40 px-1 py-1 text-[7px] font-bold text-center">
//                                         VALID UNTIL
//                                     </p>

//                                     <p className="px-1 py-1.5 text-[7px] font-medium text-center">
//                                         01/19/26
//                                     </p>
//                                 </div>

//                             </div>

//                         </div>

//                     </div>


//                     {/* =================================================
//                         RIGHT SIDE — 25%
//                     ================================================== */}
//                     <div className="w-1/4 flex flex-col">

//                         {/* OSCA / PWD */}
//                         <div className="border border-black/60">

//                             <div className="px-2 py-2 border-b border-black/40">
//                                 <p className="text-[8px] font-bold">
//                                     OSCA/PWD NO.
//                                 </p>

//                                 <div className="h-5 mt-1 border-b border-black/40">
//                                     &nbsp;
//                                 </div>
//                             </div>

//                             <div className="px-2 py-2">
//                                 <p className="text-[8px] font-bold">
//                                     SIGNATURE
//                                 </p>

//                                 <div className="h-7 mt-1">
//                                     &nbsp;
//                                 </div>
//                             </div>

//                         </div>


//                         {/* =================================================
//                             BIR AMOUNT SECTION
//                         ================================================== */}
//                         <div className="mt-3 border border-black/70">

//                             <div className="flex justify-between items-center border-b border-black/60 px-2 py-2 min-h-[34px]">
//                                 <span className="text-[8px] font-bold">
//                                     TOTAL SALES
//                                 </span>

//                                 <span className="text-[9px] font-semibold">
//                                     PHP{" "}
//                                     {allocations
//                                         ?.reduce(
//                                             (sum, row) =>
//                                                 sum + Number(row.amount || 0),
//                                             0
//                                         )
//                                         .toLocaleString(undefined, {
//                                             minimumFractionDigits: 2,
//                                         })}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center border-b border-black/60 px-2 py-2 min-h-[40px]">
//                                 <span className="text-[8px] font-bold leading-tight">
//                                     LESS:
//                                     <br />
//                                     SC/PWD DISC.
//                                 </span>

//                                 <span className="text-[9px] font-semibold">
//                                     PHP 0.00
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center border-b border-black/60 px-2 py-2 min-h-[34px]">
//                                 <span className="text-[8px] font-bold">
//                                     TOTAL DUE
//                                 </span>

//                                 <span className="text-[9px] font-semibold">
//                                     PHP{" "}
//                                     {allocations
//                                         ?.reduce(
//                                             (sum, row) =>
//                                                 sum + Number(row.amount || 0),
//                                             0
//                                         )
//                                         .toLocaleString(undefined, {
//                                             minimumFractionDigits: 2,
//                                         })}
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center border-b border-black/60 px-2 py-2 min-h-[40px]">
//                                 <span className="text-[8px] font-bold leading-tight">
//                                     LESS:
//                                     <br />
//                                     WITHHOLDING
//                                 </span>

//                                 <span className="text-[9px] font-semibold">
//                                     PHP 0.00
//                                 </span>
//                             </div>

//                             <div className="flex justify-between items-center border-b border-black/60 bg-slate-50 px-2 py-3 min-h-[42px]">
//                                 <span className="text-[8px] font-black leading-tight">
//                                     TOTAL
//                                     <br />
//                                     AMOUNT DUE
//                                 </span>

//                                 <span className="text-[10px] font-black">
//                                     PHP{" "}
//                                     {allocations
//                                         ?.reduce(
//                                             (sum, row) =>
//                                                 sum + Number(row.amount || 0),
//                                             0
//                                         )
//                                         .toLocaleString(undefined, {
//                                             minimumFractionDigits: 2,
//                                         })}
//                                 </span>
//                             </div>

//                             <div className="px-2 py-3 min-h-[72px]">
//                                 <p className="text-[8px] font-bold leading-tight">
//                                     SALES SUBJECT TO
//                                     <br />
//                                     PERCENTAGE TAX
//                                     <br />
//                                     EXEMPT SALES
//                                 </p>

//                                 <div className="mt-2 text-right text-[9px]">
//                                     PHP 0.00
//                                 </div>
//                             </div>

//                         </div>


//                         {/* =================================================
//                             PAYMENT METHOD
//                         ================================================== */}
//                         <div className="mt-3 border border-black/60 px-2 py-2">

//                             <p className="text-[8px] font-bold mb-2">
//                                 PAYMENT METHOD
//                             </p>

//                             <div className="flex justify-between text-[8px] font-medium">
//                                 <span>□ CASH</span>
//                                 <span>□ CHECK</span>
//                                 <span>□ CREDIT</span>
//                             </div>

//                         </div>


//                         {/* =================================================
//                             CASHIER
//                         ================================================== */}
//                         <div className="mt-auto pt-8 px-3 flex flex-col items-center">

//                             <div className="w-full border-t border-black pt-1">
//                                 <p className="text-[8px] text-center font-semibold">
//                                     CASHIER/AUTHORIZED SIGNATURE
//                                 </p>
//                             </div>

//                             <p className="text-[8px] text-center font-medium mt-5 leading-tight">
//                                 "THIS DOCUMENT IS NOT VALID FOR
//                                 <br />
//                                 CLAIM OF INPUT TAX"
//                             </p>

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         </div>


//         {/* =====================================================
//             SCREEN-ONLY FOOTER
//         ====================================================== */}
//         <DialogFooter
//             className="
//                 print-hidden
//                 flex
//                 gap-2
//                 border-t
//                 bg-slate-50
//                 px-6
//                 py-4
//                 w-full
//             "
//         >
//             <Button
//                 variant="outline"
//                 onClick={handleCloseReceiptModal}
//                 className="
//                     flex-1
//                     text-slate-700
//                     h-10
//                     font-bold
//                     text-xs
//                     bg-white
//                 "
//             >
//                 Close & Exit
//             </Button>

//             <Button
//                 onClick={() => window.print()}
//                 className="
//                     flex-1
//                     bg-emerald-600
//                     hover:bg-emerald-700
//                     text-white
//                     font-bold
//                     text-xs
//                     h-10
//                     flex
//                     items-center
//                     justify-center
//                     gap-2
//                 "
//             >
//                 <Printer className="w-4 h-4" />
//                 Print Receipt
//             </Button>
//         </DialogFooter>

//     </DialogContent>
// </Dialog>
//         </div>
//     );
// }