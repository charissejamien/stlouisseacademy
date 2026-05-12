

export default function Heading() {

    const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return(
        <div className="text-white bg-gradient-to-r from-sla-blue to-[#5994e4] p-10 rounded-md w-full">
            <p className="text-[14px] text-gray-300">{date}</p>
            <h2 className="text-[24px] font-medium mt-10">Welcome back, Charito!</h2>
            <p className="text-[14px] text-gray-300 font-light tracking-wide mt-1">Always stay updated in your school system.</p>
        </div>
    );
}