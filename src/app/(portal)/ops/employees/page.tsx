"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; 
import { Users, UserCheck, Settings, Plus, X } from "lucide-react";
import { InviteEmployee, getEmployees } from "./actions";

export default function OpsEmployeesManagement() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  const totalEmployees = employees.length;
  const facultyCount = employees.filter(e => e.department === "Academic Faculty").length;
  const supportCount = totalEmployees - facultyCount;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const toastId = toast.loading("Loading");
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const firstName = formData.get("first_name")?.toString() || "";
    const lastName = formData.get("last_name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const role = formData.get("role_title")?.toString() || "";
    
    const combinedFullName = `${firstName} ${lastName}`.trim();

    try {
      const result = await InviteEmployee(email, combinedFullName, role);

      if (result.success) {
        toast.success(`Invitation sent to ${email}`, { id: toastId });
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        formElement.reset();
        setIsModalOpen(false); 
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Registration failed.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="w-[90%] max-w-5xl mx-auto my-10 text-center p-12 border border-dashed rounded-xl bg-rose-50/50 text-rose-700 font-medium">
        <p>Failed to clear systemic query synchronizations: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 p-6 lg:p-10 font-sans w-full">
      <div className="max-w-7xl mx-auto space-y-10 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6 w-full">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Employees Master List</h1>
            <p className="text-sm text-slate-500 mt-1">Manage institutional personnel accounts, assignments, and structural clearance status.</p>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-medium text-sm px-5 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Employee</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary Grid - Fully Width Preserved via Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between w-full">
            <div className="space-y-2 flex-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Active Force</span>
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-black text-slate-900">{totalEmployees}</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between w-full">
            <div className="space-y-2 flex-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Academic Faculty</span>
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-black text-blue-600">{facultyCount}</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between w-full">
            <div className="space-y-2 flex-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Operations & Support</span>
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-black text-indigo-600">{supportCount}</div>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Settings className="w-6 h-6 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Employee Records Table - Size preserved completely across full container layout */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Active Employee Records</h3>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Functional Role</th>
                  <th className="px-6 py-4">Department Cluster</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">System Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 w-full">
                {isLoading ? (
                  // Generates an array of full-width rows to mirror actual structured layout parameters smoothly
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="w-full">
                      <td className="px-6 py-5"><div className="h-4 w-16 bg-slate-100 animate-pulse rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 w-40 bg-slate-100 animate-pulse rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 w-28 bg-slate-100 animate-pulse rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 w-32 bg-slate-100 animate-pulse rounded" /></td>
                      <td className="px-6 py-5"><div className="h-4 w-48 bg-slate-100 animate-pulse rounded" /></td>
                      <td className="px-6 py-5 text-right"><div className="h-5 w-16 bg-slate-100 animate-pulse rounded-full ml-auto" /></td>
                    </tr>
                  ))
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => router.push(`/ops/employees/${emp.id}`)}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs tracking-tight">{emp.employee_id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{emp.full_name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center bg-slate-50 text-slate-700 border border-slate-200/50 px-2 py-0.5 rounded-md text-xs font-medium">
                          {emp.role_title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{emp.department}</td>
                      <td className="px-6 py-4 text-slate-400 font-normal">{emp.email}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-tight ${
                          emp.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {emp.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 italic">
                      No matching employee files found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Overlay Sheet */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col my-auto max-h-[90vh] border border-slate-200/50">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Onboard Strategic Staff Account</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Initialize profile records and assign standard operational access tiers.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-slate-600 text-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Scroll Area */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
                {/* Identity Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">1. Identity Base Mapping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">First Name *</label>
                      <input type="text" name="first_name" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Middle Name</label>
                      <input type="text" name="middle_name" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Last Name *</label>
                      <input type="text" name="last_name" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Contact Email Identifier *</label>
                      <input type="email" name="email" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" placeholder="personal-or-assigned@mail.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Contact Number Link *</label>
                      <input type="text" name="contact_number" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" placeholder="09xxxxxxxxx" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Gender Allocation *</label>
                      <select name="gender" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:border-slate-400 focus:ring-0 outline-none transition-colors">
                        <option value="">Select Option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Date of Birth *</label>
                      <input type="date" name="date_of_birth" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Statutory Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">2. Statutory Identifiers (PH Compliance)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">SSS ID Line</label>
                      <input type="text" name="sss_number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" placeholder="XX-XXXXXXX-X" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">PhilHealth ID Line</label>
                      <input type="text" name="philhealth_number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" placeholder="XX-XXXXXXXXX-X" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Pag-IBIG MID</label>
                      <input type="text" name="pagibig_number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" placeholder="XXXX-XXXX-XXXX" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Tax TIN Line</label>
                      <input type="text" name="tin_number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" placeholder="XXX-XXX-XXX-XXX" />
                    </div>
                  </div>
                </div>

                {/* Contract Block */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">3. Contract Assignment & Track</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Functional Role Title *</label>
                      <input type="text" name="role_title" placeholder="e.g. Registrar Officer, Instructor" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Assigned Department Cluster *</label>
                      <input type="text" name="department" placeholder="e.g. Academic Faculty, IT Operations" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Employment Status Class *</label>
                      <select name="employment_status" required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:border-slate-400 focus:ring-0 outline-none">
                        <option value="Regular Full-time">Regular Full-time</option>
                        <option value="Part-time">Part-time Pro-rata</option>
                        <option value="Probationary">Probationary Track</option>
                        <option value="Contractual">Contractual / Project-Based</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Contract Start Year *</label>
                      <input type="number" name="contract_start_year" min="2000" max="2100" defaultValue={new Date().getFullYear()} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Contract End Year *</label>
                      <input type="number" name="contract_end_year" min="2000" max="2100" defaultValue={new Date().getFullYear() + 1} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-400 focus:ring-0 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Form Action Controls Footer */}
                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 bg-white sticky bottom-0">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all ${
                      isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitting ? "Inviting User..." : "Commit Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}