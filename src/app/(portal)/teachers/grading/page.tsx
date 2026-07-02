"use client";

import { useState, useEffect } from "react";
import { 
    Save, Search, Loader2, Baby, GraduationCap, 
    Award, SaveAll, ChevronRight 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    getGradingRoster, 
    saveGradingRoster, 
    runDepEdCalculations, 
    StudentGradingRecord, 
    SubjectCategory 
} from "./actions";

export default function ConsolidatedGradingDashboard() {
    const [keyStage, setKeyStage] = useState<"KS1" | "KS2" | "KS3">("KS1");
    const [selectedGrade, setSelectedGrade] = useState("Nursery");
    const [subjectCat, setSubjectCat] = useState<SubjectCategory>("SCI_MATH");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [roster, setRoster] = useState<StudentGradingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await getGradingRoster(selectedGrade, subjectCat);
            setRoster(data);
            setIsLoading(false);
        }
        loadData();
    }, [selectedGrade, subjectCat]);

    const handleCheckboxToggle = async (studentId: string, field: "sociodemographic_skills" | "motor_coordination" | "literacy_foundations" | "numeral_foundations") => {
        const targetRow = roster.find(r => r.student_id === studentId);
        if (!targetRow) return;

        const baseUpdated = { ...targetRow, [field]: !targetRow[field] };
        const fullyCalculated = await runDepEdCalculations(baseUpdated, subjectCat);

        setRoster(prev => prev.map(row => row.student_id === studentId ? fullyCalculated : row));
    };

    const handleScoreInputChange = async (studentId: string, field: keyof StudentGradingRecord, value: number) => {
        const targetRow = roster.find(r => r.student_id === studentId);
        if (!targetRow) return;

        const baseUpdated = { ...targetRow, [field]: value };
        const fullyCalculated = await runDepEdCalculations(baseUpdated, subjectCat);

        setRoster(prev => prev.map(row => row.student_id === studentId ? fullyCalculated : row));
    };

    const handleCategoryChange = async (cat: SubjectCategory) => {
        setSubjectCat(cat);
        setIsLoading(true);
        const updatedRoster = await Promise.all(
            roster.map(row => runDepEdCalculations(row, cat))
        );
        setRoster(updatedRoster);
        setIsLoading(false);
    };

    const commitChanges = async () => {
        setIsSaving(true);
        await saveGradingRoster(roster);
        setIsSaving(false);
        alert("Grades successfully synced with Supabase registers.");
    };

    const filtered = roster.filter(s => s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.student_id.includes(searchQuery));
    const boys = filtered.filter(s => s.gender === "Male");
    const girls = filtered.filter(s => s.gender === "Female");

    return (
        <div className="w-[95%] max-w-7xl mx-auto my-10 flex flex-col gap-6 antialiased">
            
            {/* Header Control Workspace */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
                        <span>Academic Grading Terminal</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="bg-indigo-50 px-2 py-0.5 rounded">{keyStage} Active Scope</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                        DepEd K-10 Master Record Book
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                    <select 
                        value={keyStage} 
                        onChange={(e) => {
                            const val = e.target.value as "KS1" | "KS2" | "KS3";
                            setKeyStage(val);
                            if (val === "KS1") setSelectedGrade("Nursery");
                            else if (val === "KS2") setSelectedGrade("Grade 4");
                            else setSelectedGrade("Grade 7");
                        }}
                        className="bg-white border text-xs font-bold h-10 px-3 rounded-xl outline-none shadow-3xs cursor-pointer"
                    >
                        <option value="KS1">Key Stage 1 (K-3)</option>
                        <option value="KS2">Key Stage 2 (4-6)</option>
                        <option value="KS3">Key Stage 3 (7-10)</option>
                    </select>

                    <select 
                        value={selectedGrade} 
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="bg-white border text-xs font-bold h-10 px-3 rounded-xl outline-none shadow-3xs cursor-pointer"
                    >
                        {keyStage === "KS1" && (
                            <>
                                <option value="Nursery">Nursery</option>
                                <option value="Kinder">Kindergarten</option>
                            </>
                        )}
                        {keyStage === "KS2" && (
                            <>
                                <option value="Grade 4">Grade 4</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 6">Grade 6</option>
                            </>
                        )}
                        {keyStage === "KS3" && (
                            <>
                                <option value="Grade 7">Grade 7</option>
                                <option value="Grade 8">Grade 8</option>
                                <option value="Grade 9">Grade 9</option>
                                <option value="Grade 10">Grade 10</option>
                            </>
                        )}
                    </select>

                    {keyStage !== "KS1" && (
                        <select 
                            value={subjectCat} 
                            onChange={(e) => handleCategoryChange(e.target.value as SubjectCategory)}
                            className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold h-10 px-3 rounded-xl outline-none shadow-3xs cursor-pointer"
                        >
                            <option value="SCI_MATH">Science / Math Core (40/40/20)</option>
                            <option value="LANGUAGES">Languages / AP / EsP (30/50/20)</option>
                            <option value="MAPEH_TLE">MAPEH / TLE / EPP (20/60/20)</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Sub Toolbar Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search student profile..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 h-10 rounded-xl text-xs font-medium outline-none shadow-3xs focus:border-indigo-500"
                    />
                </div>
                <Button 
                    onClick={commitChanges} 
                    disabled={isSaving || isLoading} 
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-10 px-5 rounded-xl flex items-center gap-2 shadow-sm"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Sync Changes</span>
                </Button>
            </div>

            {/* Main Table Matrix Component */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                                <th className="py-3 px-5 w-72">Learner Core Particulars</th>
                                {keyStage === "KS1" ? (
                                    <>
                                        <th className="py-3 px-4 text-center">Socio-Emotional</th>
                                        <th className="py-3 px-4 text-center">Motor Skills</th>
                                        <th className="py-3 px-4 text-center">Language & Lit</th>
                                        <th className="py-3 px-4 text-center">Numeracy</th>
                                        <th className="py-3 px-5 text-right pr-6">Descriptive Evaluation</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="py-3 px-4 text-center bg-slate-50/50">Written Works</th>
                                        <th className="py-3 px-4 text-center">Performance Tasks</th>
                                        <th className="py-3 px-4 text-center bg-slate-50/50">Terminal Exam</th>
                                        <th className="py-3 px-5 text-right pr-6">Quarter Final Rating</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y text-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin text-indigo-600 w-5 h-5" />
                                            <span>Updating assessment grid templates...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-400 italic">No records found.</td>
                                </tr>
                            ) : (
                                <>
                                    {boys.length > 0 && (
                                        <>
                                            <tr className="bg-blue-50/30 text-blue-800 font-bold border-y border-blue-100 select-none text-[10px] uppercase">
                                                <td colSpan={6} className="py-1.5 px-5">Boys List ({boys.length})</td>
                                            </tr>
                                            {boys.map(student => (
                                                <RenderGradingRow 
                                                    key={student.student_id} 
                                                    row={student} 
                                                    stage={keyStage} 
                                                    onCheckToggle={handleCheckboxToggle} 
                                                    onScoreChange={handleScoreInputChange} 
                                                />
                                            ))}
                                        </>
                                    )}

                                    {girls.length > 0 && (
                                        <>
                                            <tr className="bg-pink-50/30 text-pink-800 font-bold border-y border-pink-100 select-none text-[10px] uppercase">
                                                <td colSpan={6} className="py-1.5 px-5">Girls List ({girls.length})</td>
                                            </tr>
                                            {girls.map(student => (
                                                <RenderGradingRow 
                                                    key={student.student_id} 
                                                    row={student} 
                                                    stage={keyStage} 
                                                    onCheckToggle={handleCheckboxToggle} 
                                                    onScoreChange={handleScoreInputChange} 
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

// --- SUB-COMPONENT ROW DELEGATE ---
interface RowProps {
    row: StudentGradingRecord;
    stage: "KS1" | "KS2" | "KS3";
    onCheckToggle: (id: string, field: "sociodemographic_skills" | "motor_coordination" | "literacy_foundations" | "numeral_foundations") => Promise<void>;
    onScoreChange: (id: string, field: keyof StudentGradingRecord, value: number) => Promise<void>;
}

function RenderGradingRow({ row, stage, onCheckToggle, onScoreChange }: RowProps) {
    if (stage === "KS1") {
        return (
            <tr className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-slate-400" />
                        {row.student_name}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-indigo-600 mt-0.5">{row.student_id}</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" checked={row.sociodemographic_skills} onChange={() => onCheckToggle(row.student_id, "sociodemographic_skills")} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" checked={row.motor_coordination} onChange={() => onCheckToggle(row.student_id, "motor_coordination")} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" checked={row.literacy_foundations} onChange={() => onCheckToggle(row.student_id, "literacy_foundations")} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td className="py-3.5 px-4 text-center">
                    <input type="checkbox" checked={row.numeral_foundations} onChange={() => onCheckToggle(row.student_id, "numeral_foundations")} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
                </td>
                <td className="py-3.5 px-5 text-right pr-6">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1.5 ${
                        row.descriptive_rating?.startsWith("Consistent") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : row.descriptive_rating?.startsWith("Developing") ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                        <Award className="w-3 h-3 stroke-[2.5]" />
                        {row.descriptive_rating}
                    </span>
                </td>
            </tr>
        );
    }

    return (
        <tr className="hover:bg-slate-50/30 transition-colors">
            <td className="py-3 px-5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {row.student_name}
                </div>
                <div className="text-[10px] font-mono font-semibold text-slate-400 mt-0.5">{row.student_id}</div>
            </td>
            
            <td className="py-3 px-4 text-center bg-slate-50/30">
                <div className="flex items-center justify-center gap-1">
                    <input type="number" value={row.written_works_score} onChange={(e) => onScoreChange(row.student_id, "written_works_score", Number(e.target.value))} className="w-12 h-8 text-center border rounded font-bold shadow-3xs text-xs" />
                    <span className="text-slate-300">/</span>
                    <input type="number" value={row.written_works_hps} onChange={(e) => onScoreChange(row.student_id, "written_works_hps", Number(e.target.value))} className="w-12 h-8 text-center border rounded bg-slate-50 text-slate-500 text-xs" />
                </div>
            </td>

            <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                    <input type="number" value={row.performance_tasks_score} onChange={(e) => onScoreChange(row.student_id, "performance_tasks_score", Number(e.target.value))} className="w-12 h-8 text-center border rounded font-bold shadow-3xs text-xs" />
                    <span className="text-slate-300">/</span>
                    <input type="number" value={row.performance_tasks_hps} onChange={(e) => onScoreChange(row.student_id, "performance_tasks_hps", Number(e.target.value))} className="w-12 h-8 text-center border rounded bg-slate-50 text-slate-500 text-xs" />
                </div>
            </td>

            <td className="py-3 px-4 text-center bg-slate-50/30">
                <div className="flex items-center justify-center gap-1">
                    <input type="number" value={row.terminal_exam_score} onChange={(e) => onScoreChange(row.student_id, "terminal_exam_score", Number(e.target.value))} className="w-12 h-8 text-center border rounded font-bold shadow-3xs text-xs" />
                    <span className="text-slate-300">/</span>
                    <input type="number" value={row.terminal_exam_hps} onChange={(e) => onScoreChange(row.student_id, "terminal_exam_hps", Number(e.target.value))} className="w-12 h-8 text-center border rounded bg-slate-50 text-slate-500 text-xs" />
                </div>
            </td>

            <td className="py-3 px-5 text-right pr-6">
                <div className="flex flex-col items-end">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${
                        (row.final_quarterly_grade ?? 0) >= 75 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                        {row.final_quarterly_grade}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">Raw initial: {row.initial_grade}</span>
                </div>
            </td>
        </tr>
    );
}