"use client";

import React, { useState } from "react";
import { 
    Search, 
    Plus, 
    HandCoins, 
    CalendarDays, 
    FileSpreadsheet, 
    SlidersHorizontal, 
    ArrowUpRight, 
    User, 
    CheckCircle2, 
    Clock, 
    ShieldAlert,
    ChevronRight,
    Edit3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Faculty Database Layer featuring Fixed Base Monthly Salaries
const mockFacultyPayroll = [
    { id: "EMP-0201", name: "Maria Theresa Santos", role: "Grade 4 Advisor", fixedMonthlySalary: 26000, activeCashAdvance: 1500, otherDeductions: 1200, status: "Pending Review" },
    { id: "EMP-0202", name: "Juan Dela Cruz", role: "Program Coordinator", fixedMonthlySalary: 34000, activeCashAdvance: 0, otherDeductions: 1800, status: "Pending Review" },
    { id: "EMP-0203", name: "Charity Macasero", role: "Grade 1 Advisor", basePay: 24000, fixedMonthlySalary: 26000, activeCashAdvance: 3000, otherDeductions: 1200, status: "Draft" },
    { id: "EMP-0204", name: "Robert Joaquin", role: "Subject Teacher", fixedMonthlySalary: 21000, activeCashAdvance: 0, otherDeductions: 950, status: "Draft" },
];

const targetMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const biMonthPeriods = ["1st Half (1st - 15th Cutoff)", "2nd Half (16th - 30th Cutoff)"];

export default function FacultyPayrollDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    
    // Dialog Display Toggles
    const [activeModal, setActiveModal] = useState<"none" | "payroll" | "advance">("none");

    // 1. "Create New Payroll" Form States
    const [payrollMonth, setPayrollMonth] = useState("June");
    const [payrollPeriod, setPayrollPeriod] = useState("1st Half (1st - 15th Cutoff)");

    // 2. "Cash Advance" Form States
    const [selectedEmployeeForCA, setSelectedEmployeeForCA] = useState("");
    const [caAmount, setCaAmount] = useState("");
    const [caReason, setCaReason] = useState("");

    // Live filtering pipeline
    const filteredRoster = mockFacultyPayroll.filter((emp) => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.includes(searchTerm)
    );

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased relative">
            
            {/* Top Workspace Header Dashboard Tier */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Institutional Disbursement Station
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Payroll & Compensation Hub
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Configure dynamic bi-monthly salary runs, register employee cash advances, and audit fixed contract payouts.
                    </p>
                </div>

                {/* Direct Action Access Panel */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <Button 
                        onClick={() => setActiveModal("advance")}
                        variant="outline"
                        className="text-xs font-bold flex items-center gap-2 h-11 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex-1 sm:flex-initial"
                    >
                        <HandCoins className="w-4 h-4 text-amber-500" />
                        <span>Log Cash Advance (CA)</span>
                    </Button>
                    
                    <Button 
                        onClick={() => setActiveModal("payroll")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 h-11 shadow-sm flex-1 sm:flex-initial"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Payroll Run</span>
                    </Button>
                </div>
            </div>

            {/* Quick Summary Aggregates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Run Windows</p>
                            <h3 className="text-lg font-black text-slate-900 mt-0.5">June — 1st Half Payout</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <HandCoins className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outstanding Advances</p>
                            <h3 className="text-xl font-black text-amber-700 mt-0.5">₱4,500.00 Allotted</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fixed Monthly Base Load</p>
                            <h3 className="text-xl font-black text-emerald-700 mt-0.5">₱107,000.00 / mo</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Configuration Controls Toolbar */}
            <Card className="shadow-xs border-slate-200 bg-slate-50/50 p-4 rounded-xl border">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 -mt-0.5" />
                    <Input 
                        placeholder="Search Faculty Profile Name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-xs w-full"
                    />
                </div>
            </Card>

            {/* Bi-Monthly Master Roster Allocation Spreadsheet Grid */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="p-5 border-b flex justify-between items-center bg-slate-50/40">
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Cutoff Ledger Grid</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Values represent the bi-monthly disbursement slice (<span className="font-bold text-indigo-600">50% of Fixed Monthly Base</span>) adjusted against active cut-off obligations.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3.5 px-6">Employee ID</th>
                                <th className="py-3.5 px-6">Faculty Member</th>
                                <th className="py-3.5 px-6 text-right">Fixed Monthly Contract</th>
                                <th className="py-3.5 px-6 text-right bg-indigo-50/20 text-indigo-900 font-bold">Base Payout Slice (50%)</th>
                                <th className="py-3.5 px-6 text-right text-amber-700">CA Deduction</th>
                                <th className="py-3.5 px-6 text-right text-rose-600">Other Adjustments</th>
                                <th className="py-3.5 px-6 text-right font-black text-slate-900">Net Take-Home Pay</th>
                                <th className="py-3.5 px-6 text-center">Batch Run Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {filteredRoster.map((emp) => {
                                const biMonthlyBaseSlice = emp.fixedMonthlySalary / 2;
                                const totalTakeHomeNet = biMonthlyBaseSlice - (emp.activeCashAdvance + emp.otherDeductions);

                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                        <td className="py-4 px-6 font-mono font-bold text-slate-500">{emp.id}</td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{emp.name}</h4>
                                                <span className="text-[10px] text-muted-foreground mt-0.5 block">{emp.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right font-semibold text-slate-500">
                                            ₱{emp.fixedMonthlySalary.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold bg-indigo-50/10 text-indigo-700 text-sm">
                                            ₱{biMonthlyBaseSlice.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right font-medium text-amber-700">
                                            {emp.activeCashAdvance > 0 ? `-₱${emp.activeCashAdvance.toLocaleString()}` : "—"}
                                        </td>
                                        <td className="py-4 px-6 text-right font-medium text-rose-600">
                                            {emp.otherDeductions > 0 ? `-₱${emp.otherDeductions.toLocaleString()}` : "—"}
                                        </td>
                                        <td className="py-4 px-6 text-right font-black text-slate-900 text-sm bg-slate-50/30">
                                            ₱{totalTakeHomeNet.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                emp.status === "Pending Review" 
                                                    ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                            }`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* MODAL WINDOW 1: Create New Bi-Monthly Payroll Run */}
            {activeModal === "payroll" && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
                    <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between border-l">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Initialize Payroll Window</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Sets up a standard 50% bi-monthly slice distribution run for active accounts.</p>
                                </div>
                                <button onClick={() => setActiveModal("none")} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Target Calculation Month</label>
                                    <Select value={payrollMonth} onValueChange={payrollMonth}>
                                        <SelectTrigger className="h-10 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetMonths.map((m) => (
                                                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Cut-off Cycle</label>
                                    <Select value={payrollPeriod} onValueChange={setPayrollPeriod}>
                                        <SelectTrigger className="h-10 text-xs font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {biMonthPeriods.map((p) => (
                                                <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="p-3.5 bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-xl flex gap-2.5 items-start">
                                <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <span className="text-[11px] leading-relaxed">
                                    Initializing this run imports all baseline monthly contract salaries, cuts them in half automatically, and pulls in any active Cash Advances logged before the cutoff execution lock.
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t pt-4">
                            <Button variant="outline" onClick={() => setActiveModal("none")} className="flex-1 h-11 text-xs font-bold border-slate-200">Cancel</Button>
                            <Button onClick={() => setActiveModal("none")} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">Generate Payout Batch</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL WINDOW 2: Register New Employee Cash Advance (CA) */}
            {activeModal === "advance" && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
                    <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between border-l">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Log Cash Advance Ledger</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Authorizes an upfront balance withdrawal to be subtracted on the next active run.</p>
                                </div>
                                <button onClick={() => setActiveModal("none")} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Recipient Faculty Member</label>
                                    <Select value={selectedEmployeeForCA} onValueChange={setSelectedEmployeeForCA}>
                                        <SelectTrigger className="h-10 text-xs font-medium">
                                            <SelectValue placeholder="Select faculty profile" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockFacultyPayroll.map((f) => (
                                                <SelectItem key={f.id} value={f.name} className="text-xs">{f.name} ({f.id})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Advance Principal Value (₱)</label>
                                    <Input 
                                        type="number" 
                                        value={caAmount} 
                                        onChange={(e) => setCaAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="h-10 text-xs font-semibold"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Purpose Notes Reference</label>
                                    <Input 
                                        value={caReason} 
                                        onChange={(e) => setCaReason(e.target.value)}
                                        placeholder="e.g., Emergency medical allowance fallback"
                                        className="h-10 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t pt-4">
                            <Button variant="outline" onClick={() => setActiveModal("none")} className="flex-1 h-11 text-xs font-bold border-slate-200">Discard</Button>
                            <Button onClick={() => setActiveModal("none")} className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs">Approve & Disburse Advance</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}