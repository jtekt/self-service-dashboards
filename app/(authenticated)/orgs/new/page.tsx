"use client";
import { createOrgForUser } from "@/actions/orgs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButton";

export default function Page() {
  const [state, handleOrgSubmit] = useFormState(createOrgForUser, undefined);

  return (
    <form action={handleOrgSubmit} className="flex flex-col gap-4">
      <h2 className="text-4xl">Create a new organization</h2>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Organization name"
        />
      </div>

      {state?.message && (
        <p className="text-center text-red-600">{state?.message}</p>
      )}

      <div className="flex justify-center">
        <SubmitButton text="create" />
      </div>
    </form>
  );
}
