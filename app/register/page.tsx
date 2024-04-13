import {
  createOrg,
  getUserInfo,
  setTokenCookie,
  updateOrgMemberRole,
} from "@/app/lib/actions"
import { redirect } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createUser } from "@/app/lib/actions"
import Link from "next/link"

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server"

    const login = formData.get("login") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const passwordConfirm = formData.get("passwordConfirm") as string

    if (passwordConfirm !== password) throw "Password confirm does not match"

    // Problem: org name might be taken already
    const { orgId } = await createOrg(login as string)

    const newUser = {
      name,
      email,
      login,
      password,
      OrgId: orgId,
    }

    const { id: userId } = await createUser(newUser)

    await updateOrgMemberRole(orgId, userId, "Admin")

    const user = await getUserInfo(name)

    await setTokenCookie(user)

    redirect("/orgs")
  }

  return (
    <form
      action={handleSubmit}
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
          id="name"
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
        <Button type="submit">Register</Button>
      </div>

      <div className="text-center">
        Alreadfy have an account? Click <Link href="/login">here</Link> to log
        in
      </div>
    </form>
  )
}
