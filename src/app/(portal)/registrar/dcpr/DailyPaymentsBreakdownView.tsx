"use client";

import { ArrowLeft, Printer, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface BreakdownProps {
    dcprId: string;
    dateString: string;
    onBack: () => void;
}

interface PaymentRowItem {
    id: string;
    parentName: string;
    orNumber: string;
    allocation: string;
    amount: number;
    parentTotalCollection: number; // Sum total across identical OR values
}

// Dummy data mirroring your multi-payment mapping parameters
const mockDayPayments: Record<string, PaymentRowItem[]> = {
    "dcpr-2026-06-02": [
        { id: "p1", parentName: "Cardo Dalisay", orNumber: "OR-99210", allocation: "Juan Dela Cruz - June Installment", amount: 3500.00, parentTotalCollection: 7000.00 },
        { id: "p2", parentName: "Cardo Dalisay", orNumber: "OR-99210", allocation: "Maria Dela Cruz - June Installment", amount: 3500.00, parentTotalCollection: 7000.00 },
        { id: "p3", parentName: "Neri Miranda", orNumber: "OR-99211", allocation: "Chito Miranda - Full Tuition", amount: 3500.00, parentTotalCollection: 3500.00 }
    ],
    "dcpr-2026-06-01": []
};

// 📦 COMPONENT 2: SUB-BREAKDOWN DETAIL DATA LOGGER VIEW
export function DailyPaymentsBreakdownView({ dcprId, dateString, onBack }: BreakdownProps) {
    // In production, fetch this list dynamically inside your user click trigger via a server call
    const paymentsList = mockDayPayments[dcprId] || [];

    // Calculate sum aggregate collections line item safely
    const grossCashCollected = paymentsList.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" /> Back to History
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Collection Ledger Logs</h1>
                        <p className="text-xs text-muted-foreground">Audited payment breakdown items mapped for {dateString}</p>
                    </div>
                </div>
                <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print Ledger Report
                </Button>
            </div>

            {/* 📝 THE PRINTABLE OFFICIAL RECORD MODULE GRID */}
            <Card className="shadow-sm border-slate-200 id='printable-dcpr-sheet'">
                <CardHeader className="border-b bg-slate-50/40 py-4 flex flex-row items-center justify-between">
                    <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">St. Louisse Academy Ledger</span>
                        <CardTitle className="text-lg font-bold text-slate-800 mt-0.5">Daily Cashier's Position Report</CardTitle>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-mono text-sm font-bold text-slate-900 bg-white px-3 py-1 border rounded shadow-sm">{dateString}</span>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-6 flex flex-col gap-6">
                    <Table>
                        <TableHeader className="bg-slate-100/80">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700">Account Payer (Name)</TableHead>
                                <TableHead className="font-bold text-slate-700">OR Number</TableHead>
                                <TableHead className="font-bold text-slate-700">Specific Allocation</TableHead>
                                <TableHead className="font-bold text-slate-700 text-right">Amount</TableHead>
                                <TableHead className="font-bold text-slate-700 text-right">Total Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentsList.length > 0 ? (
                                paymentsList.map((item, index) => {
                                    // Row span logic calculates if this row is the first instance of a shared family receipt container
                                    const isFirstReceiptInstance = paymentsList.findIndex(p => p.orNumber === item.orNumber) === index;
                                    const siblingRowsCount = paymentsList.filter(p => p.orNumber === item.orNumber).length;

                                    return (
                                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-900">{item.parentName}</TableCell>
                                            <TableCell className="font-mono font-bold text-slate-600">{item.orNumber}</TableCell>
                                            <TableCell className="text-slate-600 italic text-xs">{item.allocation}</TableCell>
                                            <TableCell className="text-right font-medium text-slate-700">
                                                ₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            
                                            {/* Conditionally cluster row totals for multiple items split on one single OR slip context */}
                                            {isFirstReceiptInstance ? (
                                                <TableCell 
                                                    rowSpan={siblingRowsCount} 
                                                    className="text-right font-bold text-slate-900 bg-slate-50/30 border-l align-middle"
                                                >
                                                    ₱{item.parentTotalCollection.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                            ) : null}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground italic py-8">
                                        No financial remittance logs registered on this operational date index.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Separator className="border-dashed" />

                    {/* 📊 RUNNING TOTAL COLLECTED FOOTER STRIP */}
                    <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-lg shadow-sm">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accountability Verification Target</span>
                            <span className="text-xs text-slate-300">Sum total of verified cash items managed today</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs font-medium text-slate-400">Total Collected Cash:</span>
                            <span className="text-2xl font-black tracking-tight text-white border-b-2 border-double border-white/50 px-1">
                                ₱{grossCashCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}