"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    DollarSign, 
    TrendingUp, 
    Clock, 
    ArrowUpRight, 
    Download, 
    Filter, 
    Search,
    Calendar,
    Percent,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getExecutiveFinancialOverview, ExecutiveFinancialDataset } from "./actions";

export default function ExecutiveFinancialsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const activeSchoolYearId = "2026-2027"; // Plug into your active session/context lookup state

    const { data, isLoading, error } = useQuery<ExecutiveFinancialDataset>({
        queryKey: ["executiveFinancials", activeSchoolYearId],
        queryFn: () => getExecutiveFinancialOverview(activeSchoolYearId),
        enabled: !!activeSchoolYearId
    });

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs text-muted-foreground italic font-medium">Re-calculating student card ledger indexes...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="w-[90%] max-w-5xl mx-auto my-10 text-center p-12 border border-dashed rounded-xl bg-rose-50/50 text-rose-700 font-medium">
                <p>Failed to parse relational database configurations. Check table student_id mapping bounds.</p>
            </div>
        );
    }

    const { metrics, gradeBreakdown, channels, recentTransactions } = data;

    const filteredTransactions = recentTransactions.filter((txn) => 
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Dynamic summary pulling direct from student account cards and track enrollment lines.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-2 h-10 border-slate-200">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>SY 2026 - 2027</span>
                    </Button>
                </div>
            </div>

            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">Gross Assessed Fees</CardDescription>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><DollarSign className="w-4 h-4" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">₱{metrics.grossAssessed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">Total Revenue Collected</CardDescription>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-4 h-4" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-700 tracking-tight">₱{metrics.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">Outstanding Dues</CardDescription>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock className="w-4 h-4" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-amber-700 tracking-tight">₱{metrics.outstandingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[11px] text-slate-400">Collection Efficiency</CardDescription>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Percent className="w-4 h-4" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-purple-900 tracking-tight">{metrics.efficiencyRate.toFixed(1)}%</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${metrics.efficiencyRate}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Split Breakdown Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Collection by Grade Tier */}
                <Card className="lg:col-span-1 shadow-sm bg-white border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800">Collection by Grade Tier</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5 pt-2">
                        {gradeBreakdown.map((row, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700">{row.grade}</span>
                                    <span className="text-muted-foreground font-semibold">
                                        ₱{row.collected.toLocaleString()} <span className="text-slate-300">/</span> <span className="text-slate-500">₱{row.assessed.toLocaleString()}</span>
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-md overflow-hidden relative">
                                    <div className="h-full rounded-md bg-indigo-600" style={{ width: `${row.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Remittance Channels Inflow */}
                <Card className="lg:col-span-2 shadow-sm bg-white border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-bold text-slate-800">Operational Remittance Inflow</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Over-the-Counter Cash</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱{channels.cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[11px] text-muted-foreground mt-1">{channels.cashCount} Logs</span>
                        </div>
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">G-Cash Gateway</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱{channels.gcashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[11px] text-muted-foreground mt-1">{channels.gcashCount} Logs</span>
                        </div>
                        <div className="p-4 border border-dashed rounded-xl flex flex-col gap-1 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Bank Wires</span>
                            <span className="text-xl font-black text-slate-800 mt-1">₱{channels.bankAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[11px] text-muted-foreground mt-1">{channels.bankCount} Logs</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recents Receipts Log Table */}
            <Card className="shadow-sm border-slate-200 bg-white">
                <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800">Recent Remittance Log Entries</CardTitle>
                    </div>
                    <div className="relative flex-1 sm:w-64 max-w-sm">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input placeholder="Search OR or Names..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-9 text-xs bg-slate-50/40" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="py-3 px-5">OR Sequence ID</th>
                                <th className="py-3 px-5">Parent / Depositor</th>
                                <th className="py-3 px-5">Student Beneficiary</th>
                                <th className="py-3 px-5">Allocation Context</th>
                                <th className="py-3 px-5">Channel</th>
                                <th className="py-3 px-5 text-right">Amount Settled</th>
                                <th className="py-3 px-5">Date Posted</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {filteredTransactions.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{item.id}</td>
                                    <td className="py-3.5 px-5 font-semibold text-slate-800">{item.parentName}</td>
                                    <td className="py-3.5 px-5 font-medium text-slate-600">{item.studentName}</td>
                                    <td className="py-3.5 px-5"><span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-medium">{item.context}</span></td>
                                    <td className="py-3.5 px-5 text-slate-600 font-medium">{item.method}</td>
                                    <td className="py-3.5 px-5 font-bold text-right text-slate-900">₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="py-3.5 px-5 text-muted-foreground">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}