"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  getEmployeesDirectory, 
  onboardEmployee, 
  OnboardEmployeePayload, 
  EmployeeRegistryRow, 
  OnboardResponse,
  EmployeeAssignment
} from "./actions";

export default function EmployeesDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // 1. READ: Fetch directory records via server action reference
  const { data: employeesData = [], isLoading } = useQuery<EmployeeRegistryRow[], Error>({
    queryKey: ["employees-directory"],
    queryFn: getEmployeesDirectory,
  });

  // 2. WRITE: Onboarding transaction management with toast cleanup lifecycles
  const onboardingMutation = useMutation<OnboardResponse, Error, OnboardEmployeePayload>({
    mutationFn: onboardEmployee,
    onMutate: () => {
      return toast.loading("Executing strategic system registration...");
    },
    onSuccess: () => {
      toast.success("Employee onboarded! Sequence");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employees-directory"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // 3. Complete Modal Close State Eraser
  const handleCloseModal = () => {
    setIsModalOpen(false);
    toast.dismiss();            // Immediately drops any hung or orphaned loading spinners
    onboardingMutation.reset(); // Erases past error trace states from memory context
  };

  // 4. Compute Dashboard Statistics
  const stats = useMemo(() => {
    const total = employeesData.length;
    const teachers = employeesData.filter((emp: EmployeeRegistryRow) =>
      emp.employee_assignments?.some((assign) =>
        assign.role_title?.toLowerCase().includes("teacher") ||
        assign.role_title?.toLowerCase().includes("instructor") ||
        assign.department?.toLowerCase().includes("academic")
      )
    ).length;

    return { total, teachers, staff: total - teachers };
  }, [employeesData]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const getStringValue = (key: string): string => {
      const val = formData.get(key);
      return val ? val.toString() : "";
    };

    const getOptionalStringValue = (key: string): string | null => {
      const val = formData.get(key);
      return val && val.toString().trim() !== "" ? val.toString() : null;
    };

    const payload: OnboardEmployeePayload = {
      employeeData: {
        first_name: getStringValue("first_name"),
        middle_name: getOptionalStringValue("middle_name"),
        last_name: getStringValue("last_name"),
        email: getStringValue("email"),
        contact_number: getStringValue("contact_number"),
        gender: getStringValue("gender"),
        date_of_birth: getStringValue("date_of_birth"),
        sss_number: getOptionalStringValue("sss_number"),
        philhealth_number: getOptionalStringValue("philhealth_number"),
        pagibig_number: getOptionalStringValue("pagibig_number"),
        tin_number: getOptionalStringValue("tin_number"),
      },
      assignmentData: {
        role_title: getStringValue("role_title"),
        department: getStringValue("department"),
        contract_start_year: getStringValue("contract_start_year"),
        contract_end_year: getStringValue("contract_end_year"),
        employment_status: getStringValue("employment_status"),
      },
    };

    onboardingMutation.mutate(payload);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 my-6 space-y-8">
      {/* Top Controls Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Employees Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage corporate payroll assignments and foundational system access.</p>
        </div>
        <button
          onClick={() => {
            onboardingMutation.reset();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Register Employee
        </button>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Registered Force</span>
          <span className="text-4xl font-extrabold text-gray-900 mt-2">{stats.total}</span>
          <span className="text-xs text-green-600 mt-2 font-medium">● System-wide Headcount Active</span>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Academic Teachers / Instructors</span>
          <span className="text-4xl font-extrabold text-blue-600 mt-2">{stats.teachers}</span>
          <span className="text-xs text-gray-400 mt-2">Classroom Assignment Ready</span>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Administrative & Support Staff</span>
          <span className="text-4xl font-extrabold text-indigo-600 mt-2">{stats.staff}</span>
          <span className="text-xs text-gray-400 mt-2">Operations, Facilities, and IT Roles</span>
        </div>
      </div>

      {/* Registry Database Display Grid */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50/70">
          <h3 className="font-semibold text-gray-800">Complete Institutional Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">ID Sequence</th>
                <th className="px-6 py-3.5">Full Name</th>
                <th className="px-6 py-3.5">Designated Role</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Contact Email</th>
                <th className="px-6 py-3.5">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">
                    Querying active directory ledger matrix...
                  </td>
                </tr>
              ) : employeesData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">
                    No records found inside the database directory.
                  </td>
                </tr>
              ) : (
                employeesData.map((emp: EmployeeRegistryRow) => {
                  const details: EmployeeAssignment = emp.employee_assignments?.[0] || {
                    role_title: "Unassigned",
                    department: "N/A",
                    employment_status: null
                  };
                  
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">{emp.employee_id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{`${emp.last_name}, ${emp.first_name} ${emp.middle_name || ""}`}</td>
                      <td className="px-6 py-4 text-gray-600">{details.role_title || "Unassigned"}</td>
                      <td className="px-6 py-4 text-gray-600">{details.department || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-500">{emp.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {emp.is_active ? "Active Duty" : "Separated"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-In Modal Form Container Sheets */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Initialize Strategic Employee Setup</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl font-light">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
              {/* Section 1: Basic Identity */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-2">1. Identity & Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Institutional Email *</label>
                    <input type="email" name="email" required className="mt-1 w-full border rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" placeholder="username@school.edu" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Contact Number *</label>
                    <input type="text" name="contact_number" required className="mt-1 w-full border rounded p-2 text-sm" placeholder="09xxxxxxxxx" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Gender Identity *</label>
                    <select name="gender" required className="mt-1 w-full border rounded p-2 text-sm">
                      <option value="">Select Option</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">First Name *</label>
                    <input type="text" name="first_name" required className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Middle Name</label>
                    <input type="text" name="middle_name" className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Last Name *</label>
                    <input type="text" name="last_name" required className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Date of Birth *</label>
                    <input type="date" name="date_of_birth" required className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Section 2: Government Contributions */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-2">2. Statutory Identifiers (PH Government Compliance)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">SSS ID Line</label>
                    <input type="text" name="sss_number" className="mt-1 w-full border rounded p-2 text-sm" placeholder="XX-XXXXXXX-X" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">PhilHealth ID Line</label>
                    <input type="text" name="philhealth_number" className="mt-1 w-full border rounded p-2 text-sm" placeholder="XX-XXXXXXXXX-X" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Pag-IBIG MID</label>
                    <input type="text" name="pagibig_number" className="mt-1 w-full border rounded p-2 text-sm" placeholder="XXXX-XXXX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Tax TIN Line</label>
                    <input type="text" name="tin_number" className="mt-1 w-full border rounded p-2 text-sm" placeholder="XXX-XXX-XXX-XXX" />
                  </div>
                </div>
              </div>

              {/* Section 3: Institutional Tracking and Year Ranges */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-2">3. Institutional Department & Contract Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Functional Role Title *</label>
                    <input type="text" name="role_title" placeholder="e.g. Registrar Officer, Instructor" required className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Assigned Department Cluster *</label>
                    <input type="text" name="department" placeholder="e.g. Academic Faculty, IT Operations" required className="mt-1 w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Employment Status Class *</label>
                    <select name="employment_status" required className="mt-1 w-full border rounded p-2 text-sm">
                      <option value="Regular Full-time">Regular Full-time</option>
                      <option value="Part-time">Part-time Pro-rata</option>
                      <option value="Probationary">Probationary Track</option>
                      <option value="Contractual">Contractual / Project-Based</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Contract Start Year *</label>
                    <input 
                      type="number" 
                      name="contract_start_year" 
                      min="2000" 
                      max="2100" 
                      defaultValue={new Date().getFullYear()} 
                      required 
                      className="mt-1 w-full border rounded p-2 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Contract End Year *</label>
                    <input 
                      type="number" 
                      name="contract_end_year" 
                      min="2000" 
                      max="2100" 
                      defaultValue={new Date().getFullYear() + 1} 
                      required 
                      className="mt-1 w-full border rounded p-2 text-sm" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Operations Toolbar */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={onboardingMutation.isPending}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${onboardingMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {onboardingMutation.isPending ? "Saving..." : "Commit Onboarding Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}