import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="admin" />
      <div className="lg:pl-64">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
