

import FeesInput from "@/components/admin/configure/fees";
import ConfigureBooks from "@/components/admin/configure/books";
import ConfigureGradeLevels from "@/components/admin/configure/GradeLevels";

export default function Fees() {



    return(
        <div>
            <FeesInput/>
            <ConfigureBooks/>
            <ConfigureGradeLevels/>
        </div>
    );
}