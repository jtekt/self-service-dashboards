"use server";
import { addUserToOrg, createOrg, deleteOrg, getUserOrgs } from "@/lib/orgs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/session";
import { GRAFANA_DEFAULT_ORG_ID } from "@/config";

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

export async function deleteOrgForUser(
  orgId: number,
): Promise<{ error: string } | undefined> {
  const user = await getUserFromSession();
  if (!user) return { error: "Unauthorized" };

  // Every user is a member of the default org, which must never be deleted
  if (String(orgId) === GRAFANA_DEFAULT_ORG_ID)
    return { error: "The default organization cannot be deleted" };

  try {
    // Re-derive the user's role from Grafana rather than trusting the client
    const orgs: { orgId: number; role: string }[] = await getUserOrgs(user.id);
    const org = orgs.find((o) => o.orgId === orgId);
    if (org?.role !== "Admin")
      return { error: "Only an Admin of this organization can delete it" };

    await deleteOrg(orgId);
  } catch (error: unknown) {
    console.error(error);
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Org deletion failed";
    return { error: message };
  }

  revalidatePath("/orgs");
}
