"use server";
import { addUserToOrg, createOrg, getUserOrgs } from "@/lib/orgs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// TODO: not really an action and more of a query so rename accordingly
export async function getUserOrgsAction() {
  const head = headers();

  const stringifiedUser = head.get("X-User");
  if (!stringifiedUser) throw "No user";

  const user = JSON.parse(stringifiedUser);

  return await getUserOrgs(user.id);
}
export async function createOrgForUser(prevState: any, formData: FormData) {
  const name = formData.get("name");
  if (!name) return { message: "Missing name" };

  const head = headers();

  const stringifiedUser = head.get("X-User");
  if (!stringifiedUser) throw new Error("No user in X-User header");
  const user = JSON.parse(stringifiedUser);

  try {
    const { orgId } = await createOrg(name as string);
    await addUserToOrg(user.login, orgId, "Admin");
  } catch (error: any) {
    console.error(error);
    return { message: error.response?.data?.message || "Org creation failed" };
  }

  redirect("/orgs");
}
