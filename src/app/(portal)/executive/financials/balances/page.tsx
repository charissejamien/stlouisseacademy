"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, GraduationCap, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummaryMetrics } from "./actions";

export default function FinancialBalancesDashboardPage() {
    const router = useRouter();
    const ACTIVE_SCHOOL_YEAR_UUID = "8ca2cef9-7a33-41e4-aea5-5af8cc40625f"; 

    const { data: metrics, isLoading, error } = useQuery({
        queryKey: ["dashboardFinancialOverview", ACTIVE_SCHOOL_YEAR_UUID],
        queryFn: () => getDashboardSummaryMetrics(ACTIVE_SCHOOL_YEAR_UUID),
        enabled: !!ACTIVE_SCHOOL_YEAR_UUID
    });

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-2 bg-white">
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span className="text-xs text-slate-400 font-medium tracking-tight">Compiling financial summaries...</span>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="p-6 text-xs font-semibold text-rose-600 bg-rose-50/50 rounded-xl border border-rose-100">
                Failed to process current financial summary matrix.
            </div>
        );
    }

    return (
        <div className="p-6 w-full h-screen overflow-y-auto bg-white flex flex-col gap-8 antialiased">
            <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Balances & Collection Hub</h1>
                <p className="text-xs text-slate-400 mt-0.5">High-density multi-ledger financial operations monitor.</p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 select-none">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Combined Gross Revenue Model</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight block mt-1">
                        ₱{metrics.combinedAssessed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="flex gap-10 text-xs font-semibold self-end md:self-center">
                    <div>
                        <span className="text-slate-400 font-medium block">Total Collected</span>
                        <span className="text-base font-black text-emerald-600 font-mono mt-0.5 block">
                            ₱{metrics.combinedCollected.toLocaleString()}
                        </span>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-200" />
                    <div>
                        <span className="text-slate-400 font-medium block">Total Outstanding Balance</span>
                        <span className="text-base font-black text-rose-600 font-mono mt-0.5 block">
                            ₱{metrics.combinedOutstanding.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <Card 
                    onClick={() => router.push("/executive/financials/balances/books")}
                    className="border border-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-3xs group rounded-2xl overflow-hidden bg-white"
                >
                    <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-800 group-hover:bg-slate-950 group-hover:text-white transition-all">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-900">Book Fees Ledger</CardTitle>
                                <CardDescription className="text-[11px] text-slate-400">Primary distribution logs</CardDescription>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-950 transition-colors" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 divide-x divide-slate-100 border-t pt-4 text-center bg-slate-50/20">
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assessed</span>
                            <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">₱{metrics.booksAssessed.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Collected</span>
                            <span className="text-xs font-bold text-emerald-600 font-mono block mt-0.5">₱{metrics.booksCollected.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block">Outstanding</span>
                            <span className="text-xs font-bold text-slate-900 font-mono block mt-0.5">₱{metrics.booksOutstanding.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card 
                    onClick={() => router.push("/executive/financials/balances/tuition")}
                    className="border border-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-3xs group rounded-2xl overflow-hidden bg-white"
                >
                    <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-800 group-hover:bg-slate-950 group-hover:text-white transition-all">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-slate-900">Tuition Fees Ledger</CardTitle>
                                <CardDescription className="text-[11px] text-slate-400">Baseline balance metrics</CardDescription>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-950 transition-colors" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 divide-x divide-slate-100 border-t pt-4 text-center bg-slate-50/20">
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assessed</span>
                            <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">₱{metrics.tuitionAssessed.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Collected</span>
                            <span className="text-xs font-bold text-emerald-600 font-mono block mt-0.5">₱{metrics.tuitionCollected.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block">Outstanding</span>
                            <span className="text-xs font-bold text-slate-900 font-mono block mt-0.5">₱{metrics.tuitionOutstanding.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}