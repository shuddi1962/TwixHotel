import { Hotel } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex flex-col">
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Hotel className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold">TwiXHotel</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
