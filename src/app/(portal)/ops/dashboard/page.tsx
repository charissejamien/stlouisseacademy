"use client";

import React from "react";

export default function OpsDashboard() {
  // Mock tracking metrics for high-level summary cards
  const summaryStats = {
    students: { total: 1245, activeThisYear: 1180, pendingRegistration: 65 },
    employees: { total: 48, teachers: 32, supportStaff: 16 },
    financials: { totalCollectedYTD: "₱4,850,200.00", pendingReceivables: "₱1,210,500.00", recentTransactions: 14 }
  };

  // Mock operational bottlenecks layout (your specific tracking needs)
  const operationalAlerts = {
    missingRfid: 5,
    missingPhotos: 3,
    pendingApprovals: 8
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Control Title Banner */}
        <div className="border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Central Institutional Control
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Ops Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Unified systems registry, real-time fiscal aggregates, and hardware deployment states.</p>
        </div>

        {/* Dynamic Action Alerts: System Bottlenecks */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Pending Deployment Checklist Tasks</h4>
              <p className="text-xs text-slate-500 mt-0.5">There are <span className="font-semibold text-amber-700">{operationalAlerts.missingRfid} personnel profiles</span> lacking active RFID card synchronization and <span className="font-semibold text-amber-700">{operationalAlerts.missingPhotos} profiles</span> missing official avatar uploads.</p>
            </div>
          </div>
          <button className="text-xs font-bold bg-white border border-amber-200 text-amber-800 hover:bg-amber-100/50 px-4 py-2 rounded-xl transition-colors shrink-0">
            Resolve Access Links
          </button>
        </div>

        {/* Master Analytics Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card Module 1: Student Statistics */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Student Body Overview</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{summaryStats.students.total}</span>
              <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-50">
              <div>
                <span className="block text-slate-400 font-medium">Active Status</span>
                <span className="text-sm font-bold text-slate-800">{summaryStats.students.activeThisYear}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Pending Approvals</span>
                <span className="text-sm font-bold text-amber-600">+{summaryStats.students.pendingRegistration}</span>
              </div>
            </div>
          </div>

          {/* Card Module 2: Employee Metrics */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Institutional Personnel</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">{summaryStats.employees.total}</span>
              <span className="text-xs font-semibold text-slate-400">Active Staff</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-50">
              <div>
                <span className="block text-slate-400 font-medium">Academic Faculty</span>
                <span className="text-sm font-bold text-slate-800">{summaryStats.employees.teachers}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Operations / Support</span>
                <span className="text-sm font-bold text-slate-800">{summaryStats.employees.supportStaff}</span>
              </div>
            </div>
          </div>

          {/* Card Module 3: Financial Double-Check Tracker */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Financial Verification Vault</h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Total Collections YTD</span>
              <div className="text-3xl font-black text-emerald-600 tracking-tight">{summaryStats.financials.totalCollectedYTD}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-slate-50">
              <div>
                <span className="block text-slate-400 font-medium">Uncollected Receivables</span>
                <span className="text-sm font-bold text-slate-700">{summaryStats.financials.pendingReceivables}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-medium">Today's Transactions</span>
                <span className="text-sm font-bold text-blue-600">+{summaryStats.financials.recentTransactions} logs</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Panel Grid: Quick Shortcuts & Audit Timelines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Operations Direct Access Dashboard Links */}
          <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-3">Operational Utility Gates</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 flex items-center justify-between group transition-all">
                <div>
                  <span className="block text-sm font-bold text-slate-800">Personnel Directory</span>
                  <span className="text-xs text-slate-400">Onboard new hires and track system entries</span>
                </div>
                <span className="text-slate-300 group-hover:text-slate-800 transition-colors">&rarr;</span>
              </button>
              
              <button className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 flex items-center justify-between group transition-all">
                <div>
                  <span className="block text-sm font-bold text-slate-800">RFID Hardware Sync Node</span>
                  <span className="text-xs text-slate-400">Scan and map physical tags to user profiles</span>
                </div>
                <span className="text-slate-300 group-hover:text-slate-800 transition-colors">&rarr;</span>
              </button>
              
              <button className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 flex items-center justify-between group transition-all">
                <div>
                  <span className="block text-sm font-bold text-slate-800">Media & Photography Hub</span>
                  <span className="text-xs text-slate-400">Capture avatars and store security image paths</span>
                </div>
                <span className="text-slate-300 group-hover:text-slate-800 transition-colors">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Audit Monitor Row */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Real-time Financial Audit Trail</h3>
                <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">View Full Ledger</span>
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                  <div>
                    <span className="font-bold text-slate-800 block">Tuition Initial Downpayment Confirmed</span>
                    <span className="text-slate-400">Student Ref: #20260481 • Mode: Over-the-counter Cash</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+ ₱7,500.00</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                  <div>
                    <span className="font-bold text-slate-800 block">SHS Book Set Procurement Cleared</span>
                    <span className="text-slate-400">Student Ref: #20261102 • Mode: GCash Verification</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+ ₱3,200.00</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Miscellaneous Laboratory Fee Collection</span>
                    <span className="text-slate-400">Student Ref: #20260129 • Mode: Bank Transfer (BDO)</span>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">+ ₱1,850.00</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
              💡 <span className="font-semibold text-slate-600">Audit Hint:</span> Cross-reference OR numbers against your bank statement dumps weekly to check for payment clearing sync anomalies.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}