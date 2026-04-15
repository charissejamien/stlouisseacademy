import {Backpack, BookOpen, GraduationCap, Check} from 'lucide-react';

export default function Admissions() {

    const gradeLevels = [
        {id:1, label:"Pre-Elementary", icon:Backpack},
        {id:2, label:"Elementary", icon:BookOpen},
        {id:3, label:"Junior High School", icon:GraduationCap},
    ];

    const preElemRequirements = [
        {id:1 , requirement: "Birth Certificate (PSA)", description: "One clear photocopy"},
        {id:2, requirement: "Filled Out Application Form", description:"One clear photocopy"},
        {id:3, requirement: "2x2 recent ID picture", description:"One clear photocopy"},
    ]

    return(
        <div>
            <div className="text-white p-5 flex flex-col align-center justify-center text-center" style={{backgroundImage: `url('/admissions-bg.svg')`}}>
                <h1 className='text-[28px]'>Join SLA. Be a <span className='font-semibold text-sla-gold italic'>Louissian.</span></h1>
                <p className='text-[12px]'>Your journey to academic excellence starts here.</p>
                <button className='bg-sla-blue px-4 py-2 rounded-sm w-fit'>ENROLL NOW</button>
            </div>


            <div className="w-[80%]">
                <h2>Requirements</h2>
                <div>
                    <div>
                        <p>Admission Requirements</p>
                        <p>Please prepare the following documents before proceeding with your application.
                            Requirements vary depending on the grade level.
                        </p>
                        {gradeLevels.map((items)=> (
                            <button key={items.id} className='flex gap-2 p-3 bg-white'><items.icon/>{items.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='bg-white p-5'>
                <p>Pre-Elementary Checklist</p>
                <p>For Nursery, Kinder 1, and Kinder 2 applicants.</p>
                {preElemRequirements.map((list) => (
                    <div className='bg-background border border-gray-muted flex flex-col gap-3'>
                        <Check  size={12}/>
                        <p>{list.requirement}</p>
                        <p>{list.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}