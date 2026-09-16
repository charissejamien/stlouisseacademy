import { Table, TableHeader, TableRow, TableBody, TableHead } from "@/components/ui/table";

export default function GradesKS2() {

    const writtenWorks = ["1", "2", "3", "4", "5", "Total", "PS", "WS"];
    const productTasks = ["1", "2", "3", "Total", "PS", "WS"];
    const summativeTests = ["1", "2", "3", "4", "5", "Total", "PS", "WS"];

    return(
        <div className="space-y-5">
            <div className="flex justify-between">
                <p>TERM 1</p>
                <p>GRADE & SECTION: 7-A EINSTEIN</p>
                <p>TEACHER: </p>
                <p>SUBJECT: PE AND HEALTH</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Learner's Name</TableHead>
                        <TableHead className="text-center">
                            Written / Oral Works (20%)
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {writtenWorks.map((w) => (
                                            <TableHead className="border text-center">{w}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </TableHead>
                        <TableHead>
                            Product / Performance Tasks (60%)
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {productTasks.map((p) => (
                                            <TableHead className="border text-center">{p}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </TableHead>
                        <TableHead>
                            Summative Tests and Term Examinations (20%)
                            <Table className="border">
                                <TableHeader>
                                    <TableRow>
                                        {summativeTests.map((s) => (
                                            <TableHead className="border text-center">{s}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </TableHead>
                        <TableHead>Initial Grade</TableHead>
                        <TableHead>Term Grade</TableHead>
                        <TableHead>Descriptor</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        </div>
    );
}