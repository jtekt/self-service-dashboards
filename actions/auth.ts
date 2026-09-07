"use server";
import { GRAFANA_DEFAULT_ORG_ID } from "@/config";
import { createSession, deleteSession } from "@/lib/session";
import { checkUserCredentials, createUser, getUserInfo } from "@/lib/users";
import { redirect } from "next/navigation";

type FormState = { message: string };

function errorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message || fallback
  );
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username) return { message: "Missing username" };
  if (!password) return { message: "Missing password" };

  const credentials = {
    username,
    password,
  };

  try {
    await checkUserCredentials(credentials);
    const user = await getUserInfo(credentials.username);
    await createSession(user);
  } catch (error: unknown) {
    console.error(error);
    return { message: errorMessage(error, "Login failed") };
  }

  redirect("/orgs");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function registerUserAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const missingProperties = [
    "login",
    "name",
    "email",
    "password",
    "passwordConfirm",
  ].filter((k) => !formData.get(k));
  if (missingProperties.length)
    return { message: `Missing ${missingProperties.join(", ")}` };

  const login = formData.get("login") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (passwordConfirm !== password)
    return { message: "Passwords do not match" };

  const newUser = {
    name,
    email,
    login,
    password,
    OrgId: Number(GRAFANA_DEFAULT_ORG_ID),
  };

  try {
    await createUser(newUser);
    const user = await getUserInfo(login);
    await createSession(user);
  } catch (error) {
    console.error(error);
    return { message: "User creation failed" };
  }

  redirect("/orgs");
}
