import * as React from "react";

interface EnrollmentEmailProps {
  firstName: string;
}

export default function EnrollmentEmail({ firstName }: EnrollmentEmailProps) {
  return (
    <div>
      <h1>Hi {firstName} !</h1>
    </div>
  );
}
