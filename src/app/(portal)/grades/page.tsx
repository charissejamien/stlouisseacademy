"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Award, FileText } from "lucide-react";

export default function StudentGrades() {
  const [activeTab, setActiveTab] = useState<"attendance" | "competencies">("attendance");

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Progress Report Card
          </h2>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Attendance Record
          </button>
          <button
            onClick={() => setActiveTab("competencies")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "competencies"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Competency Report
          </button>
        </div>
      </div>

      {/* ==========================================
          1. ATTENDANCE RECORD SECTION
      ========================================== */}
      {activeTab === "attendance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card className="border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Attendance Record</span>
                </CardTitle>
                <p className="text-xs text-slate-400">
                  Monthly class days, days present, and absence logs across terms
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Term</th>
                    <th className="py-3 px-4 font-bold">Month</th>
                    <th className="py-3 px-4 font-bold text-center">No. of Class Days</th>
                    <th className="py-3 px-4 font-bold text-center">No. of Days Present</th>
                    <th className="py-3 px-4 font-bold text-center">No. of Times Absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {/* Term 1 */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900 text-center md:text-left" rowSpan={4}>Term 1</td>
                    <td className="py-3 px-4">June</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">July</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">August</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">September</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>

                  {/* Term 2 */}
                  <tr className="border-t-2 border-slate-100 text-center md:text-left">
                    <td className="py-3 px-4 font-bold text-slate-900" rowSpan={4}>Term 2</td>
                    <td className="py-3 px-4">September</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">October</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">November</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">December</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>

                  {/* Term 3 */}
                  <tr className="border-t-2 border-slate-100 text-center md:text-left">
                    <td className="py-3 px-4 font-bold text-slate-900" rowSpan={4}>Term 3</td>
                    <td className="py-3 px-4">January</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">February</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">March</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">April</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>

                  {/* Total Row */}
                  <tr className="border-t-2 border-slate-200 bg-slate-50/50 font-bold text-slate-900">
                    <td className="py-3 px-4" colSpan={2}>TOTAL</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                    <td className="py-3 px-4 text-center">—</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==========================================
          2. COMPETENCIES & REST OF THE PAGES
      ========================================== */}
      {activeTab === "competencies" && (
        <div className="space-y-6 animate-in fade-in duration-200">

          {/* Legend Reference Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/20 text-xs space-y-1">
              <span className="font-bold text-emerald-700 uppercase text-[14px] tracking-wider">CO — Consistent</span>
              <p className="text-slate-600 text-[12px] mt-1">
                Always demonstrates the expected competency <br />
                Always participates in the different activities, works Independently <br />
                Always performs tasks, advanced in some aspects
                </p>
            </div>
            <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/20 text-xs space-y-1">
              <span className="font-bold text-blue-700 uppercase text-[14px] tracking-wider">DV — Developing</span>
              <p className="text-slate-600 text-[12px]">
                Sometimes demonstrates the competency <br />
                Sometimes participates, minimal supervision <br />
                Progress continuously in doing assigned tasks
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/20 text-xs space-y-1">
              <span className="font-bold text-amber-700 uppercase text-[14px] tracking-wider">BG — Beginning</span>
              <p className="text-slate-600 text-[12px]">
                Rare demonstrates the expected competency <br />
                Rarely participates in class activities and/or initiates independent works <br />
                Shows interest in doing tasks but needs close supervision
              </p>
            </div>
          </div>

          {/* Domain I: Sensory Perceptual and Motor Development */}
          <CompetencyTable
            title="I. Sensory Perceptual and Motor Development"
            items={[
              "Identifies external body parts and their functions.",
              "Identifies ways to care for and protect one's body.",
              "Demonstrates gross motor (Locomotor & Non-Locomotor)",
              "Moves body parts as directed",
              "Demonstrates fine motor skills (learning, cutting, rolling, molding w/ playdough)",
            ]}
          />

          {/* Domain II: Socio-Emotional Development */}
          <CompetencyTable
            title="II. Socio-Emotional Development"
            items={[
              "Identifies and expresses feelings in appropriate ways",
              "Recognizes and respect feelings of others.",
              "Express needs and preferences",
              "Behave appropriately in different situations",
              "Participate in classroom routines and activities",
              "Follows classroom and school rules",
              "Fulfills classroom responsibilities",
            ]}
          />

          {/* Domain III: Cognitive Development */}
          <CompetencyTable
            title="III. Cognitive Development"
            items={[
              "Identifies attributes of objects (color, shape, size)",
              "Match objects based on attributes",
              "Describe objects based on attributes (shape, color, taste, texture)",
              "Classifies objects by a single attribute (color, shape, size)",
              "Reclassifies objects according to multiple attributes",
              "Arranges objects according to specific attributes",
              "Recognizes, extends and create patterns using concrete objects",
              "Measures size, length, capacity and mass of objects using non-standard measuring tools",
              "Identifies position of objects (in, on, over, under, up, bottom)",
              "Compares quantities of objects (more/less)",
              "Counts with one-to-one correspondence",
              "Recognizes numerals",
              "Matches numerals to objects",
              "Adds and subtracts using concrete objects",
              "Recognizes clock as measure of time (hours and minutes)",
              "Shows awareness and care for the natural and physical environment",
              "Talks about participation in cultural and religious activities",
              "Shows awareness of the importance of caring for the natural and physical environment through simple practices (e.g. sorting trash helping to clean up)",
              "Predicts outcomes in familiar stories read aloud in class",
              "Suggest solutions to problems in class activities and stories read aloud in class",
            ]}
          />

          {/* Domain IV: Language, Literacy, and Communication Development */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 px-1">
              IV. Language, Literacy, and Communication Development
            </h3>

            <CompetencyTable
              subtitle="A. Listening and Viewing"
              items={[
                "Identifies familiar environmental sound",
                "Recalls what happens first, middle and end to a story",
                "Retells story in sequence",
                "Follows 1-2 step instructions",
              ]}
            />

            <CompetencyTable
              subtitle="B. Sight Word Recognition"
              items={[
                "Recognizes non-readable words in and out of context automatically",
                "Recognize sight words",
              ]}
            />

            <CompetencyTable
              subtitle="C. Speaking"
              items={[
                "Identifies first and last name",
                "Identifies classmates, teachers, family member",
                "Identifies familiar objects at home, in school and in the community",
                "Uses polite greetings and courteous expression in varied situations",
                "Retells personal experiences to story events",
                "Expresses ideas and feelings using phrases and simple sentences",
              ]}
            />

            <CompetencyTable
              subtitle="D. Reading & Phonological Awareness"
              items={[
                "Orally segment sound (syllables / phonemes)",
                "Identifies uppercase letters",
                "Identifies lowercase letters",
                "Matches upper and lower case letters",
                "Identifies letter sounds",
                "Matches letters and their corresponding sounds",
              ]}
            />

            <CompetencyTable
              subtitle="E. Comprehension & F. Concepts of Print"
              items={[
                "Uses a variety of strategies to gain meaning of leveled texts",
                "Uses print and illustrations to make meaning",
                "Demonstrates book handling skills",
                "Distinguishes between letters, words, and sentences",
                "Demonstrates awareness of print (left to right and top to bottom)",
              ]}
            />

            <CompetencyTable
              subtitle="G. Writing"
              items={[
                "Traces/draws/copies shapes, designs, pictures",
                "Traces/ copies/writes name, words",
                "Writes uppercase and lowercase letters",
                "Spells sight words",
                "Spells simple words phonetically",
              ]}
            />
          </div>

          {/* Teacher's Remarks Section */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Teacher's Comments / Remarks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Term 1 (Unang Termino)</span>
                <div className="h-20 text-xs text-slate-400 italic">No remarks recorded yet.</div>
              </div>
              <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Term 2 (Ikalawang Termino)</span>
                <div className="h-20 text-xs text-slate-400 italic">No remarks recorded yet.</div>
              </div>
              <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Term 3 (Ikatlong Termino)</span>
                <div className="h-20 text-xs text-slate-400 italic">No remarks recorded yet.</div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}

// Reusable Sub-Component for Competency Tables
function CompetencyTable({ title, subtitle, items }: { title?: string; subtitle?: string; items: string[] }) {
  return (
    <Card className="border shadow-xs overflow-hidden">
      {title && (
        <CardHeader className="py-3 px-5 bg-slate-50/80 border-b border-slate-100">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      {subtitle && (
        <div className="py-2.5 px-5 bg-slate-100/50 border-b border-slate-100 text-[11px] font-bold text-slate-600">
          {subtitle}
        </div>
      )}
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-5 font-semibold">Competency Description</th>
              <th className="py-2.5 px-3 font-semibold text-center w-16">T1</th>
              <th className="py-2.5 px-3 font-semibold text-center w-16">T2</th>
              <th className="py-2.5 px-3 font-semibold text-center w-16">T3</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {items.map((desc, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                <td className="py-3 px-5 font-normal leading-relaxed">{desc}</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">—</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">—</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}