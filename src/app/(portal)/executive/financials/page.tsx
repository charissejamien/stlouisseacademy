"use client";

import React, { useState } from "react";
import { 
    DollarSign, 
    TrendingUp, 
    Clock, 
    CreditCard, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download, 
    Filter, 
    Search,
    Calendar,
    Percent,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock Data strictly for pure UI layout representation
const mockTransactions = [
    { id: "TXN-8841", parent: "Michael Santos", student: "Naiah Santos", type: "Tuition (Downpayment)", amount: 15500, method: "Cash", date: "June 18, 2026", status: "Success" },
    { id: "TXN-8840", parent: "Sarah Joaquin", student: "Liam Joaquin", type: "Books & Uniforms", amount: 6200, method: "G-Cash", date: "June 17, 2026", status: "Success" },
    { id: "TXN-8839", parent: "Robert Chen", student: "Chloe Chen", type: "Tuition (Installment)", amount: 4500, method: "Bank Transfer", date: "June 16, 2026", status: "Success" },
    { id: "TXN-8838", parent: "Maria Gonzales", student: "Juan Gonzales", type: "Entrance Fee", amount: 3500, method: "Cash", date: "June 16, 2026", status: "Success" },
    { id: "TXN-8837", parent: "David Tecson", student: "Alex Tecson", type: "Tuition (Full Payment)", amount: 48000, method: "Bank Transfer", date: "June 15, 2026", status: "Success" },
];

const mockBreakdown = [
    { grade: "Grade 1", assessed: 450000, collected: 310000, uncollected: 140000, progress: 68 },
    { grade: "Grade 2", assessed: 380000, collected: 290000, uncollected: 90000, progress: 76 },
    { grade: "Grade 3", assessed: 520000, collected: 410000, uncollected: 110000, progress: 78 },
    { grade: "Grade 4", assessed: 410000, collected: 220000, uncollected: 190000, progress: 53 },
];

export default function ExecutiveFinancialsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Executive Monitoring Desk
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Financial Overview Ledger
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time gross assessments, actual liquidity collections, and outstanding systemic receivables for SY 2026-2027.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-2 h-10 border-slate-200">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>SY 2026 - 2027</span>
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 h-10 shadow-xs">
                        <Download className="w-4 h-4" />
                        <span>Export Financial Report</span>
                    </Button>
                </div>
            </div>

            {/* High-Level Overview Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Metric 1: Total Gross Collectibles */}
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                            Gross Receivables Assessed
                        </CardDescription>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">₱1,760,000.00</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" /> +14.2%
                            </span> 
                            vs previous school year
                        </p>
                    </CardContent>
                </Card>

                {/* Metric 2: Total Realized Collections */}
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                            Realized Revenue (Collected)
                        </CardDescription>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-700 tracking-tight">₱1,230,000.00</div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                69.8% Liquidity
                            </span> 
                            settled across active accounts
                        </p>
                    </CardContent>
                </Card>

                {/* Metric 3: Total Outstanding Uncollected */}
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                            Outstanding Receivables
                        </CardDescription>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <Clock className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-amber-700 tracking-tight">₱530,000.00</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            Pending distribution across upcoming installments
                        </p>
                    </CardContent>
                </Card>

                {/* Metric 4: Collection Collection Efficiency */}
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                            Collection Efficiency Rate
                        </CardDescription>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Percent className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-purple-900 tracking-tight">84.6%</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "84.6%" }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Split Breakdown Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Academic Level Allocation Progress Bar Lists */}
                <Card className="lg:col-span-1 shadow-sm bg-white border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800">Collection by Grade Tier</CardTitle>
                        <CardDescription className="text-xs">Liquidity parsing benchmarks per cluster.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5 pt-2">
                        {mockBreakdown.map((row, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700">{row.grade}</span>
                                    <span className="text-muted-foreground font-semibold">
                                        ₱{row.collected.toLocaleString()} <span className="text-slate-300">/</span> <span className="text-slate-500">₱{row.assessed.toLocaleString()}</span>
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-md overflow-hidden relative">
                                    <div 
                                        className={`h-full rounded-md transition-all ${
                                            row.progress > 75 ? "bg-emerald-600" : row.progress > 60 ? "bg-indigo-600" : "bg-amber-500"
                                        }`} 
                                        style={{ width: `${row.progress}%` }} 
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-muted-foreground italic">
                                    <span>{row.progress}% Efficient</span>
                                    <span className="text-amber-700 font-medium">₱{row.uncollected.toLocaleString()} left</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Channel Split and Compliance Callout Box Component */}
                <Card className="lg:col-span-2 shadow-sm bg-white border-slate-200 flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800">Operational Remittance Inflow</CardTitle>
                        <CardDescription className="text-xs">Current settlement distributions recorded via verification logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Over-the-Counter Cash</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱542,000.00</span>
                            <span className="text-[11px] text-muted-foreground mt-1">35 Transactions logged</span>
                        </div>
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">G-Cash Gateway</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱385,000.00</span>
                            <span className="text-[11px] text-muted-foreground mt-1">84 Transactions logged</span>
                        </div>
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Bank Wire</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱303,000.00</span>
                            <span className="text-[11px] text-muted-foreground mt-1">14 Transactions logged</span>
                        </div>
                    </CardContent>
                    
                    <div className="mx-6 mb-6 p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900">
                            <h5 className="font-bold tracking-tight">Audit Reconciliation Protocol Check</h5>
                            <p className="text-amber-700 mt-0.5 leading-relaxed">
                                There are currently entries processed via staging configurations missing explicit parent assignments. Run structural reconciliation matching to balance the automated composite audit ledger summaries correctly.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Master Audit Logs Table Section Container */}
            <Card className="shadow-sm border-slate-200 bg-white">
                <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">Recent Remittance Log Entries</CardTitle>
                        <CardDescription className="text-xs">Historical validation log records representing the latest physical and digital cash collections.</CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input 
                                placeholder="Search OR or Parent..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-9 text-xs w-full bg-slate-50/40"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 text-xs flex items-center gap-1.5 border-slate-200">
                            <Filter className="w-3.5 h-3.5 text-slate-500" />
                            <span>Filter</span>
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3 px-5">OR Sequence ID</th>
                                <th className="py-3 px-5">Depositor / Parent</th>
                                <th className="py-3 px-5">Beneficiary Student</th>
                                <th className="py-3 px-5">Allocation Context</th>
                                <th className="py-3 px-5">Channel</th>
                                <th className="py-3 px-5 text-right">Amount Settled</th>
                                <th className="py-3 px-5">Date Posted</th>
                                <th className="py-3 px-5 text-center">Audit Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {mockTransactions.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{item.id}</td>
                                    <td className="py-3.5 px-5 font-semibold text-slate-800">{item.parent}</td>
                                    <td className="py-3.5 px-5 font-medium text-slate-600">{item.student}</td>
                                    <td className="py-3.5 px-5">
                                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-medium">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-5 font-medium flex items-center gap-1.5 mt-1.5 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        {item.method}
                                    </td>
                                    <td className="py-3.5 px-5 font-bold text-right text-slate-900">
                                        ₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3.5 px-5 text-muted-foreground">{item.date}</td>
                                    <td className="py-3.5 px-5 text-center">
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t flex justify-between items-center text-xs text-muted-foreground font-medium select-none bg-slate-50/20">
                    <span>Showing 5 of 137 audited receipts</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="h-8 text-xs font-semibold border-slate-200">Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-slate-200">Next Page</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}