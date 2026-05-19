"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Server, ToggleLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Controls & Parameters</h2>
        <p className="text-sm text-slate-500">Configure global application constraints, security privileges, and execution contexts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Server className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-900">Global System Interceptors</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900">System Enrollment Freeze</p>
                <p className="text-xs text-slate-400">Instantly drops all writing streams for open registration modules.</p>
              </div>
              <Switch onCheckedChange={(checked) => {
                if(checked) toast("Global Write Interceptor Activated", { icon: '⚠️' });
              }} />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900">Enforce Hard Sibling Validation</p>
                <p className="text-xs text-slate-400">Requires matching family ledger mappings before discounts render.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="bg-amber-50 border border-amber-200 p-6 flex flex-col justify-between space-y-4 h-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <ShieldAlert className="w-5 h-5" />
              <h3>Root Infrastructure Warning</h3>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Modifying variables within this layout context re-keys core components of your database tables in Supabase. Ensure proper backup measures are configured before executing operational mutations or swapping structural keys.
            </p>
          </div>
          <Button variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100/50 w-full text-xs font-semibold">
            Review System Intercept Logs
          </Button>
        </Card>
      </div>
    </div>
  );
}