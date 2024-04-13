"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { handleRegisterSubmit } from "@/app/lib/actions"
import Link from "next/link"

import { useState } from "react"

export default function Page() {
  const [username, setUsername] = useState("")

  return (
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
        <Input
          type="text"
          id="login"
          name="login"
          placeholder="Username"
          onInput={({ target }: any) => {
            setUsername(target.value)
          }}
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

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="passwordConfirm">Password confirm</Label>
        <Input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          placeholder="Password confirm"
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="org">Org</Label>
        <Input
          type="text"
          id="org"
          name="org"
          placeholder="Organization name"
          defaultValue={username}
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit">Register</Button>
      </div>

      <div className="text-center">
        Alreadfy have an account? Click{" "}
        <Link href="/login" className="font-bold text-primary">
          here
        </Link>{" "}
        to log in
      </div>
    </form>
  )
}
