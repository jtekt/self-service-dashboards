import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  text: string
}

export function SubmitButton(props: Props) {
  const { pending } = useFormStatus()

  return (
    <Button disabled={pending} type="submit" className="block mx-auto">
      {pending ? (
        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
      ) : (
        <span>{props.text}</span>
      )}
    </Button>
  )
}
