"use client";

import { useState } from "react";
import toast from "react-hot-toast"; 
import { InviteEmployee } from "@/app/(authentication)/actions";

export default function OpsEmployeesManagement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Tracks our email transmission state

  // Hardcoded mockup data to visualize the table styling instantly
  const mockEmployees = [
    {
      id: "1",
      employee_id: "E2026001",
      full_name: "Santos, Maria Clara Dela Cruz",
      role_title: "Registrar Officer",
      department: "Admissions & Records",
      email: "m.santos@personalmail.com",
      is_active: true,
    },
    {
      id: "2",
      employee_id: "E2026002",
      full_name: "Reyes, Juan Pablo Dimagiba",
      role_title: "SHS Math Instructor",
      department: "Academic Faculty",
      email: "juan.reyes@personalmail.com",
      is_active: true,
    }
  ];

  // 🛠️ The Core Handler Function linking the form to your InviteEmployee server action
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const toastId = toast.loading("Staging database profile & delivering invite node...");
    const formData = new FormData(event.currentTarget);

    // Pull string data values straight out of the form fields using their 'name' values
    const firstName = formData.get("first_name")?.toString() || "";
    const lastName = formData.get("last_name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const role = formData.get("role_title")?.toString() || "";
    
    const combinedFullName = `${firstName} ${lastName}`.trim();

    try {
      // Trigger your exact server action directly!
      const result = await InviteEmployee(email, combinedFullName, role);

      if (result.success) {
        toast.success(`Account provisioned! Invitation sent to ${email}`, { id: toastId });
        setIsModalOpen(false); // Close the modal sheet panel
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Registration transaction engine dropped.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Ops Control Console
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Ops Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage institutional personnel accounts, assignments, and structural clearance status.</p>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Register Employee
            </button>
          </div>
        </div>

        {/* Analytics Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300/60">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Force</span>
              <div className="text-3xl font-black text-slate-900">{mockEmployees.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300/60">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Faculty</span>
              <div className="text-3xl font-black text-blue-600">1</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174c-.053-.462.337-.874.8-.874h13.88c.463 0 .853.412.8.874A9.75 9.75 0 0 1 9.965 18.02a9.771 9.771 0 0 1-5.705-7.847ZM12 4.5v3.75m0 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300/60">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations & Support</span>
              <div className="text-3xl font-black text-indigo-600">1</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.754c-.309.233-.469.619-.416.997a4.89 4.89 0 0 1 0 .639c-.053.378.107.764.416.997l1.003.754a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 0-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.646-.87a6.538 6.538 0 0 1-.218-.127a1.125 1.125 0 0 0-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.43l1.003-.754c.31-.233.469-.62.416-.998a4.85 4.85 0 0 1 0-.639c.053-.377-.106-.763-.416-.997L3.623 11.3a1.125 1.125 0 0 1-.26-1.43l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124c.072-.044.146-.087.218-.128c.332-.183.582-.495.646-.869l.213-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employee Records Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Active Employee Records</h3>
          </div>
          <div className="overflow-x-auto">
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
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {mockEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-tight bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
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
                  &times;
                </button>
              </div>

              {/* Modal Form Scroll Area */}
              {/* Added the real onSubmit function to the form block 🚀 */}
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