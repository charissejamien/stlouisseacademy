"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function MerchandiseInventory() {
  return (
    <div className="space-y-3 bg-white p-5 rounded-md">
      <div className="flex justify-between">
        <h2 className="font-semibold">Merchandise Inventory</h2>
        <div>
          <Button>Add Merchandise</Button>
        </div>
      </div>

      <Table className="bg-gray-100/40">
        <Tabs defaultValue="shirt">
          <TabsList>
            <TabsTrigger value="shirt">PE Shirt</TabsTrigger>
            <TabsTrigger value="pants">PE Pants</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>

          <TabsContent value="shirt">
            <Table className="bg-gray-100/40 w-fit">
              <TableHeader>
                <TableRow className="bg-gray-200 hover:bg-gray-200">
                  <TableHead className="w-[250px]">Size</TableHead>
                  <TableHead className="w-[250px]">Amount</TableHead>
                  <TableHead className="text-center">Stocks</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Computer</TableCell>
                  <TableCell>Computer Laboratory</TableCell>
                  <TableCell className="text-center">10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="pants">
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
          </TabsContent>

          <TabsContent value="others">
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
          </TabsContent>
        </Tabs>
      </Table>
    </div>
  );
}
