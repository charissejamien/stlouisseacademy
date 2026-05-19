"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Users, GraduationCap, Banknote, History } from "lucide-react";

export default function AdminDashboard() {
  const analytics = [
    { name: "Total Enrolled", value: "14,832", change: "+4.2%", desc: "Active term student count", icon: Users, color: "text-blue-600 bg-blue-50" },
    { name: "Gross Revenue Collected", value: "₱42.8M", change: "+12.1%", desc: "Tuition & misc collection", icon: Banknote, color: "text-emerald-600 bg-emerald-50" },
    { name: "Active Curriculum Programs", value: "32 Degrees", change: "0 New", desc: "Across 5 constituent colleges", icon: GraduationCap, color: "text-purple-600 bg-purple-50" },
  ];

  const logs = [
    { id: 1, user: "m.santos@sla.edu.ph", role: "Registrar", action: "STUDENT_ENROLLED", target: "Student ID: 2026-0412", time: "3 mins ago" },
    { id: 2, user: "admin_pete@sla.edu.ph", role: "Admin", action: "DISCOUNT_EDITED", target: "ESC Grant Param -> ₱9,500", time: "14 mins ago" },
    { id: 3, user: "c.delacruz@sla.edu.ph", role: "Cashier", action: "PAYMENT_POSTED", target: "OR-2026-9912 (₱15,000.00)", time: "1 hr ago" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Institutional Overview</h2>
        <p className="text-sm text-slate-500">Real-time status tracking matrices for active school cycles.</p>
      </div>

      {/* Metric Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics.map((metric, i) => (
          <Card key={i} className="p-6 bg-white border border-slate-200 shadow-sm flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{metric.name}</span>
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-xs text-slate-500">{metric.desc}</p>
            </div>
            <div className={`p-3 rounded-lg ${metric.color}`}>
              <metric.icon className="w-5 h-5" />
            </div>
          </Card>
        ))}
      </div>

      {/* System Audit Activity Block */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <History className="w-5 h-5 text-slate-400" />
          <div>
            <h3 className="font-bold text-slate-900">System Activity Audit Trail</h3>
            <p className="text-xs text-slate-500">Cross-department operations recorded in the active instance session.</p>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between text-sm first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{log.user}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 py-px bg-slate-50 uppercase tracking-wide text-slate-500">{log.role}</Badge>
                </div>
                <p className="text-slate-600 text-xs">{log.description || `Executed action: ${log.action} on ${log.target}`}</p>
              </div>
              <span className="text-xs text-slate-400 font-medium">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}