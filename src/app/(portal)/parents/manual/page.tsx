"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronDown, ChevronUp, BookOpen, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ParentManual() {
  // Hardcoded accordion state track matrices
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the policy regarding dynamic grading schedules and system errors?",
      a: "All final mark variants reflect strict faculty input grids. In case a grade disparity manifests within your child's profile interface, contact the academic coordinator office to check cross-table schema anomalies."
    },
    {
      q: "How do I process alternative installment structures for tuition balancing?",
      a: "Special configurations require explicit administrative approval. Parents may visit the central finance office to register payment expansion requests or request manual override triggers."
    },
    {
      q: "What are the rules regarding unexcused absences and campus rules parameters?",
      a: "Students who accrue more than three consecutive unexcused absence loops will automatically trigger warning advisories straight to the parent dashboard. Documented letters must be submitted to the guidance department."
    }
  ];

  const handleDownload = () => {
    toast.success("Downloading Academic Student Manual PDF (SY 2026-2027)...");
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Guidebook</h2>
        <p className="text-xs text-slate-500">Access regulatory frameworks, code of discipline provisions, and operational compliance references.</p>
      </div>

      {/* Main Download Block Option */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900">Student Handbook Matrix</h3>
            <p className="text-xs text-slate-400">Complete documentation detailing grading curves, code of attire, and basic institutional guidelines.</p>
          </div>
        </div>
        <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex gap-2 text-xs font-semibold px-4 py-2">
          <FileDown className="w-4 h-4" /> Download Manual PDF
        </Button>
      </Card>

      {/* Modular FAQ Blocks Accordion */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm pb-1">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h3>Frequently Asked Policy Inquiries</h3>
        </div>
        
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <Card key={index} className="bg-white border border-slate-200 shadow-sm overflow-hidden transition-all duration-200">
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs md:text-sm text-slate-800 hover:bg-slate-50/50 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}