import { addUserToOrg, createOrg } from "@/app/lib/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server"

    const head = headers()

    const stringifiedUser = head.get("X-User")
    if (!stringifiedUser) throw "No user"
    const user = JSON.parse(stringifiedUser)

    const name = formData.get("name")
    if (!name) throw "Name not defined"
    const { orgId } = await createOrg(name as string)

    await addUserToOrg(user.login, orgId, "Admin")
    redirect("/orgs")
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col items-center gap-4 max-w-xl mx-auto my-6"
    >
      <h2 className="text-4xl">Create a new organization</h2>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Organization name"
        />
      </div>

      <div className="flex justify-center">
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
