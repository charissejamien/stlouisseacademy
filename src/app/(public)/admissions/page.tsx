import { Backpack, BookOpen, GraduationCap, Check, HelpCircle } from 'lucide-react';
import Image from 'next/image';

export default function Admissions() {

    const gradeLevels = [
        {id:1, label:"Pre-Elementary", icon:Backpack, active: true},
        {id:2, label:"Elementary", icon:BookOpen, active: false},
        {id:3, label:"Junior High School", icon:GraduationCap, active: false},
    ];

    const preElemRequirements = [
        {id:1 , requirement: "Birth Certificate (PSA)", description: "One clear photocopy"},
        {id:2, requirement: "Filled Out Application Form", description:"One clear photocopy"},
        {id:3, requirement: "2x2 recent ID picture", description:"One clear photocopy"},
    ];

    // Array data for the Enrollment Steps
    const enrollmentSteps = [
        {
            step: 1,
            title: "Enrollment Form",
            desc: "Duly filled up Enrollment Form and other application forms."
        },
        {
            step: 2,
            title: "Submit Requirements",
            desc: "Submit to the Registrar the necessary requirements needed for evaluation."
        },
        {
            step: 3,
            title: "Pay Entrance Fee",
            desc: "Proceed to the Cashier for payment of the Entrance Fee."
        },
        {
            step: 4,
            title: "Wait for Result",
            desc: "Wait for the result of the assessment and recommendation based on assessment result"
        }
    ];

    return(
        <div className="bg-slate-50/50 min-h-screen pb-24">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden text-white bg-slate-900">
                <Image src={"/admissions-bg.svg"} alt="" width={30} height={30} className="object-cover h-[85vh] w-full lg:h-[90vh]"/>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center">
                    <h1 className="drop-shadow-md tracking-wider">WELCOME TO ST. LOUISSE ACADEMY</h1>
                    <div className="text-[48px] italic font-semibold lg:text-[72px] drop-shadow-lg">
                    <p><span className="text-sla-gold">S</span>trive.</p>
                    <p><span className="text-sla-gold">L</span>earn.</p>
                    <p><span className="text-sla-gold">A</span>ccomplish.</p>
                    </div>
                </div>
            </section>

            {/* REQUIREMENTS MODULE MAIN SECTION */}
            <div className="max-w-6xl mx-auto px-5 mt-16">
                <h2 className="text-center font-semibold text-[#004C97] text-[28px] tracking-wide mb-12">
                  Requirements
                </h2>
                
                <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
                    {/* Left Column: Side Navigation Tabs */}
                    <div className="w-full lg:w-[35%] flex flex-col gap-4">
                        <div className="mb-2">
                            <h3 className="font-bold text-slate-800 text-base">Admission Requirements</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Please prepare the following documents before proceeding with your application. 
                              Requirements vary depending on the grade level.
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-2.5">
                            {gradeLevels.map((items)=> (
                                <button 
                                  key={items.id} 
                                  className={`flex items-center gap-3 w-full p-3.5 px-5 rounded-xl font-medium text-sm transition-all duration-200 border text-left
                                    ${items.active 
                                      ? 'bg-[#0961b8] text-white shadow-md border-transparent font-semibold' 
                                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-100 shadow-sm'
                                    }`}
                                >
                                  <items.icon size={18} className={items.active ? 'text-white' : 'text-slate-500'} />
                                  {items.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Display Information Layout Panel Card */}
                    <div className="w-full lg:w-[55%] bg-white border border-slate-100 rounded-2xl shadow-xl p-8">
                        <div className="mb-6">
                            <h4 className="text-[17px] font-bold text-[#004C97]">Pre-Elementary Checklist</h4>
                            <p className="text-xs text-slate-500 mt-0.5">For Nursery, Kinder 1, and Kinder 2 applicants.</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {preElemRequirements.map((list) => (
                                <div key={list.id} className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-4 px-5 flex items-start gap-4">
                                    <div className="bg-[#0961b8] text-white p-1 rounded-md mt-0.5 flex items-center justify-center shadow-sm">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <p className="font-bold text-sm text-slate-800 tracking-wide">{list.requirement}</p>
                                        <p className="text-xs text-slate-400 font-light mt-1">{list.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-[#E3EFFB]/50 border border-blue-100 rounded-xl p-4 px-5 flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-3 text-slate-700">
                                <HelpCircle size={18} className="text-[#0961b8]" />
                                <p>Have questions about requirements?</p>
                            </div>
                            <button className="text-[#0961b8] font-bold hover:underline tracking-wide">
                                Contact Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW SECTION: ENROLLMENT PROCESS TIMELINE */}
            <div className="max-w-6xl mx-auto px-5 mt-28">
                <h2 className="text-center font-semibold text-[#004C97] text-[24px] tracking-wide mb-16">
                    Enrollment Process
                </h2>

                <div className="relative w-full">
                    {/* Horizontal connecting connector line (visible on desktop) */}
                    <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-[2px] bg-slate-200 z-0" />

                    {/* Step Nodes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
                        {enrollmentSteps.map((stepItem) => (
                            <div key={stepItem.step} className="flex flex-col items-center text-center px-2">
                                
                                {/* Step Circle Badge */}
                                <div className="w-12 h-12 rounded-full bg-[#0961b8] text-white font-bold text-lg flex items-center justify-center shadow-md mb-6 border-4 border-white">
                                    {stepItem.step}
                                </div>

                                {/* Step Copy Content */}
                                <h3 className="font-bold text-slate-800 text-sm tracking-wide mb-2">
                                    {stepItem.title}
                                </h3>
                                <p className="text-xs text-slate-500 font-light leading-relaxed max-w-[220px]">
                                    {stepItem.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW SECTION: FINAL CALL TO ACTION BOX */}
            <div className="max-w-6xl mx-auto px-5 mt-24">
                <div className="w-full bg-[#0961b8] rounded-2xl p-12 py-16 text-center text-white shadow-xl flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                        Ready to join St. Louisse Academy?
                    </h2>
                    <p className="text-xs md:text-sm text-blue-100 font-light max-w-xl leading-relaxed">
                        Applications for Academic Year 2024-2025 are still being accepted. Slots are limited, apply today!
                    </p>
                </div>
            </div>

        </div>
    );
}