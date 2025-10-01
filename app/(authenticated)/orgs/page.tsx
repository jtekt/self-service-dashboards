import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import {
  GRAFANA_ADMIN_USERNAME,
  GRAFANA_ADMIN_PASSWORD,
  GRAFANA_URL,
} from "@/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  // TODO: having to use headers is quite bad
  async function getData() {
    "use server";
    const head = headers();

    const stringifiedUser = head.get("X-User");
    if (!stringifiedUser) throw "No user";

    const user = JSON.parse(stringifiedUser);

    const auth = {
      username: GRAFANA_ADMIN_USERNAME,
      password: GRAFANA_ADMIN_PASSWORD,
    };

    const url = `${GRAFANA_URL}/api/users/${user.id}/orgs`;
    const { data } = await axios.get(url, { auth });
    return data;
  }

  const data = await getData();

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((org: any) => (
            <TableRow key={org.orgId}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell className="text-right">{org.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
