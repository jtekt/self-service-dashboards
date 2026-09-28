import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrgsAction } from "@/actions/orgs";
import { GRAFANA_DEFAULT_ORG_ID } from "@/config";
import DeleteOrgButton from "@/components/delete-org-button";

type Org = { orgId: number; name: string; role: string };

export default async function Page() {
  const data = await getUserOrgsAction();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl my-4">My Organizations</h1>

        <Button asChild>
          <Link href="/orgs/new">Create new</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Org name</TableHead>
            <TableHead className="text-right">Role</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data as Org[]).map((org) => (
            <TableRow key={org.orgId}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell className="text-right">{org.role}</TableCell>
              <TableCell className="text-right">
                {org.role === "Admin" &&
                  String(org.orgId) !== GRAFANA_DEFAULT_ORG_ID && (
                    <DeleteOrgButton orgId={org.orgId} name={org.name} />
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
