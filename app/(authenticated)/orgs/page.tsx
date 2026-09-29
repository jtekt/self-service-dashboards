import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserOrgsAction } from "@/actions/orgs";
import { GRAFANA_DEFAULT_ORG_ID } from "@/config";
import DeleteOrgButton from "@/components/delete-org-button";

type Org = { orgId: number; name: string; role: string };

export default async function Page() {
  const orgs = (await getUserOrgsAction()) as Org[];

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your organizations</h1>
        <Link
          href="/orgs/new"
          className={buttonVariants({ size: "icon" })}
          aria-label="New organization"
          title="New organization"
        >
          <PlusIcon className="size-4" />
        </Link>
      </div>

      {orgs.length === 0 ? (
        <p className="text-muted-foreground">
          You aren&apos;t a member of any organizations yet.
        </p>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <Card key={org.orgId}>
              <CardContent className="flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{org.name}</p>
                  <p className="text-sm text-muted-foreground">{org.role}</p>
                </div>
                {org.role === "Admin" &&
                  String(org.orgId) !== GRAFANA_DEFAULT_ORG_ID && (
                    <DeleteOrgButton orgId={org.orgId} name={org.name} />
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
