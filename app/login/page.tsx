"use client"
import { handleLoginSubmit } from "@/app/lib/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <form
      action={handleLoginSubmit}
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

      <div className="flex justify-center">
        <Button type="submit">Login</Button>
      </div>

      <div className="text-center">
        Don't have an account? Click{" "}
        <Link href="/register" className="text-primary font-bold">
          here
        </Link>{" "}
        to register
      </div>
    </form>
  )
}
