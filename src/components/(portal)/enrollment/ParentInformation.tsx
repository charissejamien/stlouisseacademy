"use client";

import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { searchParents } from "@/app/(portal)/enrollment/actions";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnrollmentFormValues } from "./EnrollmentForm";

const suffixes = ["Jr.", "II", "III", "IV", "V"] as const;
const genders = ["Male", "Female"] as const;

type ParentRecord = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix?: "Jr." | "II" | "III" | "IV" | "V" | null;
  gender?: "Male" | "Female" | null;
  address: string | null;
  contact_number: string | null;
  email: string | null;
};

type ParentInformationProps = {
  form: UseFormReturn<EnrollmentFormValues>;
  isPending: boolean;
  onPrevious: () => void;
  onContinue: () => void;
};

export default function ParentInformation({
  form,
  isPending,
  onPrevious,
  onContinue,
}: ParentInformationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ParentRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await searchParents(query);
    setSearchResults(results as ParentRecord[]);
    setIsSearching(false);
  }

  function handleSelectParent(parent: ParentRecord) {
    form.setValue("parent_id", parent.id, { shouldDirty: true });
    form.setValue("parent_first_name", parent.first_name || "", {
      shouldDirty: true,
    });
    form.setValue("parent_middle_name", parent.middle_name || "", {
      shouldDirty: true,
    });
    form.setValue("parent_last_name", parent.last_name || "", {
      shouldDirty: true,
    });
    form.setValue("parent_suffix", parent.suffix || undefined, {
      shouldDirty: true,
    });
    form.setValue("parent_gender", parent.gender || undefined, {
      shouldDirty: true,
    });
    form.setValue("parent_address", parent.address || "", {
      shouldDirty: true,
    });
    form.setValue("parent_contact_number", parent.contact_number || "", {
      shouldDirty: true,
    });
    form.setValue("parent_email", parent.email || "", { shouldDirty: true });

    setSearchResults([]);
    setSearchQuery(`${parent.first_name} ${parent.last_name}`);
  }

  return (
    <div className="bg-card rounded-lg p-5 space-y-6">
      <div className="border-b pb-4 relative">
        <FieldTitle className="text-muted-foreground mb-2">
          Lookup Existing Parent
        </FieldTitle>
        <p className="text-xs text-muted-foreground mb-3">
          If this parent already has a student enrolled, search by name or
          contact number to auto-fill.
        </p>
        <Input
          placeholder="Search parent name or contact number..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
        />

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-background border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
            {searchResults.map((parent) => (
              <div
                key={parent.id}
                className="p-3 hover:bg-muted cursor-pointer text-sm border-b last:border-none flex justify-between items-center"
                onClick={() => handleSelectParent(parent)}
              >
                <div>
                  <p className="font-medium">
                    {parent.first_name} {parent.middle_name || ""}{" "}
                    {parent.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Contact: {parent.contact_number || "N/A"} | Email:{" "}
                    {parent.email || "N/A"}
                  </p>
                </div>
                <Button size="sm" type="button" variant="outline">
                  Select
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FieldSet className="gap-4">
        <FieldTitle className="text-muted-foreground">
          Parent Information
        </FieldTitle>

        <FieldGroup className="flex-row gap-3">
          <Controller
            name="parent_first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  disabled={isPending}
                  placeholder="John"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent_middle_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Middle Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  disabled={isPending}
                  placeholder="Joseph"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent_last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  disabled={isPending}
                  placeholder="Doe"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent_suffix"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Suffix</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id={field.name} disabled={isPending}>
                    <SelectValue placeholder="Select Suffix" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {suffixes.map((suffix) => (
                      <SelectItem key={suffix} value={suffix}>
                        {suffix}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex-row gap-3">
          <Controller
            name="parent_gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id={field.name} disabled={isPending}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent_address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Home Address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  disabled={isPending}
                  placeholder="123 Rizal Street"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup className="flex-row gap-3">
          <Controller
            name="parent_contact_number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  id={field.name}
                  disabled={isPending}
                  placeholder="09XXXXXXXXX"
                  maxLength={11}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="parent_email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  disabled={isPending}
                  placeholder="name@email.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button type="button" disabled={isPending} onClick={onContinue}>
          Continue to Fee Settlement
        </Button>
      </div>
    </div>
  );
}
