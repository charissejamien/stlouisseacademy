"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle, AlertTriangle, ArrowLeft, Printer, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { 
    getDCPRHistorySummaries, 
    getDPRRowsByDate, 
    DCPRSummaryLog, 
    PaymentRowItem 
} from "@/app/(portal)/registrar/dcpr/actions";

export default function RegistrarDCPRPage() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { data: dcprLogs = [], isLoading, error } = useQuery<DCPRSummaryLog[]>({
        queryKey: ["dcprHistorySummaries"],
        queryFn: getDCPRHistorySummaries
    });

    if (isLoading) {
        return (
            <div className="w-full h-96 flex flex-col justify-center items-center gap-2">
                <Loader2 className="w-8 h-8 text-sla-blue animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Reconciling live database reports...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-destructive/10 text-destructive rounded-lg font-medium text-sm">
                Operational Error: Failed to extract execution daybook files from database connection.
            </div>
        );
    }

    if (selectedDate) {
        return <DailyPaymentsBreakdownView dateString={selectedDate} onBack={() => setSelectedDate(null)} />;
    }

    return (
        <div className="w-full flex flex-col gap-6 mt-10 ml-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-sla-blue">Daily Cashier's Position Report (DCPR)</h1>
                <p className="text-sm text-muted-foreground">Review audited transaction collection logs and verification statuses from school operations.</p>
            </div>

            {dcprLogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dcprLogs.map((log) => (
                        <Card 
                            key={log.id} 
                            onClick={() => setSelectedDate(log.date)} 
                            className="hover:shadow-md border-slate-200 transition-all duration-200 cursor-pointer active:scale-[0.99] flex flex-col justify-between"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b">
                                <div className="flex items-center gap-2 font-semibold text-slate-700">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{log.date}</span>
                                </div>
                                {log.isVerifiedByOwner ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Verified by Owner
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Pending Review
                                    </span>
                                )}
                            </CardHeader>
                            
                            <CardContent className="pt-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Remittance</span>
                                    <span className="text-xl font-black text-sla-blue">
                                        ₱{log.totalCashCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span>Processed Transactions:</span>
                                    <span className="font-bold text-slate-700">{log.totalPaymentsCount} Receipts Issued</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-8 text-center text-muted-foreground italic text-sm border-dashed">
                    No collection entries committed inside the system ledger files yet.
                </Card>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */

interface BreakdownProps {
    dateString: string;
    onBack: () => void;
}

function DailyPaymentsBreakdownView({ dateString, onBack }: BreakdownProps) {
    const { data: paymentsList = [], isLoading } = useQuery<PaymentRowItem[]>({
        queryKey: ["dcprLedgerLines", dateString],
        queryFn: () => getDPRRowsByDate(dateString)
    });

    const grossCashCollected = paymentsList.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-150 m-10 ml-10">
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

            <Card className="shadow-sm border-slate-200">
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
                    {isLoading ? (
                        <div className="py-12 flex justify-center items-center gap-2 text-muted-foreground text-sm italic">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            Loading matching financial transaction logs from Supabase tables...
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader className="bg-slate-100/80">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700">Student Name</TableHead>
                                        <TableHead className="font-bold text-slate-700">OR Number</TableHead>
                                        <TableHead className="font-bold text-slate-700">Specific Allocation</TableHead>
                                        <TableHead className="font-bold text-slate-700 text-right">Amount</TableHead>
                                        <TableHead className="font-bold text-slate-700 text-right">Total Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paymentsList.length > 0 ? (
                                        paymentsList.map((item, index) => {
                                            const isFirstReceiptInstance = paymentsList.findIndex(p => p.orNumber === item.orNumber) === index;
                                            const siblingRowsCount = paymentsList.filter(p => p.orNumber === item.orNumber).length;

                                            return (
                                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                                    {/* Row renders targeted student name index directly */}
                                                    <TableCell className="font-medium text-slate-900">{item.studentName}</TableCell>
                                                    <TableCell className="font-mono font-bold text-slate-600">{item.orNumber}</TableCell>
                                                    <TableCell className="text-slate-600 italic text-xs font-semibold text-primary">{item.allocation}</TableCell>
                                                    <TableCell className="text-right font-medium text-slate-700">
                                                        ₱{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </TableCell>
                                                    
                                                    {isFirstReceiptInstance && (
                                                        <TableCell 
                                                            rowSpan={siblingRowsCount} 
                                                            className="text-right font-bold text-slate-900 bg-slate-50/30 border-l align-middle"
                                                        >
                                                            ₱{item.parentTotalCollection.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </TableCell>
                                                    )}
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

                            <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-lg shadow-sm">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accountability Verification Target</span>
                                    <span className="text-xs text-slate-300">Sum total of cash items managed today</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-medium text-slate-400">Total Collected Cash:</span>
                                    <span className="text-2xl font-black tracking-tight text-white border-b-2 border-double border-white/50 px-1">
                                        ₱{grossCashCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}