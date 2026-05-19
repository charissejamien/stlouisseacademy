"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Wallet, 
  Users2, 
  BarChart3, 
  Settings, 
  GraduationCap 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/test/dashboard", icon: LayoutDashboard },
    { name: "Academic Setup", href: "/test/academics", icon: BookOpen },
    { name: "Financial Control", href: "/test/finance", icon: Wallet },
    { name: "Human Resources", href: "/test/hr", icon: Users2 },
    { name: "System Settings", href: "/test/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-sm leading-tight">SLA University</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">ADMIN CONSOLE</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area Container */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900">Administrator Account</p>
              <p className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Super Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}