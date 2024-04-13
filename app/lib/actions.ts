"use server"
import { cookies } from "next/headers"
import axios from "axios"
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
  encodedJwtSecret,
  TOKEN_COOKIE,
} from "@/config"
import * as jose from "jose"
import { redirect } from "next/navigation"

type Credentials = {
  username: string
  password: string
}

type Role = "Viewer" | "Admin" | "Editor"

async function checkUserCredentials(auth: Credentials) {
  // TODO: find better endpoint
  const url = `${GRAFANA_URL}/api/dashboards/home`

  await axios.get(url, { auth })
}

export async function getUserInfo(username: String) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  const url = `${GRAFANA_URL}/api/users/lookup`

  const params = { loginOrEmail: username }

  const { data } = await axios.get(url, { auth, params })
  return data
}

export async function setTokenCookie(user: any) {
  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedJwtSecret)

  cookies().set(TOKEN_COOKIE, token)
}

export async function login(formData: FormData) {
  "use server"

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username) throw "Missing username"
  if (!password) throw "Missing password"

  const credentials = {
    username,
    password,
  }

  await checkUserCredentials(credentials)
  const user = await getUserInfo(username)
  await setTokenCookie(user)

  redirect("/orgs")
}

export async function createOrg(name: string) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }
  const url = `${GRAFANA_URL}/api/orgs`
  try {
    const { data } = await axios.post(url, { name }, { auth })
    return data
  } catch (error: any) {
    console.log(error.response?.data)
    throw "Failed to create org"
  }
}

export async function addUserToOrg(
  loginOrEmail: string | number,
  orgId: string | number,
  role: Role
) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  const url = `${GRAFANA_URL}/api/orgs/${orgId}/users`
  const { data } = await axios.post(url, { loginOrEmail, role }, { auth })
  return data
}

export async function updateOrgMemberRole(
  orgId: string | number,
  userId: string | number,
  role: Role
) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  const url = `${GRAFANA_URL}/api/orgs/${orgId}/users/${userId}`

  try {
    const { data } = await axios.patch(url, { role }, { auth })
    return data
  } catch (error: any) {
    console.log(error.response?.data)
    throw "Failed to update member role"
  }
}
