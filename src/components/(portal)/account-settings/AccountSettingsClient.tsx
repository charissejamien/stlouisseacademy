"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserAccountProfile } from "@/app/(portal)/account-settings/actions";
import { logout } from "@/app/(authentication)/login/actions";
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Lock, 
  HelpCircle, 
  Info, 
  LogOut, 
  Phone, 
  Mail,
  ChevronRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettingsClient() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user-account-profile"],
    queryFn: getUserAccountProfile,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pt-6 h-full flex flex-col justify-center items-center">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col items-center space-y-3 py-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 max-w-md mx-auto mt-6 text-center">
        <p className="font-semibold text-red-700">Failed to load account settings.</p>
        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error ? error.message : "Something went wrong."}
        </p>
      </div>
    );
  }

  const fullName = [
    user?.first_name,
    user?.middle_name ? user.middle_name : "",
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6 pt-2 pb-6 md:px-8 overflow-y-auto">
      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 shrink-0">Settings</h1>

      {/* Profile Header Section */}
      <div className="flex flex-col items-center text-center py-2 shrink-0">
        {/* Circular Avatar */}
        <div className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm border-2 border-white">
          <User size={38} strokeWidth={1.7} />
        </div>

        {/* Full Name */}
        <h2 className="mt-3 text-lg font-bold text-slate-900">
          {fullName}
        </h2>

        {/* Email */}
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <Mail size={13} className="text-slate-400" />
          {user?.email}
        </p>

        {/* Contact Number */}
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <Phone size={12} className="text-slate-400" />
          {user?.contact_number || "No contact number provided"}
        </p>
      </div>

      {/* Settings Options Container */}
      <div className="space-y-6 pb-4">
        {/* General Section */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            General
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Role Item */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">Role</p>
                  <p className="text-xs text-indigo-600 font-medium capitalize mt-0.5">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <button 
              type="button" 
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50/85 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FileText size={18} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-slate-800">Terms of Service</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            {/* Privacy Policy */}
            <button 
              type="button" 
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50/85 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Lock size={18} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-slate-800">Privacy Policy</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Other Section */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Other
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Help Center */}
            <button 
              type="button" 
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50/85 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <HelpCircle size={18} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-slate-800">Help Center</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            {/* About Us */}
            <button 
              type="button" 
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:bg-slate-50/85 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Info size={18} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-slate-800">About Us</span>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>

            {/* Log Out */}
            <div className="md:col-span-2">
              <form action={logout}>
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-100 shadow-2xs hover:bg-rose-50/40 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
                      <LogOut size={18} strokeWidth={1.8} />
                    </div>
                    <span className="text-xs font-semibold text-rose-600">Log Out</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}