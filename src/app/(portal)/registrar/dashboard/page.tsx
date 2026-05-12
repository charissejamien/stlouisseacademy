import Heading from "@/components/shared/Heading";
import Widgets from "@/components/registrar/dashboard/Widgets";

export default function Dashboard(){
    return(
        <div className="w-[80%] mx-auto mt-10 flex flex-col gap-10">
            <Heading/>
            <Widgets/>
        </div>
    );
}