import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function RegistrarDashboard() {

    const router = useRouter();

    const quickActions = [
        {action: "Enrollment", link: "/enrollment"},
        {action: "Payment", link: "/payments"},
        {action: "Payroll", link: "/"}
    ]

    return(
        <div className="w-full mt-10 flex gap-10">

            {/* Left Container */}
            <div className="w-[75%] flex flex-col gap-10">

                {/* Quick Information */}
                <div className="w-full flex gap-10">
                    <Card 
                        className="w-full max-w-lg space-y-2 pb-12 hover:scale-102 transition-transform"
                        onClick={() => router.push("/students")}
                    >
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-5xl font-semibold">401</h3>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-lg space-y-2 pb-12 hover:scale-102 transition-transform">
                        <CardHeader>
                            <CardTitle>Current Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-5xl font-semibold">21</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Lower Container */}
                <div className="w-full flex gap-10">

                    {/* Graph or Table */}
                    <div className="w-[80%] h-100 bg-white">

                    </div>

                    {/* Quick Links */}
                    <div className="w-[20%] flex flex-col gap-2">
                        {quickActions.map((q, index) => (
                            <Button 
                                key={index}
                                onClick={() => router.push(q.link)}
                                className="h-20 transition-transform hover:scale-102"
                            >{q.action}</Button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Upcoming Events */}
            <div className="w-[25%]">   
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Upcoming Dates</CardTitle>
                        <CardDescription>
                            Review important dates
                        </CardDescription>
                        <CardAction>
                            <Button variant="link">View in Calendar</Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <p>August</p>
                            <p>Aug 21 | Parents Orientation</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">

                    </CardFooter>
                </Card>
            </div>
            
        </div>
    );
}