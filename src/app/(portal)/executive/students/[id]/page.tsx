"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    UserCog
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// 📚 Server action imports
import { getGradeLevels } from "@/app/(portal)/admin/configuration/actions";
import { getSchoolYears } from "@/app/(portal)/admin/configuration/actions"; // 🌟 INJECTED: Dynamic school year fetcher
import { getStudentInformation, CompleteStudentProfile} from "../actions";
import { updateStudentProfileRegistry, UpdateStudentProfilePayload } from "../actions";

export default function StudentProfileView() {

    interface SchoolYearRecord {
        id: string;
        start_year: number;
        end_year: number;
        is_active: boolean;
    }
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    // Grab your dynamic ID string parameter slot cleanly
    const studentId = params?.id as string;

    // ⚡ Local state parameters for form management
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selectedGradeLevel, setSelectedGradeLevel] = useState("");
    const [classroomSection, setClassroomSection] = useState("");
    const [facultyAdvisor, setFacultyAdvisor] = useState("");

    // 🔄 Fetch institutional drop-down lookup arrays cleanly via TanStack Query
    const { data: levels } = useQuery({ queryKey: ["levels"], queryFn: getGradeLevels });
    
    // 🌟 INJECTED: Dynamic institutional academic year dataset listener query
    const { data: schoolYears = [] } = useQuery({ queryKey: ["schoolYears"], queryFn: getSchoolYears });

    // ✅ Securely fetch your dynamic server student payload matching the explicit profile type schema
    const { data: student, isLoading, error } = useQuery<CompleteStudentProfile>({
        queryKey: ["students", studentId],
        queryFn: () => getStudentInformation(studentId),
        enabled: !!studentId
    });

    // Type-safe server mutation pipeline handling sequential audit processing
    const { mutate: executeProfileUpdate, isPending: isSaving } = useMutation({
        mutationFn: updateStudentProfileRegistry,
        onSuccess: () => {
            toast.success("Profile records and audit logs committed successfully!");
            queryClient.invalidateQueries({ queryKey: ["students", studentId] });
            setIsEditDialogOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected validation exception occurred.");
        }
    });

    if (error) {
        return (
            <div className="w-[90%] max-w-5xl mx-auto my-10 text-center p-12 border border-dashed rounded-xl bg-rose-50/50 text-rose-700 font-medium">
                <p>Failed to sync student file matrix details. Verify profile ID parameter mapping.</p>
                <Button onClick={() => router.back()} size="sm" variant="outline" className="mt-4 border-rose-200 text-rose-700 bg-white hover:bg-rose-50">
                    Go Back
                </Button>
            </div>
        );
    }

    // Initialize states purely on interaction event context trigger
    const handleInitializeFormStates = () => {
        if (!student) return;
        setFirstName(student.first_name || "");
        setLastName(student.last_name || "");
        setSelectedGradeLevel(student.grade_level || "");
        setClassroomSection(student.section_name || "");
        setFacultyAdvisor(student.advisor_name || "");
        setIsEditDialogOpen(true);
    };

    const handleSaveChanges = () => {
        if (!firstName.trim() || !lastName.trim()) {
            return toast.error("First name and Last name parameters cannot be blank.");
        }

        // 🌟 FIXED: Explicit type annotation replaces 'any' to satisfy strict ESLint parameters
        const currentActiveTerm = (schoolYears as SchoolYearRecord[]).find(
            (sy: SchoolYearRecord) => sy.is_active === true
        );
        
        if (!currentActiveTerm) {
            return toast.error("Configuration Error: Active school year marker could not be resolved from database tables.");
        }

        const payload: UpdateStudentProfilePayload = {
            studentId,
            schoolYearId: currentActiveTerm.id, // Maps the true relational ID cleanly
            editedBy: "Admin Registrar",
            firstName,
            lastName,
            gradeLevel: selectedGradeLevel,
            classroomSection,
            facultyAdvisor
        };

        executeProfileUpdate(payload);
    };

    return (
        <div className="w-[90%] max-w-5xl mx-auto my-10 flex flex-col gap-6 antialiased">
            
            {/* Back Button Action Link */}
            <div>
                <Button 
                    onClick={() => router.back()}
                    variant="ghost" 
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Master Directory</span>
                </Button>
            </div>

            {/* TOP CARD BLOCK: Profiler Asymmetric Bio Section */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-slate-100">
                    
                    {/* Column 1: Image / Avatar Framing Container */}
                    <div className="p-6 flex flex-col items-center justify-center bg-slate-50/40 text-center col-span-1">
                        <div className="w-28 h-28 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-400 shadow-3xs relative overflow-hidden">
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                            ) : (
                                <User className="w-12 h-12 stroke-[1.5]" />
                            )}
                        </div>
                        
                        {/* Dynamic Student System ID */}
                        <span className="text-xs font-mono font-bold text-indigo-600 mt-4 tracking-wider">
                            ID: {isLoading ? "---" : student?.student_id}
                        </span>
                        
                        {/* Classification Badge (e.g., Regular, Scholar) */}
                        <span className="mt-1.5 px-2 py-0.5 bg-slate-100 border text-slate-700 font-bold text-[10px] rounded-md uppercase tracking-wider">
                            {isLoading ? "Loading..." : student?.classification}
                        </span>
                    </div>

                    {/* Column 2: Legal Descriptive Information Text Details */}
                    <div className="p-6 md:p-8 col-span-3 flex flex-col justify-between gap-6 relative">
                        
                        {/* POSITIONING BOUNDS: Aligned to upper right corner bounds */}
                        <div className="absolute top-6 right-6 md:top-8 md:right-8">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleInitializeFormStates}
                                        className="h-8 text-xs font-bold text-slate-600 hover:text-indigo-600 border-slate-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-200 transition-all flex items-center gap-1.5 px-3 rounded-lg shadow-3xs"
                                        aria-label="Edit student profile parameters"
                                    >
                                        <UserCog className="w-3.5 h-3.5 stroke-[2]" />
                                        <span>Modify Record</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg bg-white rounded-xl border p-6 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-base font-black tracking-tight text-slate-900">Edit Student Information</DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                            Update the biographical matrix logs for this registry track. All modifications compile downstream directly.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {/* TWO COLUMNS PER ROW GRID CONTAINER */}
                                    <div className="grid grid-cols-2 gap-4 py-4">
                                        <Field className="col-span-1 flex flex-col gap-1.5">
                                            <Label className="text-xs font-bold text-slate-700">First Name</Label>
                                            <Input disabled={isSaving} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 text-xs bg-white border-slate-200 font-medium text-slate-800" />
                                        </Field>

                                        <Field className="col-span-1 flex flex-col gap-1.5">
                                            <Label className="text-xs font-bold text-slate-700">Last Name</Label>
                                            <Input disabled={isSaving} value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 text-xs bg-white border-slate-200 font-medium text-slate-800" />
                                        </Field>

                                        <Field className="col-span-2 flex flex-col gap-1.5">
                                            <Label className="text-xs font-bold text-slate-700">Grade Level Selection</Label>
                                            <Select disabled={isSaving} value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                                                <SelectTrigger className="w-full h-10 text-xs text-slate-800 font-medium bg-white border-slate-200">
                                                    <SelectValue placeholder="Select institutional assignment level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade Tracks</SelectLabel>
                                                        {levels?.map((d, index) => (
                                                            <SelectItem key={index} value={d.grade_level} className="text-xs">{d.grade_level}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>

                                        <Field className="col-span-1 flex flex-col gap-1.5">
                                            <Label className="text-xs font-bold text-slate-700">Classroom Section</Label>
                                            <Input disabled={isSaving} value={classroomSection} onChange={(e) => setClassroomSection(e.target.value)} className="h-10 text-xs bg-white border-slate-200 font-medium text-slate-800" />
                                        </Field>

                                        <Field className="col-span-1 flex flex-col gap-1.5">
                                            <Label className="text-xs font-bold text-slate-700">Faculty Adviser</Label>
                                            <Input disabled={isSaving} value={facultyAdvisor} onChange={(e) => setFacultyAdvisor(e.target.value)} className="h-10 text-xs bg-white border-slate-200 font-medium text-slate-800" />
                                        </Field>
                                    </div>

                                    <DialogFooter className="border-t pt-4 flex gap-2 w-full">
                                        <Button disabled={isSaving} variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-xs h-10 font-bold border-slate-200 text-slate-700 flex-1">
                                            Cancel Changes
                                        </Button>
                                        <Button disabled={isSaving} onClick={handleSaveChanges} className="text-xs h-10 font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex-1 shadow-xs">
                                            {isSaving ? "Saving Entry Matrix..." : "Commit Modifications"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Student Profile</span>
                            {/* Full Name String Display */}
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 max-w-[80%]">
                                {isLoading ? "Syncing Identity..." : `${student?.last_name}, ${student?.first_name} ${student?.middle_name || ""}`}
                            </h2>
                        </div>

                        {/* Three-Column Academic Allocation Matrix metadata row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-5">
                            <div className="flex items-start gap-2.5">
                                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade Level</h4>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                                        {isLoading ? "---" : student?.grade_level}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classroom Section</h4>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                                        {isLoading ? "---" : student?.section_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <UserCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Adviser</h4>
                                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                                        {isLoading ? "---" : student?.advisor_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* LOWER CARD BLOCK: Financial Ledger Balance & Transactions Sheet Layout Split */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Left Section Grid: Consolidated Metrics Snapshot Account Card */}
                <Card className="shadow-sm border-slate-200 bg-white md:col-span-1 h-full flex flex-col">
                    <CardHeader className="border-b pb-4 bg-slate-50/20">
                        <CardTitle className="text-xs font-bold py-2 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                            <span>Financial Balance</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 flex flex-col gap-4 flex-1 justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b pb-2 text-xs">
                                <span className="text-slate-400 font-medium">Enrollment Date:</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" /> 
                                    {isLoading ? "---" : student?.date_enrolled}
                                </span>
                            </div>

                            {/* Tuition Fees Subsection */}
                            <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1.5 text-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Tuition Ledger</span>
                                <div className="flex justify-between text-slate-500">
                                    <span>Gross Contract:</span>
                                    <span className="font-semibold text-slate-700">₱{isLoading ? "0.00" : student?.total_assessment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Liquidated Paid:</span>
                                    <span className="font-semibold text-emerald-700">₱{isLoading ? "0.00" : student?.total_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* Books Fees Subsection */}
                            <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1.5 text-xs mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Books Ledger</span>
                                <div className="flex justify-between text-slate-500">
                                    <span>Gross Assessment:</span>
                                    <span className="font-semibold text-slate-700">₱{isLoading ? "0.00" : student?.total_books_fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Liquidated Paid:</span>
                                    <span className="font-semibold text-emerald-700">₱{isLoading ? "0.00" : student?.total_books_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Remaining Combined Balance Block */}
                        <div className={`p-4 rounded-xl border border-dashed mt-4 flex flex-col gap-1 ${
                            student?.balance_remaining === 0 
                                ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" 
                                : "bg-rose-50/50 border-rose-200 text-rose-900"
                        }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Running Dues Due</span>
                            <span className="text-2xl font-black tracking-tight">
                                ₱{isLoading ? "0.00" : student?.balance_remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] opacity-80 font-medium mt-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                    {student?.balance_remaining === 0 ? "Fully Paid" : "Outstanding Balance"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Section Grid: Detailed Accounting Ledger Receipts Data Table */}
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400 italic font-medium">
                                            Syncing financial rows...
                                        </td>
                                    </tr>
                                ) : student?.transactions && student.transactions.length > 0 ? (
                                    student.transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-slate-50/30">
                                            <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{txn.id}</td>
                                            <td className="py-3.5 px-5 font-semibold text-slate-700">{txn.context}</td>
                                            <td className="py-3.5 px-5 font-medium text-slate-500">{txn.method}</td>
                                            <td className="py-3.5 px-5 text-right font-bold text-slate-900">
                                                ₱{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3.5 px-5 text-muted-foreground">{txn.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground italic font-medium">
                                            No processing records found inside system history.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}