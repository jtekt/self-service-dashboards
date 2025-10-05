"use server";
import { addUserToOrg, createOrg, getUserOrgs } from "@/lib/orgs";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/session";

// TODO: not really an action and more of a query so rename accordingly
export async function getUserOrgsAction() {
  const currentUser = await getUserFromSession();
  if (!currentUser) return redirect("/login");

  return await getUserOrgs(currentUser.id);
}

export async function createOrgForUser(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString();
  if (!name) return { message: "Missing name" };

  const user = await getUserFromSession();
  if (!user) return { message: "Unauthorized" };

  try {
    const { orgId } = await createOrg(name);
    await addUserToOrg(user.login, orgId, "Admin");
  } catch (error: any) {
    console.error(error);
    // TODO: message -> error
    return { message: error.response?.data?.message || "Org creation failed" };
  }

  redirect("/orgs");
}
