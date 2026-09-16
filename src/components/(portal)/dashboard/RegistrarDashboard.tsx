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
        {action: "Payroll", link: "/payroll"}
    ]

    const upcomingEvents = [
        {
            month: "August",
            events: [
                { date: "21", title: "Parent's Orientation" },
                { date: "22", title: "Student's Orientation" },
                { date: "23", title: "Faculty Orientation" },
            ]
        },
        {
            month: "September",
            events: [
                { date: "3", title: "Examination" },
                { date: "11", title: "PTA Meeting" },
            ]
        }
    ];

    return(
        <div className="w-full mt-10 flex gap-10">

            {/* Left Container */}
            <div className="w-[75%] flex flex-col gap-10">

                {/* Quick Information */}
                <div className="w-full flex gap-3">
                    <Card 
                        className="w-full space-y-2 pb-7 hover:scale-102 transition-transform cursor-pointer"
                        onClick={() => router.push("/students")}
                    >
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-5xl font-semibold">401</h3>
                        </CardContent>
                    </Card>
                    <Card className="w-full space-y-2 pb-7 hover:scale-102 transition-transform cursor-pointer"
                    onClick={() => router.push("/employees")}>
                        <CardHeader>
                            <CardTitle>Current Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-5xl font-semibold">21</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Lower Container */}
                <div className="w-full">

                    {/* Quick Links */}
                    <div className="flex w-fit justify-between gap-1">
                        {quickActions.map((q, index) => (
                            <Button 
                                key={index}
                                onClick={() => router.push(q.link)}
                                className="h-20 w-full transition-transform hover:scale-102"
                            >{q.action}</Button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Upcoming Events */}
            <div className="w-[25%]">   
                <Card className="w-full shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="text-xl font-bold">Upcoming Dates</CardTitle>
                            <CardDescription>
                                Review important dates
                            </CardDescription>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pb-45">
                        {upcomingEvents.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1 block">
                                    {group.month}
                                </span>
                                
                                <div className="space-y-2">
                                    {group.events.map((event, eventIdx) => (
                                        <div 
                                            key={eventIdx} 
                                            className="flex items-center gap-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-md px-2.5 py-1 min-w-[55px]">
                                                <span className="text-xs font-semibold leading-tight">{event.date}</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 leading-tight">
                                                {event.title}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="pt-0" />
                </Card>
            </div>
            
        </div>
    );
}