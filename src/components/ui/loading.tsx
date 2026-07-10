export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted">Loading page...</p>
      </div>
    </div>
  )
}
