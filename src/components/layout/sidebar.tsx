"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, Building2, CreditCard, FileText,
  Settings, Ticket, PiggyBank, BarChart3, Plug, Palette,
  Globe, Shield, Menu, X, LogOut, Hotel, DoorOpen,
  BookOpen, UserPlus, Utensils, Store, SprayCan, Star,
  Receipt, Package
} from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

interface SidebarProps {
  type: "admin" | "hotel"
}

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/services", label: "Services", icon: Building2 },
  { href: "/admin/plans", label: "Plans", icon: Package },
  { href: "/admin/domains", label: "Domains", icon: Globe },
  { href: "/admin/deposits", label: "Deposits", icon: PiggyBank },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/gateways", label: "Gateways", icon: CreditCard },
  { href: "/admin/tickets", label: "Support", icon: Ticket },
  { href: "/admin/templates", label: "Templates", icon: Palette },
  { href: "/admin/extensions", label: "Extensions", icon: Plug },
  { href: "/admin/frontend", label: "Frontend", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const hotelLinks = [
  { href: "/hotel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hotel/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/hotel/bookings", label: "Bookings", icon: BookOpen },
  { href: "/hotel/guests", label: "Guests", icon: UserPlus },
  { href: "/hotel/staff", label: "Staff", icon: Users },
  { href: "/hotel/food", label: "Food Menu", icon: Utensils },
  { href: "/hotel/shops", label: "Shops", icon: Store },
  { href: "/hotel/cleaning", label: "Cleaning", icon: SprayCan },
  { href: "/hotel/invoices", label: "Invoices", icon: Receipt },
  { href: "/hotel/reviews", label: "Reviews", icon: Star },
  { href: "/hotel/reports", label: "Reports", icon: BarChart3 },
  { href: "/hotel/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()
  const links = type === "admin" ? adminLinks : hotelLinks

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-sidebar-hover">
        <Link href={type === "admin" ? "/admin" : "/hotel"} className="flex items-center gap-2">
          <Hotel className="w-7 h-7 text-primary-light" />
          <span className="text-lg font-bold text-white">
            {type === "admin" ? "TwiXAdmin" : "TwiXHotel"}
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "sidebar-link text-sidebar-text",
                isActive && "active"
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-sidebar-hover">
        <Link href="/profile" className="sidebar-link text-sidebar-text">
          <Shield className="w-5 h-5" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-link text-sidebar-text w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-200 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  )
}
