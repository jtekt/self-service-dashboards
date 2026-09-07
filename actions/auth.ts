"use server";
import { GRAFANA_DEFAULT_ORG_ID } from "@/config";
import { createSession, deleteSession } from "@/lib/session";
import { checkUserCredentials, createUser, getUserInfo } from "@/lib/users";
import { redirect } from "next/navigation";

type ActionResult = { error: string } | undefined;

function errorMessage(error: unknown, fallback: string): string {
  return (
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message || fallback
  );
}

export async function loginAction(
  _prevState: ActionResult,
  credentials: { username: string; password: string },
): Promise<ActionResult> {
  try {
    await checkUserCredentials(credentials);
    const user = await getUserInfo(credentials.username);
    await createSession(user);
  } catch (error: unknown) {
    console.error(error);
    return { error: errorMessage(error, "Login failed") };
  }

  redirect("/orgs");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}

export async function registerUserAction(
  _prevState: ActionResult,
  values: {
    login: string;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  },
): Promise<ActionResult> {
  if (values.passwordConfirm !== values.password)
    return { error: "Passwords do not match" };

  const newUser = {
    name: values.name,
    email: values.email,
    login: values.login,
    password: values.password,
    OrgId: Number(GRAFANA_DEFAULT_ORG_ID),
  };

  try {
    await createUser(newUser);
    const user = await getUserInfo(values.login);
    await createSession(user);
  } catch (error: unknown) {
    console.error(error);
    return { error: errorMessage(error, "User creation failed") };
  }

  redirect("/orgs");
}
