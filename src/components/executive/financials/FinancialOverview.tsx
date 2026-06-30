"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    DollarSign, 
    TrendingUp, 
    Clock, 
    Search,
    Calendar,
    Percent,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { getExecutiveFinancialOverview, ExecutiveFinancialDataset, AuditTransactionRecord } from "@/app/(portal)/executive/financials/actions";

interface FinancialOverviewWorkspaceProps {
    initialSchoolYearId: string;
}

export default function FinancialOverview({ initialSchoolYearId }: FinancialOverviewWorkspaceProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeSchoolYearId] = useState<string>(initialSchoolYearId);

    const { data, isLoading, error } = useQuery<ExecutiveFinancialDataset>({
        queryKey: ["executiveFinancialsOverviewLedger", activeSchoolYearId],
        queryFn: () => getExecutiveFinancialOverview(activeSchoolYearId),
        enabled: !!activeSchoolYearId
    });

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                <p className="text-xs text-slate-400 font-medium tracking-tight">Recalculating institutional ledger indexes...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="w-[95%] max-w-7xl mx-auto my-10 text-center p-12 border border-dashed border-rose-200 rounded-xl bg-rose-50/30 text-rose-700 font-semibold text-xs">
                Failed to parse financial database schema. Verify student entity mapping bounds.
            </div>
        );
    }

    const { metrics, gradeBreakdown, channels, recentTransactions } = data;

    // Type-safe lookup string matches
    const filteredTransactions = recentTransactions.filter((txn: AuditTransactionRecord) => 
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-[95%] max-w-[1600px] mx-auto my-6 flex flex-col gap-6 antialiased bg-white pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">
                        Financial Overview Ledger
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Consolidated analytics compiled from active student account cards.
                    </p>
                </div>
                
                <div className="shrink-0">
                    <Button variant="outline" className="text-xs font-bold flex items-center gap-2 h-9 border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 select-none">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Active Term Execution Matrix</span>
                    </Button>
                </div>
            </div>

            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <Card className="shadow-2xs border-slate-100 bg-white rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Gross Assessed Fees</CardDescription>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-800"><DollarSign className="w-3.5 h-3.5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-slate-900 tracking-tight">
                            ₱{metrics.grossAssessed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-2xs border-slate-100 bg-white rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-emerald-600">Total Payments Collected</CardDescription>
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg"><TrendingUp className="w-3.5 h-3.5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-emerald-700 tracking-tight">
                            ₱{metrics.totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-2xs border-slate-100 bg-white rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-amber-600">Outstanding Dues</CardDescription>
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg"><Clock className="w-3.5 h-3.5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-amber-800 tracking-tight">
                            ₱{metrics.outstandingReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-2xs border-slate-100 bg-white rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
                        <CardDescription className="font-bold uppercase tracking-wider text-[10px] text-indigo-600">Collection Efficiency</CardDescription>
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg"><Percent className="w-3.5 h-3.5" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black text-indigo-900 tracking-tight">{metrics.efficiencyRate.toFixed(1)}%</div>
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-2 overflow-hidden">
                            <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${metrics.efficiencyRate}%` }} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Split Breakdown Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                
                {/* Collection by Grade Tier */}
                <Card className="lg:col-span-1 shadow-2xs bg-white border-slate-100 rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-800">Operational Breakdown By Grade</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4.5 pt-0">
                        {gradeBreakdown.map((row, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700">{row.grade}</span>
                                    <span className="text-slate-400 font-medium font-mono text-[11px]">
                                        ₱{row.collected.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-slate-200">/</span> <span className="text-slate-500">₱{row.assessed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden relative">
                                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${row.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Remittance Channels Inflow */}
                <Card className="lg:col-span-2 shadow-2xs bg-white border-slate-100 rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-slate-800">Operational Remittance Inflow</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl flex flex-col gap-0.5 bg-slate-50/30">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Over-the-Counter Cash</span>
                            <span className="text-lg font-black text-slate-800 mt-1">₱{channels.cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[10px] text-slate-400 font-semibold font-mono mt-1">{channels.cashCount} logs posted</span>
                        </div>
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl flex flex-col gap-0.5 bg-slate-50/30">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">G-Cash Gateway</span>
                            <span className="text-lg font-black text-slate-800 mt-1">₱{channels.gcashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[10px] text-emerald-600/70 font-semibold font-mono mt-1">{channels.gcashCount} logs posted</span>
                        </div>
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl flex flex-col gap-0.5 bg-slate-50/30">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Direct Bank Wires</span>
                            <span className="text-lg font-black text-slate-800 mt-1">₱{channels.bankAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-[10px] text-indigo-600/70 font-semibold font-mono mt-1">{channels.bankCount} logs posted</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Receipts Log Table */}
            <Card className="shadow-2xs border-slate-100 bg-white rounded-xl overflow-hidden w-full">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/30">
                    <div>
                        <CardTitle className="text-sm font-bold text-slate-800">Recent Remittance Register Entries</CardTitle>
                    </div>
                    <div className="relative flex-1 sm:w-64 max-w-sm shrink-0">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input 
                            placeholder="Search OR sequence or ledger identities..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-xl font-medium focus-visible:ring-1 focus-visible:ring-slate-200 placeholder:text-slate-400 text-slate-800" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse table-auto">
                        <thead>
                            <tr className="bg-slate-50/10 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3 px-6">OR Sequence ID</th>
                                <th className="py-3 px-6">Parent / Depositor</th>
                                <th className="py-3 px-6">Student Beneficiary</th>
                                <th className="py-3 px-6">Allocation Context</th>
                                <th className="py-3 px-6">Channel</th>
                                <th className="py-3 px-6 text-right">Amount Settled</th>
                                <th className="py-3 px-6 text-right">Date Posted</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium text-slate-600 divide-y divide-slate-100 bg-white">
                            {filteredTransactions.map((item: AuditTransactionRecord) => (
                                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm tracking-tight">{item.id}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800 text-sm">{item.parentName}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-600">{item.studentName}</td>
                                    <td className="py-4 px-6">
                                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                                            {item.context}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-500 font-semibold">{item.method}</td>
                                    <td className="py-4 px-6 font-bold text-right text-slate-900 text-sm">
                                        ₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 px-6 text-slate-400 font-mono text-right">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}