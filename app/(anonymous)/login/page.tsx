"use client";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { env } from "next-runtime-env";
import { SubmitButton } from "@/components/SubmitButton";

export default function LoginPage() {
  const registrationPossible = !env("NEXT_PUBLIC_PREVENT_REGISTRATION");
  const loginHint = env("NEXT_PUBLIC_LOGIN_HINT");

  const [state, action] = useFormState(loginAction, {
    message: "",
  });

  return (
    <form
      action={action}
      className="flex flex-col items-center gap-4 max-w-xl mx-auto my-6"
    >
      <h2 className="text-4xl">Login</h2>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
        />
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

      {loginHint ?? <div className="text-xs">{loginHint}</div>}

      <div className="flex justify-center">
        <SubmitButton text="login" />
      </div>

      {state.message ?? <p className="text-red-600">{state?.message}</p>}

      {registrationPossible ?? (
        <div className="text-center">
          Don't have an account? Click{" "}
          <Link href="/register" className="text-primary font-bold">
            here
          </Link>{" "}
          to register
        </div>
      )}
    </form>
  );
}
