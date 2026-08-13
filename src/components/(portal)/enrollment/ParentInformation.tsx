"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function ParentInformation() {
    return(
        <div>
           <Card className="w-full min-w-3xl mt-10 py-10 pb-20 px-5">
                <CardHeader className="pb-6">
                    <CardTitle>Parent Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">

                    <div className="space-y-4">

                        <div className="flex gap-x-5 gap-y-5">

                            <div className="space-y-2">
                                <Label>First Name <span aria-hidden="true">*</span></Label>
                                <Input/>
                            </div>

                            <div className="space-y-2">
                                <Label>Middle Name</Label>
                                <Input />
                            </div>

                            <div className="space-y-2">
                                <Label>Last Name <span aria-hidden="true">*</span></Label>
                                <Input />
                            </div>

                            <div className="space-y-2">
                                <Label>Suffix</Label>
                                <Select>
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Suffix</SelectLabel>
                                        
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full flex">
                            <div className="space-y-2 w-[30%]">
                                <Label>Gender <span aria-hidden="true">*</span></Label>
                                <Select>
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Gender</SelectLabel>
                                       
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 space-y-2 w-[70%]">
                                <Label>Address <span aria-hidden="true">*</span></Label>
                                <Input />
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="space-y-2 flex-1">
                                <Label>Email</Label>
                                <Input />
                            </div>

                            <div className="space-y-2 flex-1">
                                <Label>Phone Number</Label>
                                <Input />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}