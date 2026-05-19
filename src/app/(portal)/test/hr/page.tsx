"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminHR() {
  const faculty = [
    { name: "Dr. Alan Turing", dept: "Computer Science", status: "Full-Time", activeUnits: 18, maxUnits: 24 },
    { name: "Grace Hopper, MSc", dept: "Information Tech", status: "Full-Time", activeUnits: 21, maxUnits: 24 },
    { name: "Prof. Charles Babbage", dept: "Math & Analytics", status: "Part-Time", activeUnits: 9, maxUnits: 12 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Instructional Human Capital</h2>
          <p className="text-sm text-slate-500">Track contractual assignments, faculty deployment, and semester loading caps.</p>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 flex gap-1.5">
          <Plus className="w-4 h-4" /> Register Faculty Profile
        </Button>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="grid grid-cols-4 bg-slate-50 p-3 font-semibold text-slate-500 text-xs uppercase border-b">
          <span>Instructor Name</span>
          <span>Department Assignee</span>
          <span>Classification</span>
          <span className="text-right">Active Credit Load / Max Cap</span>
        </div>
        <div className="divide-y">
          {faculty.map((prof, idx) => (
            <div key={idx} className="grid grid-cols-4 items-center p-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border">
                  {prof.name.charAt(0)}
                </div>
                <span className="font-semibold text-slate-900">{prof.name}</span>
              </div>
              <span className="text-slate-600">{prof.dept}</span>
              <div>
                <Badge variant={prof.status === "Full-Time" ? "default" : "secondary"}>{prof.status}</Badge>
              </div>
              <div className="text-right font-mono font-bold text-slate-900">
                <span className={prof.activeUnits >= prof.maxUnits ? "text-rose-600" : "text-blue-600"}>
                  {prof.activeUnits}
                </span>
                <span className="text-slate-400 font-normal"> / {prof.maxUnits} Units</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}