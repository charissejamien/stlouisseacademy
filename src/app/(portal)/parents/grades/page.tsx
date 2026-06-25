"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ParentGrades() {
  const grades = [
    { code: "MATH101", name: "Advanced Mathematics", q1: 89, q2: 92, remarks: "PASSED" },
    { code: "SCI202", name: "Integrated Biological Sciences", q1: 91, q2: 90, remarks: "PASSED" },
    { code: "ENG303", name: "English Composition & Literature", q1: 94, q2: 95, remarks: "PASSED" },
    { code: "FIL404", name: "Komunikasyon sa Akademikong Filipino", q1: 88, q2: 89, remarks: "PASSED" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Report Card Matrix</h2>
        <p className="text-xs text-slate-500">Quarterly performance ratings validated by assigned department faculty advisers.</p>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="grid grid-cols-5 bg-slate-50 p-3 font-semibold text-slate-500 text-xs uppercase border-b tracking-wider">
          <span>Subject Code</span>
          <span className="col-span-2">Descriptive Title</span>
          <span className="text-center">1st Qtr</span>
          <span className="text-center">2nd Qtr</span>
        </div>
        <div className="divide-y divide-slate-100">
          {grades.map((subject, idx) => (
            <div key={idx} className="grid grid-cols-5 items-center p-4 hover:bg-slate-50/50 transition-colors">
              <span className="font-mono text-xs font-semibold text-slate-500">{subject.code}</span>
              <span className="col-span-2 font-medium text-slate-900">{subject.name}</span>
              <span className="text-center font-mono font-bold text-slate-800">{subject.q1}</span>
              <span className="text-center font-mono font-bold text-slate-800">{subject.q2}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}