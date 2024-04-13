"use server"
import { cookies } from "next/headers"
import axios from "axios"
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
  GRAFANA_DEFAULT_ORG_ID,
  TOKEN_COOKIE,
  encodedJwtSecret,
} from "@/config"
import * as jose from "jose"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

type Role = "Viewer" | "Admin" | "Editor"

type Credentials = {
  username: string
  password: string
}

type NewUser = {
  login: string
  password: string
  email: string
  name: string
  OrgId?: number
}

async function createUser(newUser: NewUser) {
  // https://grafana.com/docs/grafana/latest/developers/http_api/admin/#global-users
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }
  const url = `${GRAFANA_URL}/api/admin/users`
  try {
    const { data } = await axios.post(url, newUser, { auth })
    return data
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message)
    throw new Error("User creation failed")
  }
}

async function checkUserCredentials(auth: Credentials) {
  // Using basic auth to check if the user provided credentials are correct
  // TODO: find better endpoint
  const url = `${GRAFANA_URL}/api/dashboards/home`
  await axios.get(url, { auth })
}

async function getUserInfo(username: String) {
  // Used after login or registration to create content of JWT
  // The request must be sent authenticated as admin
  // https://grafana.com/docs/grafana/latest/developers/http_api/user/#get-single-user-by-usernamelogin-or-email
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  const url = `${GRAFANA_URL}/api/users/lookup`

  const params = { loginOrEmail: username }

  const { data } = await axios.get(url, { auth, params })
  return data
}

async function createOrg(name: string) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }
  const url = `${GRAFANA_URL}/api/orgs`
  try {
    const { data } = await axios.post(url, { name }, { auth })
    return data
  } catch (error: any) {
    if (error.response?.status === 409)
      throw new Error(`Org "${name}" already exists`)
    throw new Error("Org creation failed")
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
  // Unused
  orgId: string | number,
  userId: string | number,
  role: Role
) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  }

  const url = `${GRAFANA_URL}/api/orgs/${orgId}/users/${userId}`

  const { data } = await axios.patch(url, { role }, { auth })
  return data
}

export async function setTokenCookie(user: any) {
  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .sign(encodedJwtSecret)

  cookies().set(TOKEN_COOKIE, token)
}

export async function handleRegisterSubmit(formData: FormData) {
  const login = formData.get("login") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  // Validation
  // TODO: Use a validation library
  if (!login) throw new Error("Missing login")
  if (!name) throw new Error("Missing name")
  if (!email) throw new Error("Missing email")
  if (!password) throw new Error("Missing password")
  if (!passwordConfirm) throw new Error("Missing passwordConfirm")
  if (passwordConfirm !== password) throw new Error("Passwords do not match")

  const newUser = {
    name,
    email,
    login,
    password,
    OrgId: Number(GRAFANA_DEFAULT_ORG_ID),
  }

  await createUser(newUser)

  const user = await getUserInfo(name)

  await setTokenCookie(user)

  redirect("/orgs")
}

export async function handleOrgSubmit(formData: FormData) {
  const head = headers()

  const stringifiedUser = head.get("X-User")
  if (!stringifiedUser) throw new Error("No user in X-User header")
  const user = JSON.parse(stringifiedUser)

  const name = formData.get("name")
  if (!name) throw "Name not defined"
  const { orgId } = await createOrg(name as string)
  await addUserToOrg(user.login, orgId, "Admin")

  redirect("/orgs")
}

export async function handleLoginSubmit(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username) throw new Error("Missing username")
  if (!password) throw new Error("Missing password")

  const credentials = {
    username,
    password,
  }

  try {
    await checkUserCredentials(credentials)
    const user = await getUserInfo(credentials.username)
    await setTokenCookie(user)
  } catch (error) {
    console.error(error)
    throw new Error("Login failed")
  }

  redirect("/orgs")
}
