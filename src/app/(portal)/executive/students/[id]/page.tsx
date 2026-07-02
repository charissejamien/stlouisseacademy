"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    CalendarDays, 
    User, 
    GraduationCap, 
    ShieldCheck, 
    CreditCard, 
    Receipt, 
    Clock,
    UserCheck,
    Loader2,
    UserCog,
    VenusAndMars,
    Tag,
    Percent
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getGradeLevels, getSchoolYears } from "@/app/(portal)/admin/configuration/actions"; 
import { 
    getStudentInformation, 
    CompleteStudentProfile, 
    updateStudentProfileRegistry, 
    getAvailableDiscountOptions, 
    syncStudentDiscounts 
} from "../actions";

export default function StudentProfileView() {
    interface SchoolYearRecord { id: string; start_year: number; end_year: number; is_active: boolean; }
    
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const studentId = params?.id as string;

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
    
    // 🎯 Tracks multiple stacked toggles inside state array
    const [selectedDiscountIds, setSelectedDiscountIds] = useState<string[]>([]);

    // Profile inputs states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentGender, setStudentGender] = useState(""); 
    const [selectedGradeLevel, setSelectedGradeLevel] = useState("");

    const { data: levels } = useQuery({ queryKey: ["levels"], queryFn: getGradeLevels });
    const { data: schoolYears = [] } = useQuery({ queryKey: ["schoolYears"], queryFn: getSchoolYears });
    const { data: discountOptions = [] } = useQuery({ queryKey: ["discountOptions"], queryFn: getAvailableDiscountOptions });

    const { data: student, isLoading, error } = useQuery<CompleteStudentProfile>({
        queryKey: ["students", studentId],
        queryFn: () => getStudentInformation(studentId),
        enabled: !!studentId
    });

    const { mutate: executeProfileUpdate, isPending: isSaving } = useMutation({
        mutationFn: updateStudentProfileRegistry,
        onSuccess: () => {
            toast.success("Profile records updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["students", studentId] });
            setIsEditDialogOpen(false);
        },
        onError: (err: Error) => toast.error(err.message)
    });

    const { mutate: executeSyncDiscounts, isPending: isSyncingDiscounts } = useMutation({
        mutationFn: syncStudentDiscounts,
        onSuccess: () => {
            toast.success("Discounts updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["students", studentId] });
            setIsDiscountDialogOpen(false);
        },
        onError: (err: Error) => toast.error(err.message)
    });

    // Handle user clicking buttons inside the modal
    const handleToggleDiscount = (id: string) => {
        setSelectedDiscountIds((prev) => 
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // 🎯 Group discounts cleanly by category for layout rendering
    const categoriesMap = discountOptions.reduce((acc: Record<string, typeof discountOptions>, item) => {
        const cat = item.category || "General Incentives";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">Loading student profile ledger files...</span>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="w-[90%] max-w-5xl mx-auto my-10 text-center p-12 border border-dashed rounded-xl bg-rose-50/50 text-rose-700 font-medium">
                <p>Failed to sync student file details.</p>
                <Button onClick={() => router.back()} size="sm" variant="outline" className="mt-4 bg-white text-rose-700">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="w-[90%] max-w-5xl mx-auto my-10 flex flex-col gap-6 antialiased">
            <div>
                <Button onClick={() => router.back()} variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-0">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Master Directory</span>
                </Button>
            </div>

            {/* MASTER PROFILE INSIGHT CARD */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
                    <div className="p-6 flex flex-col items-center justify-center bg-slate-50/40 text-center col-span-1">
                        <div className="w-28 h-28 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 relative overflow-hidden">
                            <User className="w-12 h-12 stroke-[1.5]" />
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-600 mt-4 tracking-wider">ID: {student.student_id}</span>
                        <span className="mt-1.5 px-2 py-0.5 bg-slate-100 border text-slate-700 font-bold text-[10px] rounded-md uppercase tracking-wider">{student.classification}</span>
                    </div>

                    <div className="p-6 md:p-8 col-span-3 flex flex-col justify-between gap-6 relative">
                        <div className="absolute top-6 right-6 md:top-8 md:right-8">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setFirstName(student.first_name); 
                                        setLastName(student.last_name); 
                                        setStudentGender(student.gender); 
                                        setSelectedGradeLevel(student.grade_level);
                                        setIsEditDialogOpen(true);
                                    }} className="h-8 text-xs font-bold text-slate-600 border-slate-200 flex items-center gap-1.5 px-3 rounded-lg shadow-3xs">
                                        <UserCog className="w-3.5 h-3.5" />
                                        <span>Modify Record</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg bg-white p-6 shadow-2xl rounded-xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-base font-black text-slate-900">Edit Student Information</DialogTitle>
                                        <DialogDescription className="text-xs mt-0.5">Update student biographical data records cleanly.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                                        <Field className="flex flex-col gap-1"><Label className="font-bold">First Name</Label><Input disabled={isSaving} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
                                        <Field className="flex flex-col gap-1"><Label className="font-bold">Last Name</Label><Input disabled={isSaving} value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
                                        <Field className="col-span-2 flex flex-col gap-1">
                                            <Label className="font-bold">Gender</Label>
                                            <Select value={studentGender} onValueChange={setStudentGender}>
                                                <SelectTrigger className="w-full h-10 text-xs bg-white"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                                            </Select>
                                        </Field>
                                        <Field className="col-span-2 flex flex-col gap-1">
                                            <Label className="font-bold">Grade Level</Label>
                                            <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                                                <SelectTrigger className="w-full h-10 text-xs bg-white"><SelectValue placeholder="Select grade" /></SelectTrigger>
                                                <SelectContent>{levels?.map((d, i) => <SelectItem key={i} value={d.grade_level}>{d.grade_level}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </Field>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-xs font-bold flex-1">Cancel</Button>
                                        <Button onClick={() => executeProfileUpdate({ studentId, schoolYearId: (schoolYears as SchoolYearRecord[]).find(s => s.is_active)?.id || "", editedBy: "Registrar", firstName, lastName, gender: studentGender, gradeLevel: selectedGradeLevel, classroomSection: "", facultyAdvisor: "" })} className="text-xs h-10 font-bold bg-indigo-600 text-white flex-1">{isSaving ? "Saving..." : "Commit Modifications"}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase text-slate-400">Student Profile</span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{student.last_name}, {student.first_name}</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t pt-5">
                            <div className="flex items-start gap-2.5"><GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" /><div className="min-w-0"><h4 className="text-[10px] font-bold text-slate-400 uppercase">Grade</h4><p className="text-xs font-bold text-slate-800 truncate">{student.grade_level}</p></div></div>
                            <div className="flex items-start gap-2.5"><VenusAndMars className="w-4 h-4 text-slate-400 mt-0.5" /><div className="min-w-0"><h4 className="text-[10px] font-bold text-slate-400 uppercase">Gender</h4><p className="text-xs font-bold text-slate-800 truncate">{student.gender}</p></div></div>
                            <div className="flex items-start gap-2.5"><ShieldCheck className="w-4 h-4 text-slate-400 mt-0.5" /><div className="min-w-0"><h4 className="text-[10px] font-bold text-slate-400 uppercase">Section</h4><p className="text-xs font-bold text-slate-800 truncate">{student.section_name}</p></div></div>
                            <div className="flex items-start gap-2.5"><UserCheck className="w-4 h-4 text-slate-400 mt-0.5" /><div className="min-w-0"><h4 className="text-[10px] font-bold text-slate-400 uppercase">Advisor</h4><p className="text-xs font-bold text-slate-800 truncate">{student.advisor_name}</p></div></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* LOWER FINANCIAL BREAKDOWNS CLUSTER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* FINANCIAL ACCOUNT BALANCE CARD */}
                <Card className="shadow-sm border-slate-200 bg-white md:col-span-1 h-full flex flex-col">
                    <CardHeader className="border-b pb-4 bg-slate-50/20 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span>Financial Balance</span>
                        </CardTitle>

                        {/* 🎯 OVERHAULED MODAL DESIGN USING ACTION BUTTON SELECTION CLUSTERS */}
                        <Dialog open={isDiscountDialogOpen} onOpenChange={(open) => {
                            if (open) {
                                // Safe, clean inline trigger allocation to block recursive state lurches
                                setSelectedDiscountIds(student?.applied_discount_ids ?? []);
                            }
                            setIsDiscountDialogOpen(open);
                        }}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 text-[10px] font-extrabold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200 rounded-md flex items-center gap-1 px-2.5 shadow-3xs">
                                    <Percent className="w-3 h-3 stroke-[2.5]" />
                                    <span>Manage Discounts</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md bg-white p-6 shadow-2xl rounded-xl border flex flex-col gap-4">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-black text-slate-900">Manage Multi-Discounts</DialogTitle>
                                    <DialogDescription className="text-xs mt-0.5">Click items to activate or deactivate stacked ledger reductions.</DialogDescription>
                                </DialogHeader>
                                
                                {/* 🎯 BUTTON SELECTION INTERFACE DIRECTLY INJECTIONS */}
                                <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1 py-1">
                                    {Object.keys(categoriesMap).length === 0 ? (
                                        <p className="text-xs text-slate-400 italic text-center py-4">No discount structures templates available.</p>
                                    ) : (
                                        Object.keys(categoriesMap).map((categoryName) => (
                                            <div key={categoryName} className="flex flex-col gap-1.5">
                                                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-0.5">
                                                    {categoryName} Structure
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {categoriesMap[categoryName].map((opt) => {
                                                        const isSelected = selectedDiscountIds.includes(opt.id);
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={opt.id}
                                                                onClick={() => handleToggleDiscount(opt.id)}
                                                                className={`h-9 px-3 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 shadow-3xs select-none ${
                                                                    isSelected
                                                                        ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                                                                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                                                                }`}
                                                            >
                                                                <Tag className={`w-3 h-3 ${isSelected ? "text-indigo-200" : "text-slate-400"}`} />
                                                                <span>{opt.name}</span>
                                                                <span className={`text-[10px] px-1 py-0.5 rounded ml-0.5 font-extrabold ${
                                                                    isSelected ? "bg-indigo-700 text-indigo-100" : "bg-slate-200/60 text-slate-600"
                                                                }`}>
                                                                    -{opt.amount}%
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <DialogFooter className="border-t pt-4">
                                    <Button variant="outline" size="sm" onClick={() => setIsDiscountDialogOpen(false)} className="text-xs font-bold h-9 flex-1">Cancel</Button>
                                    <Button size="sm" disabled={isSyncingDiscounts} onClick={() => executeSyncDiscounts({ studentId, discountIds: selectedDiscountIds })} className="text-xs h-9 font-bold bg-indigo-600 text-white flex-1 shadow-xs">
                                        {isSyncingDiscounts ? "Recalculating..." : "Apply Stacked Incentives"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    
                    <CardContent className="pt-5 flex flex-col gap-4 flex-1 justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b pb-2 text-xs">
                                <span className="text-slate-400 font-medium">Enrollment Date:</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> {student.date_enrolled}
                                </span>
                            </div>

                            {/* Tuition Ledger Breakdown Card Box */}
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 text-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Tuition Ledger Breakdowns</span>
                                
                                <div className="flex justify-between text-slate-500">
                                    <span>Base Tuition Fee:</span>
                                    <span className="font-semibold text-slate-700">₱{student.base_tuition.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 border-b pb-2">
                                    <span>Miscellaneous Fees:</span>
                                    <span className="font-semibold text-slate-700">₱{student.miscellaneous_fees.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="flex justify-between text-slate-500 pt-0.5">
                                    <span>Gross Assessment:</span>
                                    <span className="font-medium text-slate-600">₱{student.gross_tuition_total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>

                                {student.total_discounts_deducted > 0 && (
                                    <div className="bg-white/80 border border-indigo-100 p-2 rounded-lg flex flex-col gap-1 text-[11px] mt-1">
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                                            <Tag className="w-2.5 h-2.5 text-indigo-500" />
                                            <span>Active Applied Concessions (Base Only)</span>
                                        </div>
                                        <p className="font-semibold text-slate-700 text-[10px] leading-relaxed">
                                            {student.discount_summary_text}
                                        </p>
                                        <div className="flex justify-between font-bold text-[10px] text-indigo-700 border-t border-indigo-50/50 pt-1 mt-0.5">
                                            <span>Deduction Total:</span>
                                            <span>-₱{student.total_discounts_deducted.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between text-slate-500 mt-1">
                                    <span>Net Charged Assessment:</span>
                                    <span className="font-semibold text-slate-700">₱{student.total_assessment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 border-b pb-2">
                                    <span>Liquidated Payments:</span>
                                    <span className="font-semibold text-emerald-600">₱{student.total_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                
                                <div className="flex justify-between font-bold pt-1 text-slate-900 text-sm">
                                    <span>Tuition Running Due:</span>
                                    <span className={student.tuition_balance === 0 ? "text-emerald-600" : "text-slate-900"}>
                                        ₱{student.tuition_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Books Ledger Card Box */}
                            <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1.5 text-xs mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Books Ledger</span>
                                <div className="flex justify-between text-slate-500">
                                    <span>Gross Assessment:</span>
                                    <span className="font-semibold text-slate-700">₱{student.total_books_fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 border-b pb-1.5">
                                    <span>Liquidated Payments:</span>
                                    <span className="font-semibold text-emerald-700">₱{student.total_books_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between font-bold pt-0.5 text-slate-800">
                                    <span>Books Running Due:</span>
                                    <span className={student.books_balance === 0 ? "text-emerald-600" : "text-slate-900"}>
                                        ₱{student.books_balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Combined Total Aggregate */}
                        <div className={`p-4 rounded-xl border border-dashed mt-4 flex flex-col gap-1 ${
                            student.balance_remaining === 0 ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" : "bg-rose-50/50 border-rose-200 text-rose-900"
                        }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Combined Running Balance</span>
                            <span className="text-2xl font-black tracking-tight">
                                ₱{student.balance_remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium mt-1">
                                <Clock className="w-3 h-3" />
                                <span>{student.balance_remaining === 0 ? "Fully Settled" : "Outstanding Deficit Balance"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PAYMENTS HISTORY ARCHIVE TABLE */}
                <Card className="shadow-sm border-slate-200 bg-white md:col-span-2 h-full">
                    <CardHeader className="border-b pb-4">
                        <CardTitle className="text-xs py-2 font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-slate-400" />
                            <span>Payments History</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/60 border-b text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                    <th className="py-3 px-5">OR Number</th>
                                    <th className="py-3 px-5">Specifics</th>
                                    <th className="py-3 px-5">MOP</th>
                                    <th className="py-3 px-5 text-right">Amount Paid</th>
                                    <th className="py-3 px-5">Posting Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y text-slate-600">
                                {student.transactions && student.transactions.length > 0 ? (
                                    student.transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-slate-50/30">
                                            <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{txn.id}</td>
                                            <td className="py-3.5 px-5 font-semibold text-slate-700">{txn.context}</td>
                                            <td className="py-3.5 px-5 font-medium text-slate-500">{txn.method}</td>
                                            <td className="py-3.5 px-5 text-right font-bold text-slate-900">₱{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="py-3.5 px-5 text-muted-foreground">{txn.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="py-12 text-center text-sm text-muted-foreground italic font-medium">No processing records found inside history.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}