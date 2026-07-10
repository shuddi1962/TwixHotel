import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: number
  changeLabel?: string
  className?: string
}

export function StatCard({ title, value, icon, change, changeLabel, className }: StatCardProps) {
  const isPositive = change && change >= 0
  return (
    <div className={cn("bg-white rounded-xl border border-border p-6 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted font-medium">{title}</span>
        <span className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-dark">{value}</div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-success" />
          ) : (
            <TrendingDown className="w-3 h-3 text-danger" />
          )}
          <span className={isPositive ? "text-success" : "text-danger"}>
            {Math.abs(change).toFixed(1)}%
          </span>
          {changeLabel && <span className="text-muted">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
