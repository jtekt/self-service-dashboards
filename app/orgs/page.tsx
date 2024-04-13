import axios from "axios"
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
} from "../../config"
import { headers } from "next/headers"

async function getData() {
  const head = headers()

  const stringifiedUser = head.get("X-User")
  if (!stringifiedUser) throw "No user"

  const user = JSON.parse(stringifiedUser)

  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  // TODO: list orgs of user

  const url = `${GRAFANA_URL}/api/users/${user.id}/orgs`
  const { data } = await axios.get(url, { auth })
  return data
}

export default async function Page() {
  const data = await getData()

  return (
    <main>
      <h1 className="text-4xl my-4">My Organizations</h1>
      <ul>
        {data.map((org: any) => (
          <li>{org.name}</li>
        ))}
      </ul>
    </main>
  )
}
