"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Edit3, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminConfigPage() {
  // 1. Mock Data States
  const [activeTerm, setActiveTerm] = useState("term-1");
  const [terms, setTerms] = useState([
    { id: "term-1", sy: "2026-2027", semester: "Full Year", isActive: true },
    { id: "term-2", sy: "2025-2026", semester: "Full Year", isActive: false },
  ]);

  const [tuitionFees, setTuitionFees] = useState([
    { id: "1", grade: "Grade 7", base: 12000, misc: 3500, entrance: 2000, total: 17500 },
    { id: "2", grade: "Grade 8", base: 12000, misc: 3500, entrance: 2000, total: 17500 },
    { id: "3", grade: "Grade 9", base: 12500, misc: 3800, entrance: 2000, total: 18300 },
    { id: "4", grade: "Grade 10", base: 12500, misc: 3800, entrance: 2000, total: 18300 },
  ]);

  const [discounts, setDiscounts] = useState([
    { id: "d1", name: "ESC Grant", amount: 9000, type: "fixed", category: "Government" },
    { id: "d2", name: "Academic Scholar (Full)", amount: 100, type: "percentage", category: "Institutional" },
    { id: "d3", name: "Sibling Discount", amount: 10, type: "percentage", category: "Institutional" },
  ]);

  // Simple UI handlers
  const handleSaveNotify = (section: string) => {
    toast.success(`${section} configurations saved successfully!`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 text-slate-800">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-slate-500">Manage global settings, tuition fee structures, and active discount parameters.</p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-slate-100 p-1 rounded-md">
          <TabsTrigger value="terms" className="rounded-sm py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Academic Terms</TabsTrigger>
          <TabsTrigger value="tuition" className="rounded-sm py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Tuition Matrix</TabsTrigger>
          <TabsTrigger value="discounts" className="rounded-sm py-1.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Discounts & Grants</TabsTrigger>
        </TabsList>

        {/* ========================================================= */}
        {/* TAB 1: ACADEMIC TERMS (THE MASTER SWITCH) */}
        {/* ========================================================= */}
        <TabsContent value="terms" className="mt-4 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-semibold">School Year Management</h2>
                <p className="text-xs text-slate-500">Set the active tracking calendar for new student enrollments.</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex gap-1">
                <Plus className="w-4 h-4" /> Add New Term
              </Button>
            </div>

            <div className="space-y-3">
              {terms.map((t) => (
                <div key={t.id} className={`flex items-center justify-between p-4 border rounded-md transition-all ${t.isActive ? "border-blue-500 bg-blue-50/40" : "border-slate-200"}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">SY {t.sy}</p>
                      <p className="text-xs text-slate-500">{t.semester}</p>
                    </div>
                    {t.isActive && <Badge className="bg-blue-600 text-white text-xs">Active Term</Badge>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{t.isActive ? "System Locked to Term" : "Set Active"}</span>
                      <Switch 
                        checked={t.isActive} 
                        onCheckedChange={() => {
                          setTerms(terms.map(item => ({ ...item, isActive: item.id === t.id })));
                          toast.success(`Active term shifted to SY ${t.sy}`);
                        }}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" disabled={t.isActive}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2 text-amber-800 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <p><strong>Warning:</strong> Changing the active school year globally alters where structural data writes. Ensure current registration batch closures are finalized before swapping tags.</p>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 2: TUITION FEE MATRIX */}
        {/* ========================================================= */}
        <TabsContent value="tuition" className="mt-4 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-semibold">Grade Level Fee Architectures</h2>
                <p className="text-xs text-slate-500">Configure standardized line item templates for institutional ledger mappings.</p>
              </div>
              <Button onClick={() => handleSaveNotify("Tuition")} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white flex gap-1">
                <Save className="w-4 h-4" /> Save Fee Grid
              </Button>
            </div>

            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="p-3">Grade Level</th>
                    <th className="p-3">Base Tuition (₱)</th>
                    <th className="p-3">Miscellaneous (₱)</th>
                    <th className="p-3">Entrance Fee (₱)</th>
                    <th className="p-3 text-right">Computed Total (₱)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {tuitionFees.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-medium text-slate-900">{row.grade}</td>
                      <td className="p-3">
                        <Input 
                          type="number" 
                          className="h-8 w-32" 
                          value={row.base} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTuitionFees(tuitionFees.map(f => f.id === row.id ? { ...f, base: val, total: val + f.misc + f.entrance } : f));
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          type="number" 
                          className="h-8 w-32" 
                          value={row.misc} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTuitionFees(tuitionFees.map(f => f.id === row.id ? { ...f, misc: val, total: f.base + val + f.entrance } : f));
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          type="number" 
                          className="h-8 w-32" 
                          value={row.entrance} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTuitionFees(tuitionFees.map(f => f.id === row.id ? { ...f, entrance: val, total: f.base + f.misc + val } : f));
                          }}
                        />
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ₱{row.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* TAB 3: DISCOUNTS & SUBSIDIES */}
        {/* ========================================================= */}
        <TabsContent value="discounts" className="mt-4 space-y-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-lg font-semibold">Deduction Rules Configuration</h2>
                <p className="text-xs text-slate-500">Define operational subsidies, flat rates, and scholarship calculations.</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex gap-1">
                <Plus className="w-4 h-4" /> Create Discount Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discounts.map((d) => (
                <div key={d.id} className="p-4 border border-slate-200 rounded-md flex flex-col justify-between hover:shadow-sm transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{d.name}</h3>
                      <p className="text-xs text-slate-400 capitalize">{d.category} Allocation</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {d.type === "fixed" ? "Fixed Value Subvention" : "Percentage Variable"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-dashed">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500">Rate Parameter:</span>
                      <span className="text-lg font-bold text-slate-900">
                        {d.type === "fixed" ? `₱${d.amount.toLocaleString()}` : `${d.amount}%`}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-100">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}