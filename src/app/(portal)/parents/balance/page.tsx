"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Loader2, CalendarX, ArrowLeftRight } from "lucide-react";
import PaymentHistory from "@/components/paymentHistory"; // Adjusted to standard file paths PascalCase conventions

// Import backend dynamic collection endpoints safely
import { getStudentBalanceSummary, getStudentPaymentHistory } from "@/app/(portal)/parents/balance/actions";

export default function StudentBalancePage() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get("studentId") || "";

    // 🔄 Dynamic React-Query pipeline retrieving single student accounting figures
    const { data: summary, isLoading: isLoadingSummary, isError: isSummaryError } = useQuery({
        queryKey: ["studentBalanceSummary", studentId],
        queryFn: () => getStudentBalanceSummary(studentId),
        enabled: !!studentId, // Only execute if token key safely presents inside URL window
    });

    // 🔄 Parallel query hook managing payment history logs natively
    const { data: logs = [], isLoading: isLoadingHistory } = useQuery({
        queryKey: ["studentPaymentHistory", studentId],
        queryFn: () => getStudentPaymentHistory(studentId),
        enabled: !!studentId,
    });

    // 1. Handling State: Loading Data
    if (studentId && isLoadingSummary) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-sla-blue" />
                <p className="text-sm font-medium animate-pulse">Assembling dynamic accounting ledger profiles...</p>
            </div>
        );
    }

    // 2. Handling State: Missing Parameters
    if (!studentId || isSummaryError) {
        return (
            <div className="w-[90%] mx-auto mt-20 p-8 border border-dashed rounded-xl bg-white flex flex-col items-center text-center gap-3">
                <CalendarX className="w-12 h-12 text-slate-400" />
                <div>
                    <h3 className="text-lg font-bold text-slate-900">No Student Targeted</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-0.5">
                        Please return to your dashboard console interface and select a child to review live statements.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[90%] mx-auto mt-20 flex flex-col gap-7 animate-in fade-in duration-300">

            {/* Dynamic Account Balance Summary */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-[20px] text-slate-900">Account Balance</h2>
                    <h2 className="text-sla-blue font-semibold bg-sla-blue/10 px-3 py-1 rounded-full text-xs">
                        {summary?.schoolYear}
                    </h2>
                </div>
                <p className="text-[14px] text-muted-foreground">
                    Financial Summary for <span className="font-bold text-slate-700">{summary?.studentName}</span>
                </p>

                <div className="w-full bg-sla-blue text-white p-8 pb-12 mt-3 rounded-xl shadow-md relative overflow-hidden">
                    <div className="absolute right-6 bottom-4 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <p className="text-[#C9D5E3] text-xs font-bold tracking-wider uppercase">Current Outstanding Balance</p>
                    <h2 className="text-[40px] font-black mt-1">
                        ₱{summary?.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Last Payment Block */}
                    <div className="bg-white p-5 flex flex-col gap-1 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sla-blue text-[12px] font-bold tracking-wider">LAST REMITTED REMITTANCE</p>
                        <h2 className="text-[22px] font-black text-slate-800">
                            {summary?.lastPaymentAmount 
                                ? `₱${summary.lastPaymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                                : "₱0.00"
                            }
                        </h2>
                        <p className="text-sla-gray text-[12px]">
                            {summary?.lastPaymentDate 
                                ? new Date(summary.lastPaymentDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
                                : "No logs documented"
                            }
                        </p>
                    </div>

                    {/* Quick Metrics Assistant */}
                    <div className="bg-white p-5 flex flex-col gap-1 rounded-xl shadow-sm border border-slate-100 justify-center">
                        <p className="text-sla-blue text-[12px] font-bold tracking-wider">ACADEMIC PLACEMENT LEVEL</p>
                        <h2 className="text-[20px] font-bold text-slate-700 uppercase tracking-wide mt-0.5">
                            {summary?.gradeLevel}
                        </h2>
                        <p className="text-sla-gray text-[12px] italic">St. Louisse Academy Registered Pupil</p>
                    </div>
                </div>
            </div>

            {/* Real-time Dynamic School Fees Breakdown */}
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-[16px] text-slate-800">School Fees Breakdown</p>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4">
                    <div className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between font-bold text-slate-900 text-sm">
                            <p>Tuition Assessment Total</p>
                            <p>₱{summary?.totalTuition.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex justify-between mt-1.5 pl-2"> 
                            <p className="font-medium text-sla-gray text-xs">Base Instruction Fee</p>
                            <p className="text-slate-600 text-xs">₱{summary?.baseTuition.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex justify-between mt-1 pl-2"> 
                            <p className="font-medium text-sla-gray text-xs">Miscellaneous Pool</p>
                            <p className="text-slate-600 text-xs">₱{summary?.miscellaneous.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-between font-bold text-slate-900 text-sm">
                        <p>Required Educational Books & Resource Modules</p>
                        <p>₱{summary?.bookFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            {/* Payment History Log Table Block Component */}
            <PaymentHistory customLogs={logs} isLoading={isLoadingHistory} />
        </div>
    );
}