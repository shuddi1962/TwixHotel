import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "danger" | "warning" | "info" | "secondary"
}

const variants = {
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-700",
  secondary: "bg-gray-50 text-gray-700",
}

export function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
