"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { sendEmailToUser } from "./actions";

import WelcomeEmail from "@/components/shared/email-template";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");

  const sendEmail = useMutation({
    mutationFn: (data: { email: string; firstName: string }) =>
      sendEmailToUser(data.email, data.firstName),

    onSuccess: () => {
      toast.success("Email sent!");
    },

    onError: (error) => {
      toast.error(error.message || "Failed to send email");
    },
  });

  const handleSubmit = () => {
    // 2. Invoke .mutate() and pass the current state values
    sendEmail.mutate({ email, firstName });
  };

  return (
    <div className="w-[30%] mx-auto mt-10 space-y-3">
      <Label>Enter email</Label>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Label>Enter First Name</Label>
      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Button className="w-full" onClick={handleSubmit}>
        Send Email
      </Button>

      <WelcomeEmail></WelcomeEmail>
    </div>
  );
}
