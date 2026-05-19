"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Banknote, Percent, Layers3 } from "lucide-react";

export default function AdminFinance() {
  const standardFees = [
    { grade: "First Year College", tuitionPerUnit: 850, misc: 4500, laboratory: 3000 },
    { grade: "Second Year College", tuitionPerUnit: 850, misc: 4500, laboratory: 3500 },
    { grade: "Third Year College", tuitionPerUnit: 900, misc: 5000, laboratory: 4000 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Matrix Control</h2>
          <p className="text-sm text-slate-500">Configure itemized unit rates, institutional miscellaneous fees, and billing blocks.</p>
        </div>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700 flex gap-1.5">
          <Save className="w-4 h-4" /> Save Financial Matrices
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-900">Program Tuition Mapping Structure</h3>
          </div>
          
          <div className="border rounded-md overflow-hidden text-sm">
            <div className="grid grid-cols-4 bg-slate-50 p-3 font-semibold text-slate-500 text-xs uppercase border-b">
              <span>Classification</span>
              <span>Rate / Credit Unit</span>
              <span>Misc Fees</span>
              <span>Lab Allocations</span>
            </div>
            <div className="divide-y">
              {standardFees.map((fee, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center p-3 gap-4">
                  <span className="font-medium text-slate-900">{fee.grade}</span>
                  <Input type="number" className="h-8" defaultValue={fee.tuitionPerUnit} />
                  <Input type="number" className="h-8" defaultValue={fee.misc} />
                  <Input type="number" className="h-8" defaultValue={fee.laboratory} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* Quick Stats Sidebar Widgets */}
          <Card className="bg-white border border-slate-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Percent className="w-4 h-4 text-slate-400" />
              <h3>Scholarship Deductions</h3>
            </div>
            <p className="text-xs text-slate-400">Current running system parameters for automated deductions.</p>
            <div className="space-y-2 pt-2 text-xs font-medium">
              <div className="flex justify-between p-2 bg-slate-50 border rounded">
                <span>Academic Full Scholar</span>
                <span className="text-emerald-600 font-bold">100% Base</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 border rounded">
                <span>Sibling Discount</span>
                <span className="text-emerald-600 font-bold">10% Total</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}