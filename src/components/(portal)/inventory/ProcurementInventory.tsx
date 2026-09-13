import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProcurementInventory() {
  return (
    <div className="space-y-5 bg-white p-5 rounded-md">
      <div className="flex justify-between">
        <h2 className="font-semibold">Procurement Inventory</h2>
        <div className="w-[30%] flex space-x-5">
          <Input placeholder="Search item..." />
          <Button>Add Procurement</Button>
        </div>
      </div>

      <Table className="bg-gray-100/40">
        <TableHeader>
          <TableRow className="bg-gray-200 hover:bg-gray-200">
            <TableHead className="w-[250px]">Item</TableHead>
            <TableHead className="w-[250px]">Department</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">Date Procured</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Receipt</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Computer</TableCell>
            <TableCell>Computer Laboratory</TableCell>
            <TableCell className="text-center">10</TableCell>
            <TableCell className="text-center">Sep 7, 2026</TableCell>
            <TableCell className="text-center">P20,000</TableCell>
            <TableCell className="text-center">
              <Button>View</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
