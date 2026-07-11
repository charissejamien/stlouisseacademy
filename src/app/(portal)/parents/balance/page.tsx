"use client";

import { useState } from "react";

import { Banknote, Tag, HelpCircle } from "lucide-react";

export default function ParentsBalance() {
  // Main View Router Tabs
  const [activeTab, setActiveTab] = useState("payables");
  
  // Payment History Sub-Filter View State: 'all' | 'tuition' | 'books' | 'others'
  const [historyFilter, setHistoryFilter] = useState("all");

  // Primary Account Ledger Dues
  const primaryPayables = [
    { id: 1, name: "Tuition Fee", totalAssessment: 14470.00, remaining: 9969.00, status: "Partially Paid" },
    { id: 2, name: "Books", totalAssessment: 7470.00, remaining: 0, status: "Fully Paid" },
  ];

  // Incidental Table Rows
  const otherFeesList = [
    { id: 3, name: "School Publication Fee", total: 250.00, status: "Unpaid" },
    { id: 4, name: "JS Prom Contribution", total: 1500.00, status: "Unpaid" },
    { id: 5, name: "Intramurals Shirt & Fee", total: 350.00, status: "Fully Paid" },
  ];

  // Comprehensive Centralized Transaction Records Stream
  const transactionLogs = [
    { date: "Jun 15, 2026", label: "Tuition Installment", type: "tuition", amount: "P3,000.00", method: "Cash", or: "65102" },
    { date: "Jul 02, 2026", label: "Tuition Installment", type: "tuition", amount: "P1,501.00", method: "Bank Transfer", or: "66411" },
    { date: "May 28, 2026", label: "Books Clearing Payment", type: "books", amount: "P7,470.00", method: "Cash", or: "64291" },
    { date: "July 05, 2026", label: "Intramurals Remittance", type: "others", amount: "P350.00", method: "Cash", or: "67120" },
  ];

  // Filter computation for central ledger tab view
  const filteredTransactions = transactionLogs.filter(log => {
    if (historyFilter === "all") return true;
    return log.type === historyFilter;
  });

  return (
    <div className="mt-5 w-[90%] mx-auto flex flex-col gap-6 pb-12">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-semibold text-slate-800">Account Balance</h2>
          <p className="mt-1 text-sm text-gray-500">Official Student Financial Statement</p>
        </div>
      </div>

      {/* Blue Banner: Outstanding Core Tuition Only */}
      <div className="bg-[#3470ED] text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
        <p className="text-sm text-blue-100 tracking-wide font-medium">Remaining Tuition Balance</p>
        <p className="text-4xl font-bold tracking-wide mt-1">P17,720.00</p>
        <p className="text-[11px] text-blue-200/90 mt-2 font-light border-t border-white/20 pt-2">
          *Excludes special activities, events, and miscellaneous ad-hoc fees.
        </p>
      </div>

      {/* MAIN LAYOUT TABS SWITCHER */}
      <div className="flex bg-slate-200/60 p-1 rounded-xl text-xs sm:text-sm font-semibold tracking-wide w-full">
        <button 
          onClick={() => setActiveTab("payables")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-all ${
            activeTab === "payables" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
          }`}
        >
          Payables
        </button>
        <button 
          onClick={() => setActiveTab("ledger")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-all ${
            activeTab === "ledger" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
          }`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab("statement")}
          className={`flex-1 py-2.5 text-center rounded-lg transition-all ${
            activeTab === "statement" ? "bg-white shadow-sm text-slate-800" : "text-slate-500"
          }`}
        >
          Statement
        </button>
      </div>

      {/* VIEWS CONTEXT DISPLAY MANAGER */}
      <div className="w-full">
        
        {/* ==================== TAB 1: PAYABLES ==================== */}
        {activeTab === "payables" && (
          <div className="flex flex-col gap-5 w-full">
            
            {/* Primary Dues (Tuition & Books) */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Primary Academic Fees
              </p>
              {primaryPayables.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center w-full">
                    <p className="font-semibold text-slate-800 text-base">{item.name}</p>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                      item.status === "Fully Paid" ? "bg-[#AFF39C]/40 text-[#037609]" : "bg-amber-100 text-amber-700"
                    }`}>{item.status}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <p>Total Assessment:</p>
                    <p className="font-medium text-slate-700">P{item.totalAssessment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <p>Remaining Balance:</p>
                    <p className={`font-semibold ${item.remaining === 0 ? "text-[#037609]" : "text-slate-700"}`}>
                      P{item.remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Other Fees Grouped Data Grid */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 mb-1">
                Other Fees
              </p>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50/70 px-4 py-2.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <div className="col-span-6 flex items-center gap-1">
                    Specifics 
                    <span title="Incidental campus assessments">
                      <HelpCircle size={12} className="text-slate-300 cursor-pointer" />
                    </span>
                  </div>
                  <div className="col-span-3 text-right">Amount</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {otherFeesList.map((fee) => (
                    <div key={fee.id} className="grid grid-cols-12 px-4 py-3 text-xs items-center gap-1">
                      <div className="col-span-6 font-medium text-slate-700 truncate pr-2">
                        {fee.name}
                      </div>
                      <div className="col-span-3 text-right font-semibold text-slate-600">
                        P{fee.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="col-span-3 text-right">
                        <span className={`inline-block font-bold text-[10px] ${
                          fee.status === "Fully Paid" ? "text-[#037609]" : "text-red-500"
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Total Aggregate Card Summary */}
            <div className="mt-1 bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-sm flex justify-between items-center">
              <p className="font-semibold text-slate-500">Gross Total Assessments</p>
              <p className="font-bold text-slate-800">P24,060.00</p>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PAYMENT HISTORY ==================== */}
        {activeTab === "ledger" && (
          <div className="flex flex-col gap-4 w-full">
            
            {/* SUB-FILTER SELECTOR PILLS */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["all", "tuition", "books", "others"].map((category) => (
                <button
                  key={category}
                  onClick={() => setHistoryFilter(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize tracking-wide transition-all border ${
                    historyFilter === category
                      ? "bg-slate-800 border-slate-800 text-white shadow-xs"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex gap-3 items-center">
                      <Banknote size={40} className="bg-[#D6E3FF] text-[#3470ED] p-2 rounded-full shrink-0"/>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{log.label}</p>
                        <div className="flex gap-2 text-[12px] text-slate-500 mt-0.5 items-center">
                          <span>{log.date}</span>
                          <span className="text-slate-300">|</span>
                          <span>OR: {log.or}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <p className="font-bold text-[#3470ED] text-base">{log.amount}</p>
                      <span className="text-[11px] font-medium text-[#037609] bg-[#AFF39C] px-2 py-0.5 mt-1 rounded-sm">
                        {log.method}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No matching transaction history records found for this category filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: STATEMENT ==================== */}
        {activeTab === "statement" && (
          <div className="flex flex-col gap-6 w-full">
            
            {/* AUDIT CARD 1: TUITION COMPREHENSIVE CALCULATION LOGIC */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Tuition Ledger Details
              </p>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <p>Base Tuition Charge</p>
                  <p className="font-medium text-slate-800">P12,000.00</p>
                </div>
                
                {/* Embedded Discount Subtraction strictly mapping inside Tuition */}
                <div className="bg-slate-50 p-3 rounded-lg flex flex-col gap-2 border border-slate-100">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-[#037609] font-medium">
                      <Tag size={12} />
                      <p>Academic Scholar Top 1 (Deduction)</p>
                    </div>
                    <p className="font-bold text-[#037609]">- P4,000.00</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-1.5 flex justify-between items-center text-xs font-semibold text-slate-700">
                    <p>Net Base Tuition</p>
                    <p>P8,000.00</p>
                  </div>
                </div>

                <div className="flex justify-between text-slate-600 pt-1">
                  <p>Institutional Miscellaneous Fees</p>
                  <p className="font-medium text-slate-800">P2,470.00</p>
                </div>

                <div className="mt-2 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <p className="font-semibold text-slate-800">Total Net Tuition Assessment</p>
                  <p className="font-bold text-[#3470ED] text-base">P14,470.00</p>
                </div>
              </div>
            </div>
            
            {/* AUDIT CARD 2: BOOKS ASSESSMENTS */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Learning Materials
              </p>
              <div className="bg-white p-5 rounded-xl shadow-sm mt-2 flex flex-col gap-3 text-sm border border-slate-100">
                <div className="flex justify-between text-slate-700">
                  <p className="font-medium text-slate-800">Books</p>
                  <p className="font-semibold text-slate-800">P7,470.00</p>
                </div>
              </div>
            </div>

            {/* AUDIT CARD 3: AUXILIARY & ACTIVITY FEES */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Auxiliary & Activity Fees
              </p>
              <div className="mt-2 flex flex-col gap-3 bg-white p-5 rounded-xl border border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <p>School Publication Fee</p>
                  <p className="font-medium text-slate-800">P250.00</p>
                </div>
                <div className="flex justify-between text-slate-600">
                  <p>JS Prom Contribution</p>
                  <p className="font-medium text-slate-800">P1,500.00</p>
                </div>
                <div className="flex justify-between text-slate-600">
                  <p>Intramurals Shirt & Fee</p>
                  <p className="font-medium text-slate-800">P350.00</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}