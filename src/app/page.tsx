


export default function Home() {
const academicLevels = [
  {id:1, level:"Pre-Elementary", grades:"Nursery, Kindergarten 1 & 2", imgUrl: "/pre-elementary.svg"},
  {id:2, level:"Elementary", grades:"Grades 1 to 6", imgUrl: "/elementary.svg"},
  {id:3, level:"Junior High", grades:"Grades 7 to 10", imgUrl: "/junior-high.svg"}
];

  return(
    <div className="flex flex-col gap-20">

    <section>
      <div className="relative overflow-hidden text-white">
        <img src="/landing-hero.svg" alt="" className="object-cover h-[85vh] w-full lg:h-[90vh]"/>
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center">
          <h1>WELCOME TO ST. LOUISSE ACADEMY</h1>
          <div className="text-[48px] italic font-semibold lg:text-[72px]">
            <p><span className="text-sla-gold">S</span>trive.</p>
            <p><span className="text-sla-gold">L</span>earn.</p>
            <p><span className="text-sla-gold">A</span>ccomplish.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section>

    </section>

    <section className="bg-sla-blue p-5 py-20 text-white">
      <div className="lg:w-[80%] lg:mx-auto">
        <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-medium font-garamond lg:text-[32px]">Campus Bulletin</h2>
        <button className="text-[12px] text-sla-blue bg-white py-2 px-6 rounded-2xl font-semibold">View More</button>
      </div>
      <p className="mt-1 font-light text-[14px] lg:text-[16px]">Discover on-campus events for students, parents, and visitors.</p>
      <div className="mt-5">
        <div className="w-70 h-50 bg-gray-muted relative overflow-hidden">
          <div className="absolute inset-0 z-20 flex justify-start items-end m-3">
            <button className="text-[14px] border border-white px-3 py-1 rounded-2xl">Read Announcement</button>
          </div>
        </div>
      </div>
      </div>
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

      </div>
    </section>

    </div>
  );
}