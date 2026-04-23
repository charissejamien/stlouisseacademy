import Card from "@/components/jobOpeningsCard";


export default function Careers() {


    return (
    <div className="flex flex-col gap-10">

        <section className="w-full text-center">
            <h1 className="uppercase text-sla-gold font-medium text-[32px]">Careers</h1>
            <p>We welcome your interest in becoming a member of our family.</p>
        </section>

        

        <section className="uppercase text-[24px] text-center flex flex-col gap-10">
            <h2 className="font-garamond">Job Openings at St. Louisse Academy</h2>
            <div className="w-[80%] mx-auto flex justify-center">
               <Card/>
            </div>
        </section>
 
    </div>
    );
}


