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

type NewUser = {
  login: string
  password: string
  email: string
  name: string
  OrgId?: number
}

export async function createUser(newUser: NewUser) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }
  const url = `${GRAFANA_URL}/api/admin/users`
  const { data } = await axios.post(url, newUser, { auth })
  return data
}

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

export async function login(credentials: Credentials) {
  await checkUserCredentials(credentials)
  const user = await getUserInfo(credentials.username)
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

export async function handleRegisterFormSubmit(formData: FormData) {
  const login = formData.get("login") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string
  const org = formData.get("org") as string

  if (!login) throw "Missing login"
  if (!name) throw "Missing name"
  if (!email) throw "Missing email"
  if (!password) throw "Missing password"
  if (!passwordConfirm) throw "Missing passwordConfirm"
  if (!org) throw "Missing org"

  if (passwordConfirm !== password) throw "Password confirm does not match"

  // Problem: org name might be taken already
  // UUID would not be user-friendly
  const { orgId } = await createOrg(org as string)

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
