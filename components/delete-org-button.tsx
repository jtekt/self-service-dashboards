"use client";

import { Button } from "@/components/ui/button";
import { Check, Ban, Trash, Loader2 } from "lucide-react";
import { deleteOrgForUser } from "@/actions/orgs";
import { startTransition, useActionState, useState } from "react";

type Props = {
  orgId: number;
  name: string;
};

export default function DeleteOrgButton(props: Props) {
  const [waitingForConfirm, setWaitingForConfirm] = useState(false);

  const [state, action, pending] = useActionState(
    () => deleteOrgForUser(props.orgId),
    undefined,
  );

  return (
    <div className="flex flex-col items-end gap-1">
      {waitingForConfirm ? (
        <div className="inline-flex gap-2">
          <Button
            size="icon"
            variant="destructive"
            onClick={() => startTransition(() => action())}
            disabled={pending}
            aria-label={`Confirm deletion of ${props.name}`}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Check />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setWaitingForConfirm(false)}
            disabled={pending}
            aria-label="Cancel"
          >
            <Ban />
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setWaitingForConfirm(true)}
          aria-label={`Delete ${props.name}`}
        >
          <Trash />
        </Button>
      )}
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}
