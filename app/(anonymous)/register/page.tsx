"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { env } from "next-runtime-env";

import { registerUserAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    login: z.string().min(1, "Username is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export default function RegisterPage() {
  const registrationDisabled = env("NEXT_PUBLIC_PREVENT_REGISTRATION");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [state, action, pending] = useActionState(registerUserAction, undefined);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => action(values));
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {registrationDisabled ? (
          <p className="text-sm text-muted-foreground">
            User registration is disabled on this instance.
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : "Register"}
              </Button>
            </form>
          </Form>
        )}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary">
            Login here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
