"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getInitials } from "@/lib/utils"
import { Bell, ChevronDown } from "lucide-react"

export function Topbar() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [supabase])

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border px-6 py-3">
      <div className="flex items-center justify-end gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">
            {user?.email ? getInitials(user.email) : "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-dark truncate max-w-[150px]">
              {user?.email || "User"}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted" />
        </div>
      </div>
    </header>
  )
}
