import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized Access | St. Louisse Academy",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center space-y-6">
        {/* Icon Container with subtle warning ring */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-10 w-10" />
        </div>

        {/* Heading & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have the required permissions or administrative clearance
            to view this page. If you believe this is an error, please contact
            your system administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
