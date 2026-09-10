import { redirect } from "next/navigation";

import { getUserFromSession } from "@/lib/session";

export default async function AnonymousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromSession();
  if (user) redirect("/");
  return children;
}
