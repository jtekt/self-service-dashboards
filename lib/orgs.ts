import {
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_URL,
} from "@/config";
import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Role = "Viewer" | "Admin" | "Editor";

async function createOrg(name: string) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  };
  const url = `${GRAFANA_URL}/api/orgs`;
  const { data } = await axios.post(url, { name }, { auth });
  return data;
}

export async function addUserToOrg(
  loginOrEmail: string | number,
  orgId: string | number,
  role: Role
) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  };

  const url = `${GRAFANA_URL}/api/orgs/${orgId}/users`;
  const { data } = await axios.post(url, { loginOrEmail, role }, { auth });
  return data;
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
  };

  const url = `${GRAFANA_URL}/api/orgs/${orgId}/users/${userId}`;

  const { data } = await axios.patch(url, { role }, { auth });
  return data;
}

export async function createOrgForUser(prevState: any, formData: FormData) {
  const head = headers();

  const stringifiedUser = head.get("X-User");
  if (!stringifiedUser) throw new Error("No user in X-User header");
  const user = JSON.parse(stringifiedUser);

  const name = formData.get("name");
  if (!name) return { message: "Missing name" };

  try {
    const { orgId } = await createOrg(name as string);
    await addUserToOrg(user.login, orgId, "Admin");
  } catch (error: any) {
    console.error(error);
    return { message: error.response?.data?.message || "Org creation failed" };
  }

  redirect("/orgs");
}
