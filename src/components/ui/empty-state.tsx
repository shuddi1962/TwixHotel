import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-gray-100 mb-4">
        <Inbox className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-medium text-dark mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
