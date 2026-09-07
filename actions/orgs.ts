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

type FormState = { message: string } | undefined;

export async function createOrgForUser(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name")?.toString();
  if (!name) return { message: "Missing name" };

  const user = await getUserFromSession();
  if (!user) return { message: "Unauthorized" };

  try {
    const { orgId } = await createOrg(name);
    await addUserToOrg(user.login, orgId, "Admin");
  } catch (error: unknown) {
    console.error(error);
    // TODO: message -> error
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Org creation failed";
    return { message };
  }

  redirect("/orgs");
}
