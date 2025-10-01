import {
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_URL,
} from "@/config";
import axios from "axios";

type Role = "Viewer" | "Admin" | "Editor";

export async function createOrg(name: string) {
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

export async function getUserOrgs(userId: number | string) {
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  };

  const url = `${GRAFANA_URL}/api/users/${userId}/orgs`;
  const { data } = await axios.get(url, { auth });
  return data;
}
