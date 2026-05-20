import AcademicsConfiguration from "@/components/admin/configuration/Academics";
import SchoolFeesConfiguration from "@/components/admin/configuration/SchoolFees";
import DiscountsConfiguration from "@/components/admin/configuration/Discounts";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default async function Fees() {
    return(
        <div className="mt-20 px-20">
            <h2 className="text-[28px] font-semibold">System Configuration</h2>
            <p>Manage global settings, tuition fee structures, and active discount.</p>

            <Tabs className="mt-10">
                <TabsList>
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="fees">School Fees</TabsTrigger>
                    <TabsTrigger value="discounts">Discounts</TabsTrigger>
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
            </Tabs>

        </div>
    );
}