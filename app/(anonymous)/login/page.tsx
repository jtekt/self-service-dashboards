"use client";

import Link from "next/link";
import { useActionState } from "react";
import { env } from "next-runtime-env";

import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitButton } from "@/components/SubmitButton";

export default function LoginPage() {
  const registrationPossible = !env("NEXT_PUBLIC_PREVENT_REGISTRATION");
  const loginHint = env("NEXT_PUBLIC_LOGIN_HINT");

  const [state, action] = useActionState(loginAction, { message: "" });

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>

          {loginHint && (
            <p className="text-xs text-muted-foreground">{loginHint}</p>
          )}

          <SubmitButton text="Login" />

          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          {registrationPossible && (
            <p className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-primary">
                Register here
              </Link>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
