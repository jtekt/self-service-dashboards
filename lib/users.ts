import {
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_DEFAULT_ORG_ID,
  GRAFANA_URL,
} from "@/config";
import axios from "axios";

type NewUser = {
  login: string;
  password: string;
  email: string;
  name: string;
  OrgId?: number;
};

type Credentials = {
  username: string;
  password: string;
};

export async function checkUserCredentials(auth: Credentials) {
  // Using basic auth to check if the user provided credentials are correct
  // TODO: find better endpoint
  const url = `${GRAFANA_URL}/api/dashboards/home`;
  await axios.get(url, { auth });
}

export async function createUser(newUser: NewUser) {
  // https://grafana.com/docs/grafana/latest/developers/http_api/admin/#global-users
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  };
  const url = `${GRAFANA_URL}/api/admin/users`;
  try {
    const { data } = await axios.post(url, newUser, { auth });
    return data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error("User creation failed");
  }
}

export async function getUserInfo(loginOrEmail: String) {
  // Used after login or registration to create content of JWT
  // The request must be sent authenticated as admin
  // https://grafana.com/docs/grafana/latest/developers/http_api/user/#get-single-user-by-usernamelogin-or-email
  const auth = {
    username: GRAFANA_ADMIN_USERNAME,
    password: GRAFANA_ADMIN_PASSWORD,
  };

  const url = `${GRAFANA_URL}/api/users/lookup`;

  const params = { loginOrEmail };

  const { data } = await axios.get(url, { auth, params });
  return data;
}
