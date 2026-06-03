"use client";

import { Wallet, Loader2, Inbox } from 'lucide-react';
import { useState } from 'react';

// Define the shape of a single payment record for Type Safety
interface PaymentLog {
    id: string;
    or_number: string;
    amount: number;
    mode_of_payment: string;
    billing_period: string;
    created_at: string;
}

interface PaymentHistoryProps {
    customLogs?: PaymentLog[];
    isLoading?: boolean;
}

export default function PaymentHistory({ customLogs = [], isLoading = false }: PaymentHistoryProps) {
    const paymentFilters = ["All", "Tuition", "Books", "Others"];
    const [activeFilter, setActiveFilter] = useState("All");

    // 🔍 Reactive client-side filtering matching your button rows selection logic
    const filteredLogs = customLogs.filter((log) => {
        if (activeFilter === "All") return true;
        
        const category = activeFilter.toLowerCase();
        const period = log.billing_period?.toLowerCase() || "";
        
        // Matches your categories against the milestone indicator string logged by the registrar
        return period.includes(category);
    });

    return (
        <div className='flex flex-col gap-3 w-full'>
            <p className='font-medium text-[18px] text-slate-900'>Payment History</p>
            
            {/* Filter Pill Row Controls */}
            <div className="flex gap-2">
                {paymentFilters.map((item) => (
                    <button 
                        key={item} 
                        onClick={() => setActiveFilter(item)} 
                        className={`${
                            activeFilter === item 
                                ? "bg-sla-blue text-white shadow-sm font-medium" 
                                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                        } px-4 py-1.5 text-[14px] rounded-md transition-all duration-150`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* Asynchronous Fetch Layout Wrapper */}
            {isLoading ? (
                <div className="bg-white flex items-center justify-center py-10 rounded-xl border border-slate-100 w-full text-muted-foreground gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-sla-blue" />
                    <span className="text-sm font-medium">Loading collection receipts...</span>
                </div>
            ) : filteredLogs.length > 0 ? (
                // 🔄 Dynamic Loop rendering absolute rows securely using unique record tokens
                <div className="flex flex-col gap-3 w-full">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="bg-white flex py-6 rounded-xl gap-7 w-full px-5 border border-slate-100 items-center shadow-sm hover:shadow-md transition-all animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className='flex items-center justify-center'>
                                <div className='bg-blue-50 text-sla-blue rounded-full p-3.5 border border-blue-100/30'>
                                    <Wallet size={24} />
                                </div>
                            </div>
                            
                            <div className='flex-1 flex flex-col gap-1'> 
                                <div className='flex justify-between items-start'>
                                    <p className='text-[18px] font-bold text-slate-800'>
                                        {new Date(log.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <p className='text-[18px] font-black text-sla-blue font-mono'>
                                        ₱{Number(log.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className='flex justify-between items-center text-sm'>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border text-xs font-semibold">
                                            OR: {log.or_number}
                                        </span>
                                        {log.billing_period && (
                                            <span className="text-xs text-muted-foreground font-medium italic">
                                                • For {log.billing_period}
                                            </span>
                                        )}
                                    </div>
                                    <p className='text-[#037609] bg-[#AFF39C]/60 border border-[#AFF39C] py-0.5 px-2 text-xs font-semibold rounded-sm tracking-wide uppercase'>
                                        {log.mode_of_payment || "Cash"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty Fallback Boundary Window View Layout
                <div className="bg-white flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-slate-200 w-full text-muted-foreground gap-1.5 p-4">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700 mt-1">No payment transactions registered</p>
                    <p className="text-xs text-slate-400">There are no documented ledger receipts matching the selection category filter.</p>
                </div>
            )}
        </div>
    );
}