"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserAction } from "@/actions/auth";
import { useFormState } from "react-dom";
import { env } from "next-runtime-env";

import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";

export default function RegisterPage() {
  const [state, handleRegisterSubmit] = useFormState(registerUserAction, {
    message: "",
  });

  const registrationPossible = !env("NEXT_PUBLIC_PREVENT_REGISTRATION");

  return (
    <>
      {registrationPossible ? (
        <form
          action={handleRegisterSubmit}
          className="flex flex-col items-center gap-4 max-w-xl mx-auto my-6"
        >
          <h2 className="text-4xl">Register</h2>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" placeholder="Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" placeholder="Name" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="login">Username</Label>
            <Input type="text" id="login" name="login" placeholder="Username" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="passwordConfirm">Password confirm</Label>
            <Input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Password confirm"
            />
          </div>

          <div className="flex justify-center">
            <SubmitButton text="Register" />
          </div>

          {state.message ? (
            <p className="text-red-600">{state?.message}</p>
          ) : null}

          <div className="text-center">
            Already have an account? Click{" "}
            <Link href="/login" className="font-bold text-primary">
              here
            </Link>{" "}
            to log in
          </div>
        </form>
      ) : (
        <>
          {registrationPossible === false ? (
            <div>Reigstration is not possible on this instance</div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      )}
    </>
  );
}
