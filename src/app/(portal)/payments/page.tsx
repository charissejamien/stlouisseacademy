"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"


export default function Payments() {

    const router = useRouter()


    return(
        <div className="w-[90%] mx-auto mt-20 space-y-10">
            <div className="flex justify-end">
                <Button
                    onClick={() => router.push("/payments/new")}
                >
                    Add Payment
                </Button>
            </div>

            <div className="flex gap-10">

                {/* Recent Transactions */}
                <div className="w-[70%] space-y-3">
                    <Label>Recent Transactions</Label>
                    <Table className="bg-white rounded-lg shadow-md">
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Student</TableHead>
                                <TableHead>Payment Specifics</TableHead>
                                <TableHead>OR Number</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Alagbay, Naiah</TableCell>
                                <TableCell>July Installment</TableCell>
                                <TableCell>001101</TableCell>
                                <TableCell className="text-right">P1745.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Alagbay, Naiah</TableCell>
                                <TableCell>July Installment</TableCell>
                                <TableCell>001101</TableCell>
                                <TableCell className="text-right">P1745.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Alagbay, Naiah</TableCell>
                                <TableCell>July Installment</TableCell>
                                <TableCell>001101</TableCell>
                                <TableCell className="text-right">P1745.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Alagbay, Naiah</TableCell>
                                <TableCell>July Installment</TableCell>
                                <TableCell>001101</TableCell>
                                <TableCell className="text-right">P1745.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* DCPR */}
                <div className="w-[30%] space-y-3">
                    <Label>DCPR</Label>
                    <div className="w-full h-100 bg-white p-2 shadow-md rounded-md">
                        <Button className="w-full bg-white text-foreground flex flex-col items-start py-10 hover:bg-gray-100/50 transition-transform hover:scale-102">
                            <p className="text-sm text-gray-600/80 font-normal">Aug 14, 2026 (Today)</p>
                            <p className="w-full text-2xl font-bold flex justify-around">P31,203.00</p>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}