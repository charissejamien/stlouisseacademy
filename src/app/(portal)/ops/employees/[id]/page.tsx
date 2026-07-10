"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Briefcase, Landmark, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LinkRFIDDialog from "@/components/shared/LinkRFID";
import ProfileUpload from "@/components/shared/UploadProfile";

import { getEmployeeProfile, assignEmployeeRFID, uploadEmployeeAvatar } from "./actions";

export default function EmployeeProfileView() {
  const params = useParams();
  const router = useRouter();
  const employeeIdUUID = params?.id as string;

  const [isRFIDOpen, setIsRFIDOpen] = useState(false);

  const { data: emp, isLoading, error, refetch } = useQuery({
    queryKey: ["employeeProfile", employeeIdUUID],
    queryFn: () => getEmployeeProfile(employeeIdUUID),
    enabled: !!employeeIdUUID,
  });

  if (error) {
    return (
      <div className="w-[90%] max-w-5xl mx-auto my-10 text-center p-12 border border-dashed rounded-xl bg-rose-50/50 text-rose-700 font-medium">
        <p>Failed to load employee identity records.</p>
        <Button onClick={() => router.back()} size="sm" variant="outline" className="mt-4 bg-white text-rose-700">Go Back</Button>
      </div>
    );
  }

  const fullNameString = emp ? `${emp.last_name}, ${emp.first_name}` : "";

  return (
    <div className="w-[90%] max-w-5xl mx-auto my-10 flex flex-col gap-6 antialiased text-slate-900 font-sans">
      <div>
        <Button onClick={() => router.back()} variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 px-0">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Staff Directory</span>
        </Button>
      </div>

      {/* Profile Overview Card */}
      <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-slate-100 w-full">
          
          {/* Avatar Area Box */}
          <div className="p-8 flex flex-col items-center justify-center bg-slate-50/40 text-center min-w-[240px]">
            {isLoading ? (
              <div className="w-32 h-32 rounded-full bg-slate-200 animate-pulse" />
            ) : (
              <ProfileUpload 
                currentImageUrl={emp?.profile}
                onUploadComplete={() => refetch()}
                uploadAction={(formData) => uploadEmployeeAvatar(emp!.id, formData)}
              />
            )}

            {isLoading ? (
              <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mt-5" />
            ) : (
              <>
                <span className="text-xs font-mono font-bold text-slate-900 mt-4 tracking-wider">ID: {emp?.employee_id}</span>
                <span className="mt-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px] rounded-md uppercase tracking-wider">
                  {emp?.employment_status || "Active"}
                </span>
              </>
            )}
          </div>

          {/* Details Content Box - Extended to Full Width */}
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6 w-full">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full">
              <div className="flex-1 w-full space-y-3">
                <span className="text-xs font-bold uppercase text-slate-400">Employee Profile</span>
                {isLoading ? (
                  <>
                    <div className="h-8 w-full max-w-md bg-slate-200 animate-pulse rounded" />
                    <div className="h-4 w-full max-w-sm bg-slate-200 animate-pulse rounded" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">{fullNameString}</h2>
                    <p className="text-sm font-semibold text-blue-600 mt-1">{emp?.role_title} • <span className="text-slate-500 font-normal">{emp?.department}</span></p>
                  </>
                )}
              </div>

              {!isLoading && emp && (
                <Button 
                  onClick={() => setIsRFIDOpen(true)}
                  variant="outline" 
                  size="sm" 
                  className="text-xs font-bold text-slate-700 border-slate-200 flex items-center gap-1.5 px-3 h-9 rounded-xl shadow-xs"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>{emp.rfid_tag ? "Change RFID Card" : "Link RFID Card"}</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-xs text-slate-600 w-full">
              {isLoading ? (
                <>
                  <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
                  <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
                  <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-slate-400" /><span>{emp?.email}</span></div>
                  <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-slate-400" /><span>{emp?.contact_number || "No Contact Number"}</span></div>
                  <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-slate-400" /><span>Birthdate: {emp?.date_of_birth || "Unset"}</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Meta Information Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
        
        {/* Statutory Identifiers */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="border-b pb-4 bg-slate-50/20">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-slate-400" />
              <span>Government Compliance IDs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3.5 text-xs">
            {isLoading ? (
              <div className="space-y-3 py-2 w-full">
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">SSS Number:</span>
                  <span className="font-mono font-bold text-slate-800">{emp?.sss_number || "Not Provided"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">PhilHealth ID:</span>
                  <span className="font-mono font-bold text-slate-800">{emp?.philhealth_number || "Not Provided"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Pag-IBIG MID:</span>
                  <span className="font-mono font-bold text-slate-800">{emp?.pagibig_number || "Not Provided"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">TIN Number:</span>
                  <span className="font-mono font-bold text-slate-800">{emp?.tin_number || "Not Provided"}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contract Assignment details */}
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="border-b pb-4 bg-slate-50/20">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Employment Contract</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3.5 text-xs">
            {isLoading ? (
              <div className="space-y-3 py-2 w-full">
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Contract Duration:</span>
                  <span className="font-semibold text-slate-800">
                    {emp?.contract_start_date || "N/A"} to {emp?.contract_end_date || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Contract Length:</span>
                  <span className="font-semibold text-slate-800">{emp?.contract_length_months ? `${emp?.contract_length_months} Months` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Linked RFID Tag:</span>
                  <span className={`font-mono font-bold ${emp?.rfid_tag ? "text-emerald-600" : "text-amber-600"}`}>
                    {emp?.rfid_tag ? emp?.rfid_tag : "No Registered Card"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RFID Dialog Integration */}
      {!isLoading && emp && (
        <LinkRFIDDialog 
          isOpen={isRFIDOpen}
          onClose={() => setIsRFIDOpen(false)}
          entity={{
            id: emp.id,
            full_name: `${emp.first_name} ${emp.last_name}`,
            display_id: emp.employee_id
          }}
          assignAction={assignEmployeeRFID}
          queryKeyToInvalidate="employeeProfile"
        />
      )}
    </div>
  );
}