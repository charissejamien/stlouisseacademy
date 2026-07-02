"use server";

// --- TYPE SCHEMAS ---
export type MasteryRating = "Beginning (B)" | "Developing (D)" | "Consistent (C)";
export type SubjectCategory = "LANGUAGES" | "SCI_MATH" | "MAPEH_TLE";

export interface StudentGradingRecord {
    student_id: string;
    student_name: string;
    gender: "Male" | "Female";
    grade_level: string; 
    
    // Key Stage 1 Checkpoint States
    sociodemographic_skills: boolean;
    motor_coordination: boolean;
    literacy_foundations: boolean;
    numeral_foundations: boolean;
    descriptive_rating?: MasteryRating;

    // Key Stages 2 & 3 Score Trackers
    written_works_score: number;
    written_works_hps: number;
    performance_tasks_score: number;
    performance_tasks_hps: number;
    terminal_exam_score: number;
    terminal_exam_hps: number;
    initial_grade?: number;
    final_quarterly_grade?: number;
}

// --- MOCK RAW DATABASE POPULATION LEDGER ---
const MOCK_STUDENTS_DB: StudentGradingRecord[] = [
    { student_id: "2026-N001", student_name: "Abad, Liam Justin", gender: "Male", grade_level: "Nursery", sociodemographic_skills: true, motor_coordination: true, literacy_foundations: false, numeral_foundations: false, written_works_score: 0, written_works_hps: 0, performance_tasks_score: 0, performance_tasks_hps: 0, terminal_exam_score: 0, terminal_exam_hps: 0 },
    { student_id: "2026-N002", student_name: "Aquino, Sophia Nicole", gender: "Female", grade_level: "Nursery", sociodemographic_skills: true, motor_coordination: true, literacy_foundations: true, numeral_foundations: false, written_works_score: 0, written_works_hps: 0, performance_tasks_score: 0, performance_tasks_hps: 0, terminal_exam_score: 0, terminal_exam_hps: 0 },
    { student_id: "2026-G401", student_name: "Bautista, John Carlo", gender: "Male", grade_level: "Grade 4", sociodemographic_skills: false, motor_coordination: false, literacy_foundations: false, numeral_foundations: false, written_works_score: 24, written_works_hps: 30, performance_tasks_score: 45, performance_tasks_hps: 50, terminal_exam_score: 18, terminal_exam_hps: 20 },
    { student_id: "2026-G402", student_name: "De Leon, Sophia Marie", gender: "Female", grade_level: "Grade 4", sociodemographic_skills: false, motor_coordination: false, literacy_foundations: false, numeral_foundations: false, written_works_score: 28, written_works_hps: 30, performance_tasks_score: 48, performance_tasks_hps: 50, terminal_exam_score: 19, terminal_exam_hps: 20 },
    { student_id: "2026-G701", student_name: "Mendoza, Marcus", gender: "Male", grade_level: "Grade 7", sociodemographic_skills: false, motor_coordination: false, literacy_foundations: false, numeral_foundations: false, written_works_score: 15, written_works_hps: 30, performance_tasks_score: 32, performance_tasks_hps: 50, terminal_exam_score: 11, terminal_exam_hps: 20 }
];

// Internal synchronous logic function to keep things clean
function processMath(record: StudentGradingRecord, category: SubjectCategory): StudentGradingRecord {
    const checkpoints = [record.sociodemographic_skills, record.motor_coordination, record.literacy_foundations, record.numeral_foundations];
    const ticks = checkpoints.filter(Boolean).length;
    let descriptiveRating: MasteryRating = "Beginning (B)";
    if (ticks >= 4) descriptiveRating = "Consistent (C)";
    else if (ticks >= 2) descriptiveRating = "Developing (D)";

    const wwPct = record.written_works_hps > 0 ? (record.written_works_score / record.written_works_hps) * 100 : 0;
    const ptPct = record.performance_tasks_hps > 0 ? (record.performance_tasks_score / record.performance_tasks_hps) * 100 : 0;
    const tePct = record.terminal_exam_hps > 0 ? (record.terminal_exam_score / record.terminal_exam_hps) * 100 : 0;

    let initial = 0;
    if (category === "LANGUAGES") initial = (wwPct * 0.30) + (ptPct * 0.50) + (tePct * 0.20);
    else if (category === "SCI_MATH") initial = (wwPct * 0.40) + (ptPct * 0.40) + (tePct * 0.20);
    else if (category === "MAPEH_TLE") initial = (wwPct * 0.20) + (ptPct * 0.60) + (tePct * 0.20);

    initial = Math.round(initial * 100) / 100;
    
    const final = initial < 60 
        ? Math.round((60 + (initial / 60) * 15) * 100) / 100 
        : Math.round(initial);

    return {
        ...record,
        descriptive_rating: descriptiveRating,
        initial_grade: initial,
        final_quarterly_grade: Math.min(final, 100)
    };
}

// --- FIXED: ADDED ASYNC TO REMOVE COMPILATION ERROR ---
export async function runDepEdCalculations(record: StudentGradingRecord, category: SubjectCategory): Promise<StudentGradingRecord> {
    return processMath(record, category);
}

export async function getGradingRoster(gradeLevel: string, subjectCat: SubjectCategory): Promise<StudentGradingRecord[]> {
    const matchGroup = MOCK_STUDENTS_DB.filter(s => s.grade_level === gradeLevel);
    return matchGroup.map(student => processMath(student, subjectCat));
}

export async function saveGradingRoster(payload: StudentGradingRecord[]): Promise<{ success: boolean }> {
    console.log("Saving records to Supabase storage maps:", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}