// "use client";

// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";


// import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
// import FeeSettlement from "@/components/enrollment/FeeSettlement";

// import EnrollmentContainer from "@/components/enrollment/EnrollmentContainer";


// type StudentData = {
//     firstName: string;
//     middleName?: string;
//     lastName: string;
//     dateOfBirth: string;
//     gender: string;
//     gradeLevel: string;
//     studentType: string;
// };

// const STAGING_PARENT_CONTEXT = {
//     id: "staging-unlinked-parent-id", 
//     first_name: "Staging",
//     last_name: "Unlinked Parent",
// };

// export default function Enrollment() {
//     const [step, setStep] = useState(2);
//     const [enrolledStudents, setEnrolledStudents] = useState<StudentData[]>([]);

//     const handleResetAllSteps = () => {
//         setEnrolledStudents([]);
//         setStep(2);
//     };

//     const handleGoBack = () => {
//         if (step > 2) {
//             setStep((prev) => prev - 1);
//         }
//     };

//     return (
//         <div className="w-[90%] mx-auto flex flex-col gap-6">
            
//             <div className="mt-10 mb-2 border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h2 className="text-[24px] font-semibold tracking-tight mt-2">
//                         Student Enrollment
//                     </h2>
//                 </div>

//                 <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground bg-muted/50 p-2 border rounded-lg h-fit">
//                     {step > 2 && (
//                         <Button 
//                             variant="ghost" 
//                             size="sm" 
//                             onClick={handleGoBack}
//                             className="h-7 text-xs flex items-center gap-1.5 hover:bg-white"
//                         >
//                             <ArrowLeft className="w-3.5 h-3.5" /> Back
//                         </Button>
//                     )}
//                     <span className={`px-2.5 py-1 rounded-md ${step === 2 ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}>
//                         1. Student Information
//                     </span>
//                     <span className="text-slate-300">/</span>
//                     <span className={`px-2.5 py-1 rounded-md ${step === 3 ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'}`}>
//                         2. Enrollment Fees
//                     </span>
//                 </div>
//             </div>

//             <div className="w-full">
//                 {/* Step 2: Student Placement Profiler */}
//                 {step === 2 && (
//                     <EnrollmentForm 
//                         parent={STAGING_PARENT_CONTEXT} 
//                         onEnrollmentComplete={(studentsData) => {
//                             setEnrolledStudents(studentsData);
//                             setStep(3); 
//                         }}
//                     />
//                 )}

//                 {/* Step 3: Immediate Fee Settlement Allocation Ledger */}
//                 {step === 3 && (
//                     <FeeSettlement 
//                         parent={STAGING_PARENT_CONTEXT} 
//                         enrolledStudents={enrolledStudents} 
//                         onComplete={handleResetAllSteps}
//                     />
//                 )}
//             </div>

//             {/* <EnrollmentContainer /> */}
//         </div>
//     );
// }