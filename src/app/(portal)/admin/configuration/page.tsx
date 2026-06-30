import AcademicsConfiguration from "@/components/admin/configuration/Academics";
import SchoolFeesConfiguration from "@/components/admin/configuration/SchoolFees";
import DiscountsConfiguration from "@/components/admin/configuration/Discounts";
import RegistrarConfiguration from "@/components/admin/configuration/Registrar";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default async function Fees() {
    return(
        <div className="w-[65%] md:w-full mx-auto mt-20 px-20">
            <h2 className="text-[28px] font-semibold">System Configuration</h2>
            <p>Manage global settings, tuition fee structures, and active discount.</p>

            <Tabs className="mt-10" defaultValue="academics">
                <TabsList>
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="fees">School Fees</TabsTrigger>
                    <TabsTrigger value="discounts">Discounts</TabsTrigger>
                    <TabsTrigger value="registrar">Registrar</TabsTrigger>
                </TabsList>

                <TabsContent value="academics">
                    <AcademicsConfiguration/>
                </TabsContent>

                <TabsContent value="fees">
                    <SchoolFeesConfiguration/>
                </TabsContent>

                <TabsContent value="discounts">
                    <DiscountsConfiguration/>
                </TabsContent>

                <TabsContent value="registrar">
                    <RegistrarConfiguration/>
                </TabsContent>
            </Tabs>

        </div>
    );
}