import axios from "axios"
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
} from "../../../config"
import { createOrg } from "@/app/lib/actions"

const auth = {
  username: GRAFANA_ADMIN_USERNAME,
  password: GRAFANA_ADMIN_PASSWORD,
}

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server"

    const name = formData.get("name")
    if (!name) throw "Name not defined"
    const orgData = await createOrg(name as string)

    // TODO: add user to org
  }

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        name="name"
        className="bg-black border-white border-solid border-2"
      />
      <button type="submit">Create org</button>
    </form>
  )
}
