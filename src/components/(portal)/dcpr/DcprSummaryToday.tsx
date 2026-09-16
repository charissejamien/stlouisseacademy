import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownLeft, Wallet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DcprSummaryToday() {
  // Placeholders
  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const totalPayments = 45250.00;
  const totalExpenses = 12800.00;
  const cashOnHand = totalPayments - totalExpenses;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val);

  return (
    <Card className="w-full shadow-sm py-5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">DCPR Summary</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5" />
              {todayDate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Payments Collected */}
          <div className="p-3 rounded-lg border bg-muted/30 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Payments</span>
              <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalPayments)}
              </p>
              <p className="text-xs text-muted-foreground">Collected today</p>
            </div>
          </div>

          {/* Total Expenses Disbursed */}
          <div className="p-3 rounded-lg border bg-muted/30 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
              <div className="p-1.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-xs text-muted-foreground">Disbursed today</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Total Cash on Hand (Hero Card) */}
        <div className="p-4 rounded-xl border bg-primary/3 border-primary/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Cash on Hand
            </span>
            <p className="text-2xl font-black text-primary tracking-tight">
              {formatCurrency(cashOnHand)}
            </p>
          </div>
          <div className="p-2.5 rounded-full bg-primary text-primary-foreground shadow">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}