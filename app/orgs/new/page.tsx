import { handleOrgSubmit } from "@/app/lib/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Page() {
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

      <div className="flex justify-center">
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
