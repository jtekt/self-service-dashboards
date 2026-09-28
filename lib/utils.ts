import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// On/off env flags: only "true", "1" or "yes" (any case) turn a flag on, so
// that e.g. "false" doesn't enable it
export function isEnabled(value: string | undefined): boolean {
  return ["true", "1", "yes"].includes(value?.trim().toLowerCase() ?? "")
}
