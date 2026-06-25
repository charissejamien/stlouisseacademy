"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DollarSign, FileText } from "lucide-react";

export default function ParentBilling() {
  const ledger = [
    { date: "06/01/2026", desc: "Initial Enrollment Downpayment", ref: "OR-2026-8812", amount: 5000.00, status: "Cleared" },
    { date: "06/10/2026", desc: "Standard Book Bundle Allocation", ref: "OR-2026-9041", amount: 4500.00, status: "Cleared" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Statement of Account</h2>
        <p className="text-xs text-slate-500">Track outstanding balances, structural fee partitions, and collection logs.</p>
      </div>

      {/* Running Balances Display block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900 text-white shadow-md border-0 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
          <p className="text-3xl font-extrabold tracking-tight">₱12,500.00</p>
          <p className="text-[11px] text-amber-400 font-medium pt-1">Next due block threshold: June 30</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Structural Fees</span>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">₱22,000.00</p>
          <p className="text-[11px] text-slate-400 font-medium pt-1">ESC Subvention applied</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Paid-To-Date</span>
          <p className="text-3xl font-bold text-emerald-600 tracking-tight">₱9,500.00</p>
          <p className="text-[11px] text-emerald-600 font-medium pt-1">Across 2 posted transactions</p>
        </Card>
      </div>

      {/* Receipt Logs */}
      <Card className="bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <FileText className="w-4 h-4 text-slate-400" />
          <h3 className="font-bold text-sm text-slate-900">Transaction History</h3>
        </div>
        <div className="border rounded-md overflow-hidden text-sm">
          <div className="grid grid-cols-5 bg-slate-50 p-3 font-semibold text-slate-500 text-xs uppercase border-b">
            <span>Post Date</span>
            <span className="col-span-2">Description</span>
            <span>Reference OR No.</span>
            <span className="text-right">Amount (₱)</span>
          </div>
          <div className="divide-y">
            {ledger.map((item, idx) => (
              <div key={idx} className="grid grid-cols-5 items-center p-3.5 text-slate-700">
                <span className="text-xs font-medium text-slate-400 font-mono">{item.date}</span>
                <span className="col-span-2 font-medium text-slate-900">{item.desc}</span>
                <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border max-w-fit">{item.ref}</span>
                <span className="text-right font-bold text-slate-900">₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}