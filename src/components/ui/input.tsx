import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-colors",
            error ? "border-danger focus:ring-danger" : "border-border focus:ring-primary",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"
