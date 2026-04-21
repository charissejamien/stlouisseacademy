import Image from "next/image";

export default function Home() {

const academicLevels = [
  {id:1, level:"Pre-Elementary", grades:"Nursery, Kindergarten 1 & 2", imgUrl: "/pre-elementary.svg"},
  {id:2, level:"Elementary", grades:"Grades 1 to 6", imgUrl: "/elementary.svg"},
  {id:3, level:"Junior High", grades:"Grades 7 to 10", imgUrl: "/junior-high.svg"}
];

  return(
    <div className="flex flex-col gap-20">
    
    <section>

    </section>

    <section className="bg-sla-blue p-5 text-white">
      <div className="flex justify-between">
        <h2>Campus Bulletin</h2>
        <button className="text-[12px] text-sla-blue bg-white py-2 px-6 rounded-2xl font-semibold">View More</button>
      </div>
      <p>Discover on-campus events for students, parents, and visitors.</p>
    </section>

    <section className="flex flex-col gap-5 mt-20 w-[85%] mx-auto">
      <h2 className="text-sla-blue font-semibold text-[24px] text-center">Academic Pathways</h2>
      <div className="lg:flex lg:gap-5 lg:mx-auto">
          {academicLevels.map((item) =>
            <div className="relative overflow-hidden">
              <img src={item.imgUrl} alt="" className="object-cover rounded-2xl mx-auto z-0" />
              <div className="text-white absolute inset-0 z-20 flex flex-col justify-end items-center pb-7">
                <p className="text-[32px] font-semibold">{item.level}</p>
                <p className="italic">{item.grades}</p>
              </div>
          </div>
          )}          
      </div>
    </section>

    <section className="flex flex-col w-full text-center gap-2">
      <h2 className="text-[18px]">Experience the world of SLA</h2>
      <h2 className="text-[20px] font-semibold text-sla-blue">Begin your journey with us <span className="italic">today.</span></h2>
      <div className="flex flex-col lg:flex-row">

        <div className="relative overflow-hidden inline-block">
            <img src="/pre-elementary.svg" alt="" className="object-cover z-0 mx-auto"/>



            <div className="absolute inset-0 flex flex-col text-white items-center justify-center">
              <h1 className="text-4xl font-bold font-montserrat">St. Louisse Academy</h1>
              <p className="text-lg font-poppins">Excellence in Education</p>
            </div>
        </div>
        <div>

        </div>
      </div>
    </section>

    </div>
  );
}