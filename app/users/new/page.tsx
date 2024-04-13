import axios from "axios"
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
} from "../../../config"
import {
  createOrg,
  getUserInfo,
  setTokenCookie,
  updateOrgMemberRole,
} from "@/app/lib/actions"
import { redirect } from "next/navigation"

const auth = {
  username: GRAFANA_ADMIN_USERNAME,
  password: GRAFANA_ADMIN_PASSWORD,
}

type NewUser = {
  login: string
  password: string
  email: string
  name: string
  OrgId?: number
}
export async function createUser(newUser: NewUser) {
  const url = `${GRAFANA_URL}/api/admin/users`
  const { data } = await axios.post(url, newUser, { auth })
  return data
}

export default function Page() {
  async function createInvoice(formData: FormData) {
    "use server"

    const login = formData.get("login") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

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
    <form action={createInvoice}>
      <div>
        <label>Name</label>
        <input type="text" name="name" className="bg-black border-white" />
      </div>
      <div>
        <label>E-mail</label>
        <input type="text" name="email" className="bg-black border-white" />
      </div>
      <div>
        <label>Username</label>
        <input type="text" name="login" className="bg-black border-white" />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="bg-black border-white"
        />
      </div>
      <button type="submit">Register</button>
    </form>
  )
}
