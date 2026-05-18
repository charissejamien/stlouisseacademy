"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Layers, CalendarRange } from "lucide-react";

export default function AdminAcademics() {
  const colleges = [
    { code: "CCS", name: "College of Computer Studies", courses: 4, sections: 12 },
    { code: "COE", name: "College of Engineering", courses: 6, sections: 18 },
    { code: "CAS", name: "College of Arts & Sciences", courses: 5, sections: 10 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Foundations</h2>
          <p className="text-sm text-slate-500">Configure colleges, courses, structural schemas, and curriculum maps.</p>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 flex gap-1.5">
          <Plus className="w-4 h-4" /> Add Constituent College
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colleges.map((col) => (
          <Card key={col.code} className="bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700">
                {col.code}
              </div>
              <h3 className="font-bold text-slate-900 text-lg pt-2">{col.name}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{col.courses} Programs Offered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>{col.sections} Active Sections</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}