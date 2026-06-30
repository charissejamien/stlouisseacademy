"use client";

import React from "react";
import { Card } from "@/components/ui/card";

// Comprehensive mock data representing a standard school ledger transaction receipt
const SAMPLE_INVOICE_DATA = {
    receiptNumber: "OR-2026-8942",
    dateIssued: "June 27, 2026",
    paymentMode: "G-Cash",
    referenceNumber: "GCASH-982415722",
    status: "PAID",
    
    schoolInfo: {
        name: "Rooted Local Academy",
        address: "Central Visayas, District Region VII, Philippines",
        contact: "info@rootedlocalacademy.edu.ph | (032) 412-8899",
        tin: "TIN: 412-556-789-000"
    },
    studentInfo: {
        id: "STU-2024-0412",
        name: "JUAN CRISOSTOMO IBARRA",
        gradeLevel: "Grade 7",
        section: "St. Thomas",
        schoolYear: "SY 2026-2027"
    },
    // Itemized breakdown of accounts
    particulars: [
        { item: "Tuition Fee — First Semester (Downpayment)", gross: 15000.00, subsidy: 9000.00, net: 6000.00 },
        { item: "Registration & Miscellaneous Fees", gross: 2500.00, subsidy: 0.00, net: 2500.00 },
        { item: "Laboratory & Computer Laboratory Access Fee", gross: 1200.00, subsidy: 0.00, net: 1200.00 },
        { item: "Textbooks & Learning Materials (Full Pack)", gross: 4500.00, subsidy: 0.00, net: 4500.00 }
    ],
    summary: {
        totalGross: 23200.00,
        totalSubsidy: 9000.00,
        totalNetDue: 14200.00,
        amountPaid: 14200.00,
        balanceRemaining: 0.00
    },
    cashier: "M. Dela Cruz"
};

export default function ReceiptSandboxPage() {
    return (
        <div className="w-full min-h-screen p-8 bg-slate-100 flex flex-col justify-center items-center font-sans antialiased">
            
            {/* Main Receipt Blueprint Container */}
            <Card className="w-full max-w-3xl p-8 bg-white border border-slate-300 shadow-lg rounded-xl">
                
                {/* 1. INSTITUTIONAL HEADER */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">{SAMPLE_INVOICE_DATA.schoolInfo.name}</h1>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">{SAMPLE_INVOICE_DATA.schoolInfo.address}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{SAMPLE_INVOICE_DATA.schoolInfo.contact}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{SAMPLE_INVOICE_DATA.schoolInfo.tin}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2">
                            {SAMPLE_INVOICE_DATA.status}
                        </div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Official Receipt</h2>
                        <p className="text-sm font-mono font-black text-slate-900 mt-0.5">{SAMPLE_INVOICE_DATA.receiptNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">Date: {SAMPLE_INVOICE_DATA.dateIssued}</p>
                    </div>
                </div>

                {/* 2. CUSTOMER / STUDENT LEDGER META */}
                <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex flex-col gap-1.5">
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Student Name</span>
                            <span className="font-bold text-slate-900 text-sm">{SAMPLE_INVOICE_DATA.studentInfo.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Student ID Number</span>
                            <span className="font-mono font-bold text-slate-700">{SAMPLE_INVOICE_DATA.studentInfo.id}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Level / Section</span>
                            <span className="font-semibold text-slate-800">{SAMPLE_INVOICE_DATA.studentInfo.gradeLevel} — {SAMPLE_INVOICE_DATA.studentInfo.section}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">School Year</span>
                            <span className="font-semibold text-slate-800">{SAMPLE_INVOICE_DATA.studentInfo.schoolYear}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Payment Mode</span>
                            <span className="font-semibold text-slate-800">{SAMPLE_INVOICE_DATA.paymentMode}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider block">Reference Reference</span>
                            <span className="font-mono text-slate-600 truncate block">{SAMPLE_INVOICE_DATA.referenceNumber}</span>
                        </div>
                    </div>
                </div>

                {/* 3. ITEMIZED BREAKDOWN TABLE (PARTICULARS) */}
                <div className="w-full mt-6">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="py-2.5">Description / Particulars</th>
                                <th className="py-2.5 text-right">Gross Assessment</th>
                                <th className="py-2.5 text-right">Deductions / Subsidy</th>
                                <th className="py-2.5 text-right">Net Amount Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {SAMPLE_INVOICE_DATA.particulars.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/40">
                                    <td className="py-3 font-semibold text-slate-800">{item.item}</td>
                                    <td className="py-3 text-right font-mono text-slate-500">₱{item.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="py-3 text-right font-mono text-rose-600">
                                        {item.subsidy > 0 ? `-₱${item.subsidy.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "—"}
                                    </td>
                                    <td className="py-3 text-right font-mono font-bold text-slate-900">₱{item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. TOTALS CALCULATIONS SIDE PANEL */}
                <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
                    <div className="w-72 flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Total Gross Assessment:</span>
                            <span className="font-mono">₱{SAMPLE_INVOICE_DATA.summary.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-600">
                            <span>Total Subsidy / Grants Applied:</span>
                            <span className="font-mono">-₱{SAMPLE_INVOICE_DATA.summary.totalSubsidy.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-900 font-bold pt-1 border-t border-dashed border-slate-200">
                            <span>Net Total Due:</span>
                            <span className="font-mono text-sm">₱{SAMPLE_INVOICE_DATA.summary.totalNetDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700 font-black bg-emerald-50 border border-emerald-100/60 p-2 rounded-lg my-1">
                            <span>Total Amount Rendered:</span>
                            <span className="font-mono text-sm">₱{SAMPLE_INVOICE_DATA.summary.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 font-semibold px-2">
                            <span>Remaining Balance Due:</span>
                            <span className="font-mono">
                                {SAMPLE_INVOICE_DATA.summary.balanceRemaining > 0 
                                    ? `₱${SAMPLE_INVOICE_DATA.summary.balanceRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                                    : "₱0.00 (Fully Settled)"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 5. VALIDATION SIGNATURE BLOCK */}
                <div className="flex justify-between items-end mt-12 pt-6 border-t border-slate-100 text-xs">
                    <div className="max-w-xs text-[10px] text-slate-400 leading-relaxed">
                        <span className="font-bold uppercase tracking-wider block mb-0.5 text-slate-500">Important Reminders</span>
                        This serves as an official proof of payment matrix. Please retain this statement for clearance, verification processing, and exam permit release tracking loops.
                    </div>
                    <div className="text-center w-48 border-t border-slate-400 pt-1">
                        <span className="font-bold text-slate-800 block uppercase tracking-wide">{SAMPLE_INVOICE_DATA.cashier}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Authorized School Cashier</span>
                    </div>
                </div>

            </Card>
        </div>
    );
}