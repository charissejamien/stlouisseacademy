

export default function StudentProfile() {


    const personalInfo = [
        {label:"Full Name", text:"Alagbay, Charisse Jamien"},
        {label:"Date of Birth", text:"April 08, 2005 (21 years old)"},
        {label:"Gender", text:"Female"},
        {label:"Address", text:"Guiwanon, Compostela, Cebu"},

    ]

    return(
        <div className="flex flex-col gap-5">
            <section className="bg-white rounded-md p-10 flex gap-10 items-center">
                        <div className="bg-sla-blue w-30 h-30"/>

                        <div className="flex flex-col gap-1">
                            <p className="text-[24px] text-sla-blue font-semibold">Alagbay, Charisse Jamien T.</p>
                            <div className="flex gap-10">
                                <p className="text-[14px] text-sla-gray">ID: 20230001</p>
                                <p className="text-[14px] text-sla-gray">Grade 7 - Emerald</p>
                            </div>
                        </div>
            </section>

            <section className="flex gap-5">
                <div className="bg-white rounded-md p-7 pr-20 flex flex-col gap-3">
                    <p className="text-sla-blue font-medium">Personal Information</p>
                    <div className="flex grid grid-cols-2 gap-5">
                        {personalInfo.map((p , index) => (
                            <div key={index}>
                                <p className="text-[12px] text-sla-gray uppercase font-medium">{p.label}</p>
                                <p className="font-medium text-gray-700">{p.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-md p-5">
                    <p className="text-sla-blue font-medium">Emergency Contact</p>
                </div>
            </section>
        </div>
    );
}