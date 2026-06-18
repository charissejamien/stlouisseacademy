"use client";

import React, { useState } from "react";
import { 
    Search, 
    UserPlus, 
    Mail, 
    Phone, 
    Users, 
    CreditCard, 
    CheckCircle2, 
    Clock, 
    Send, 
    MoreVertical,
    Download,
    Filter,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data matching your schema and accounting logic
const mockParents = [
    { id: "PRN-4410", name: "Naiah Macasero", email: "naiah.macasero@gmail.com", phone: "09171234567", siblingsCount: 1, totalAssessed: 45000, paid: 45000, status: "Active" },
    { id: "PRN-4411", name: "Michael Santos", email: "m.santos@outlook.com", phone: "09189876543", siblingsCount: 2, totalAssessed: 90000, paid: 31000, status: "Active" },
    { id: "PRN-4412", name: "Sarah Joaquin", email: "sarah_j2026@yahoo.com", phone: "09224445555", siblingsCount: 1, totalAssessed: 38000, paid: 6200, status: "Invited" },
    { id: "PRN-4413", name: "Robert Chen", email: "robert.chen@techcorp.ph", phone: "09156667777", siblingsCount: 1, totalAssessed: 52000, paid: 4500, status: "Invited" },
    { id: "PRN-4414", name: "Maria Gonzales", email: "maria.g@unicef.org", phone: "09081112222", siblingsCount: 3, totalAssessed: 134000, paid: 134000, status: "Active" },
    { id: "PRN-4415", name: "David Tecson", email: "dtecson.builds@gmail.com", phone: "09953334444", siblingsCount: 1, totalAssessed: 41000, paid: 41000, status: "Active" },
];

export default function ParentDirectoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");

    // Modal state simulation
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form inputs simulation
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const filteredParents = mockParents.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "All Statuses" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="w-[95%] max-w-(screen-2xl) mx-auto my-10 flex flex-col gap-8 antialiased relative">
            
            {/* Header Block */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                        Sponsor Profile Vault
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
                        Parent & Sponsor Directory
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage household accounts, send portal invitation links, and review consolidated billing metrics.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-xs font-semibold flex items-center gap-2 h-10 border-slate-200">
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>Export Billing Map</span>
                    </Button>
                    <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 h-10 shadow-xs"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add & Invite Parent</span>
                    </Button>
                </div>
            </div>

            {/* Metric Analytics Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Households</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">86 Accounts</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portal Active Status</p>
                            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">62 Registered</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xs border-slate-100 bg-white">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Invites Sent</p>
                            <h3 className="text-2xl font-black text-amber-700 mt-0.5">24 Awaiting</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Controls Toolbar */}
            <Card className="shadow-xs border-slate-200 bg-slate-50/50 p-4 rounded-xl border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input 
                            placeholder="Search Parent Name, Email, Phone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 text-xs bg-white border-slate-200 shadow-xs w-full"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-white border-slate-200 h-10 text-xs text-slate-700 shadow-xs w-full sm:w-48">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-slate-400" />
                                <SelectValue placeholder="Filter Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All Statuses" className="text-xs">All Statuses</SelectItem>
                            <SelectItem value="Active" className="text-xs">Active Portal</SelectItem>
                            <SelectItem value="Invited" className="text-xs">Pending Invite</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Master Vault Directory Table Grid */}
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3.5 px-6">Account ID</th>
                                <th className="py-3.5 px-6">Sponsor / Parent Name</th>
                                <th className="py-3.5 px-6">Email Address</th>
                                <th className="py-3.5 px-6">Contact Number</th>
                                <th className="py-3.5 px-6 text-center">Dependents</th>
                                <th className="py-3.5 px-6 text-right">Total Financial Obligation</th>
                                <th className="py-3.5 px-6 text-right">Amount Settled</th>
                                <th className="py-3.5 px-6 text-center">Portal Sync</th>
                                <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {filteredParents.map((parent, idx) => {
                                const balanceRemaining = parent.totalAssessed - parent.paid;
                                return (
                                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors cursor-pointer">
                                        <td className="py-4 px-6 font-mono font-bold text-slate-900">{parent.id}</td>
                                        <td className="py-4 px-6 font-bold text-slate-900">{parent.name}</td>
                                        <td className="py-4 px-6 text-slate-600 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{parent.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{parent.phone}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-800">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                                                {parent.siblingsCount} {parent.siblingsCount > 1 ? "Students" : "Student"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-right text-slate-900">
                                            ₱{parent.totalAssessed.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-bold text-emerald-700">₱{parent.paid.toLocaleString()}</span>
                                            {balanceRemaining > 0 && (
                                                <span className="block text-[10px] font-medium text-amber-600 mt-0.5">
                                                    ₱{balanceRemaining.toLocaleString()} left
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                                parent.status === "Active" 
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {parent.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {parent.status === "Invited" ? (
                                                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold tracking-tight text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 mx-auto">
                                                    <Send className="w-3 h-3" /> Resend Invite
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 mx-auto">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* MOCK DRAWER DIALOG PANEL: For Rapid Parent Creation & Auth Invites */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
                    <div className="w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between border-l">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Provision Parent Profile</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Creates a permanent sponsor line and ships a system Auth invite link.</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400">First Legal Name</label>
                                    <Input 
                                        value={newFirstName} 
                                        onChange={(e) => setNewFirstName(e.target.value)} 
                                        placeholder="e.g., Naiah"
                                        className="h-10 text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400">Last Legal Name</label>
                                    <Input 
                                        value={newLastName} 
                                        onChange={(e) => setNewLastName(e.target.value)} 
                                        placeholder="e.g., Macasero"
                                        className="h-10 text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold uppercase text-slate-400">Contact Email Address</label>
                                    <Input 
                                        type="email" 
                                        value={newEmail} 
                                        onChange={(e) => setNewEmail(e.target.value)} 
                                        placeholder="parent@example.com"
                                        className="h-10 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span className="text-[11px] text-amber-800 leading-relaxed">
                                    Clicking submit triggers an instant production email payload via Supabase Admin Authentication using your configured redirect link context.
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 border-t pt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 h-11 text-xs font-bold border-slate-200"
                            >
                                Discard
                            </Button>
                            <Button 
                                onClick={() => {
                                    // Simulated execution completion
                                    setIsAddModalOpen(false);
                                }}
                                className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                            >
                                Dispatch Invite
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}