"use client";

import React, { useState } from "react";
import { 
    Search, 
    Filter, 
    GraduationCap, 
    FileWarning, 
    CheckCircle2, 
    AlertTriangle, 
    DollarSign, 
    Receipt, 
    ArrowRight,
    UserX,
    CreditCard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Student Database for the Registrar, emphasizing active collections and outstanding structural balances
const mockRegistrarStudents = [
    { id: "20260001", name: "Charity Janine Macasero", grade: "Grade 1", parent: "Naiah Macasero", totalAssessment: 45000, amountPaid: 45000, balance: 0, financialStatus: "Fully Cleared", overdueMilestone: "None" },
    { id: "20260002", name: "Naiah Santos", grade: "Grade 1", parent: "Michael Santos", totalAssessment: 45000, amountPaid: 15500, balance: 29500, financialStatus: "Has Arrears", overdueMilestone: "July Installment" },
    { id: "20260003", name: "Liam Joaquin", grade: "Grade 2", parent: "Sarah Joaquin", totalAssessment: 44200, amountPaid: 6200, balance: 38000, financialStatus: "Overdue Alert", overdueMilestone: "Downpayment Overdue" },
    { id: "20260004", name: "Chloe Chen", grade: "Grade 3", parent: "Robert Chen", totalAssessment: 52000, amountPaid: 4500, balance: 47500, financialStatus: "Has Arrears", overdueMilestone: "July Installment" },
    { id: "20260005", name: "Juan Gonzales", grade: "Grade 4", parent: "Maria Gonzales", totalAssessment: 41000, amountPaid: 41000, balance: 0, financialStatus: "Fully Cleared", overdueMilestone: "None" },
    { id: "20260006", name: "Alex Tecson", grade: "Grade 1", parent: "David Tecson", totalAssessment: 45000, amountPaid: 12000, balance: 33000, financialStatus: "Has Arrears", overdueMilestone: "July Installment" },
];

const gradeLevels = ["All Grades", "Grade 1", "Grade 2", "Grade 3", "Grade 4"];
const collectionStatuses = ["All Statuses", "Fully Cleared", "Has Arrears", "Overdue Alert"];

export default function RegistrarStudentsCollectionPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("All Grades");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");

    // Dynamic Filter Pipeline
    const filteredStudents = mockRegistrarStudents.filter((student) => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            student.id.includes(searchTerm) || 
            student.parent.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesGrade = selectedGrade === "All Grades" || student.grade === selectedGrade;
        const matchesStatus = selectedStatus === "All Statuses" || student.financialStatus === selectedStatus;

        return matchesSearch && matchesGrade && matchesStatus;
    });

    // On-the-fly Registrar counter tallies
    const totalArrearsCount = mockRegistrarStudents.filter(s => s.financialStatus === "Has Arrears").length;
    const criticalOverdueCount = mockRegistrarStudents.filter(s => s.financialStatus === "Overdue Alert").length;
    const totalCollectiblesOutstanding = mockRegistrarStudents.reduce((sum, s) => sum + s.balance, 0);

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Action Oriented Registrar Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                        Collections & Accounts Desk
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Student Accounts Ledger Directory
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monitor active parent billing accounts, audit outstanding tuition arrears, and trigger rapid fee settlement protocols.
                    </p>
                </div>
            </div>

            {/* Registrar Operational Summary Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <FileWarning className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students with Active Arrears</p>
                            <h3 className="text-2xl font-black text-amber-700 mt-0.5">{totalArrearsCount} Standard Balances</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Overdue Blocks</p>
                            <h3 className="text-2xl font-black text-rose-700 mt-0.5">{criticalOverdueCount} Overdue Alerts</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Collectibles Outstanding</p>
                            <h3 className="text-2xl font-black text-indigo-900 mt-0.5">₱{totalCollectiblesOutstanding.toLocaleString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Quick Filters Toolbar */}
            <Card className="shadow-xs border-slate-200 bg-slate-50/50 p-4 rounded-xl border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Search Field Control */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-0.5" />
                        <Input 
                            placeholder="Search Student Name, ID, or Parent..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-xs"
                        />
                    </div>

                    {/* Grade Level Select Dropdown */}
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs text-slate-700 shadow-xs">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                <SelectValue placeholder="Filter by Grade" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {gradeLevels.map((g) => (
                                <SelectItem key={g} value={g} className="text-xs">{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clearance Collection Status Dropdown */}
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs text-slate-700 shadow-xs">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                <SelectValue placeholder="Filter Collection State" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {collectionStatuses.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
            </Card>

            {/* Ledger Collection Information Roster Table */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3.5 px-6">System ID</th>
                                <th className="py-3.5 px-6">Student Full Name</th>
                                <th className="py-3.5 px-6">Grade Allocation</th>
                                <th className="py-3.5 px-6">Sponsor / Parent</th>
                                <th className="py-3.5 px-6 text-right">Total Assessment Due</th>
                                <th className="py-3.5 px-6 text-right text-emerald-700">Total Paid to Date</th>
                                <th className="py-3.5 px-6 text-right font-black text-rose-700">Remaining Balance</th>
                                <th className="py-3.5 px-6 text-center">Overdue Target</th>
                                <th className="py-3.5 px-6 text-center">Collection State</th>
                                <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                        <td className="py-4 px-6 font-mono font-bold text-slate-500">{student.id}</td>
                                        <td className="py-4 px-6 font-bold text-slate-900 text-sm">{student.name}</td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-600">{student.parent}</td>
                                        <td className="py-4 px-6 text-right font-medium text-slate-500">
                                            ₱{student.totalAssessment.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-emerald-700">
                                            ₱{student.amountPaid.toLocaleString()}
                                        </td>
                                        <td className={`py-4 px-6 text-right font-black text-sm bg-slate-50/30 ${
                                            student.balance > 0 ? "text-rose-600" : "text-slate-400"
                                        }`}>
                                            ₱{student.balance.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {student.overdueMilestone !== "None" ? (
                                                <span className="bg-rose-50 text-rose-700 border border-rose-100 font-bold px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                                                    ⚠️ {student.overdueMilestone}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/40 font-mono">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                student.financialStatus === "Fully Cleared" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                student.financialStatus === "Has Arrears" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                                            }`}>
                                                {student.financialStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 text-[11px] font-bold border-indigo-200 hover:bg-indigo-50 text-indigo-600 flex items-center gap-1 mx-auto shadow-2xs"
                                            >
                                                <Receipt className="w-3.5 h-3.5" /> 
                                                <span>Process Payment</span>
                                                <ArrowRight className="w-3 h-3 ml-0.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground italic font-medium">
                                        No student balance accounts match your search parameters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer Navigation Controls */}
                <div className="p-4 border-t flex justify-between items-center text-xs text-muted-foreground font-medium select-none bg-slate-50/20">
                    <span>Showing {filteredStudents.length} of {mockRegistrarStudents.length} total ledger lines</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="h-8 text-xs font-semibold border-slate-200">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-slate-200">Next Page</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}