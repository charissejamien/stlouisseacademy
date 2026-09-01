"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryItem {
  id: string;
  name: string;
}

interface ExpenseRowItem {
  amount: number;
  expenses_category?: { name: string }[] | { name: string } | null;
}

interface ExpensesOverviewProps {
  categories?: CategoryItem[];
  allExpenses?: ExpenseRowItem[];
}

export default function ExpensesOverview({
  categories,
  allExpenses = [],
}: ExpensesOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const formatCurrency = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Calculate filtered aggregate total
  const filteredTotal = allExpenses.reduce((sum, item) => {
    const cat = Array.isArray(item.expenses_category)
      ? item.expenses_category[0]?.name
      : item.expenses_category?.name;

    if (
      selectedCategory === "all" ||
      cat?.toLowerCase() === selectedCategory.toLowerCase()
    ) {
      return sum + Number(item.amount || 0);
    }
    return sum;
  }, 0);

  return (
    <Card className="shadow-sm border bg-white flex flex-col h-full overflow-hidden">
      {/* <CardHeader className="pb-3 border-b bg-muted/30 shrink-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base font-semibold text-foreground">
            Expenses Summaries per Category
          </CardTitle>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter by Category
          </label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-sm py-2 border-b">
            <span className="font-medium text-muted-foreground">
              Category Filter Active:
            </span>
            <span className="font-bold uppercase text-foreground">
              {selectedCategory === "all" ? "All Categories" : selectedCategory}
            </span>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Whole Total
              </p>
              <p className="text-xl font-bold text-red-600 mt-0.5">
                {formatCurrency(filteredTotal)}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Filtered Aggregate
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center py-2">
            Select a category above to view grouped disbursement totals.
          </p>
        </div>
      </CardContent> */}
    </Card>
  );
}
