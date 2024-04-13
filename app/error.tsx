"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2 className="text-4xl">Error</h2>
      <p className="my-4">{error.message}</p>
      <Button onClick={() => reset()}>Return</Button>
    </div>
  )
}
