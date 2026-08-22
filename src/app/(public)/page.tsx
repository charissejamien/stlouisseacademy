import Image from "next/image";

export default function Home() {
  const academicLevels = [
    {id:1, level:"Pre-Elementary", grades:"Nursery, Kindergarten 1 & 2", imgUrl: "/pre-elementary.svg"},
    {id:2, level:"Elementary", grades:"Grades 1 to 6", imgUrl: "/elementary.svg"},
    {id:3, level:"Junior High", grades:"Grades 7 to 10", imgUrl: "/junior-high.svg"}
  ];

  return (
    <div className="flex flex-col bg-white">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden text-white bg-slate-900">
        <Image src={"/admissions-bg.svg"} alt="" width={30} height={30} className="object-cover h-[85vh] w-full lg:h-screen"/>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center">
          <h1 className="drop-shadow-md tracking-wider">WELCOME TO ST. LOUISSE ACADEMY</h1>
          <div className="text-[48px] italic font-semibold lg:text-[72px] drop-shadow-lg">
            <p><span className="text-sla-gold">S</span>trive.</p>
            <p><span className="text-sla-gold">L</span>earn.</p>
            <p><span className="text-sla-gold">A</span>ccomplish.</p>
          </div>
        </div>
      </section>

      <section className="w-full text-white py-20 px-5 relative z-20">
        <div className="mx-auto flex flex-col gap-8">
          <h2 className="font-serif text-[28px] text-center text-foreground tracking-wide">
            Academic Pathways
          </h2>
          
          {/* 1. Main container set to width 90% and configured as a 3-column layout grid */}
          <div className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {academicLevels.map((item) => (
              /* 2. Each card is given relative positioning and a fixed height of 400px */
              <div 
                key={item.id} 
                className="relative h-[600px] w-full overflow-hidden shadow-xl group rounded-2xl border border-white/10"
              >
                {/* 3. The Image now fills the 400px high box perfectly without distortion */}
                <Image 
                  src={item.imgUrl} 
                  alt={item.level} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Gradient text overlay */}
                <div className="text-white absolute inset-0 z-20 flex flex-col justify-end items-center pb-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <p className="text-[32px] font-bold drop-shadow-md">{item.level}</p>
                  <p className="italic text-gray-200 text-sm drop-shadow mt-1">{item.grades}</p>
                </div>
              </div>
            ))}          
          </div>
        </div>
      </section>

      <section className="w-[80%] mx-auto rounded-xl flex flex-col md:flex-row h-auto md:h-[500px] overflow-hidden shadow-md bg-[#0961b8]">
        <div className="relative w-full md:w-1/2 h-64 md:h-full">
          <Image 
            src="/admissions-bg.svg" 
            alt="Students at St. Louisse Academy" 
            fill 
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-sla-blue p-8 md:p-12 flex flex-col justify-center text-white">
          <span className="text-[24px] font-bold uppercase tracking-widest text-sla-gold mb-2 block">
            Why SLA?
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide mb-4">
            Quality Education, Made Accessible
          </h2>
          <div className="space-y-4 text-blue-100 text-sm md:text-base font-light leading-relaxed">
            <p>
              St. Louisse Academy is a proud ESC-Certified Institution, partnering with the 
              Department of Education to provide premium private education at a subsidized cost.
            </p>
            <p>
              As an ESC-Certified school, our incoming Grade 7 students can apply for a tuition grant
              that significantly reduces the cost of their yearly schooling.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 space-y-10">
        {/* Intro */}
        <div className="w-full max-w-3xl mx-auto px-6 text-center italic text-lg leading-relaxed">
          <p>
            School is a place to be curious, to take initiative, and to discover
            new experiences in a community built on trust, respect, and kindness.
            We invite everyone to grasp the wonderful opportunities offered by
            St. Louisse Academy with enthusiasm and an open mind.
          </p>
        </div>

        {/* Gallery */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 px-3 sm:px-5">
          
          {/* Column 1 */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-5 mt-8 lg:mt-10">
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
          </div>

          {/* Column 3 */}
          <div className="hidden sm:block space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
          </div>

          {/* Column 4 */}
          <div className="hidden lg:block space-y-3 sm:space-y-4 lg:space-y-5 mt-10">
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
          </div>

          {/* Column 5 */}
          <div className="hidden lg:block space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
            <div className="aspect-[3/2] w-full bg-foreground overflow-hidden">
              {/* image */}
            </div>
          </div>

        </div>
      </section>



      {/* 5. FOOTER GATEWAYS */}
      <section className="flex flex-col w-full text-center gap-4 py-20 bg-slate-50 border-t border-slate-100">
        <div>
          <h2 className="text-[32px] text-slate-500">Experience the world of SLA</h2>
          <h2 className="text-[22px] font-semibold text-[#004C97] mt-1">Begin your journey with us <span className="italic">today.</span></h2>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 px-5">
            <div className="bg-white border border-slate-200 py-40 px-60 rounded-xl shadow-sm sm:w-64 cursor-pointer hover:border-[#004C97] transition-colors flex justify-center">
              <h2 className="font-bold text-[#004C97] text-lg ">Admissions</h2>
            </div>
            <div className="bg-white border border-slate-200 py-40 px-60 rounded-xl shadow-sm sm:w-64 cursor-pointer hover:border-[#004C97] transition-colors flex justify-center">
              <h2 className="font-bold text-[#004C97] text-lg">Careers</h2>
            </div>
        </div>
      </section>

    </div>
  );
}