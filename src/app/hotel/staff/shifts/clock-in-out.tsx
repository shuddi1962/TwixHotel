"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Clock, LogIn, LogOut } from "lucide-react"

export function ClockInOut({ hotelId }: { hotelId: string }) {
  const [activeEntry, setActiveEntry] = useState<{ id: string; staff_id: string; clock_in: string; clock_out: string | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: staff } = await supabase
        .from("hotel_staff")
        .select("id")
        .eq("user_id", user.id)
        .eq("hotel_id", hotelId)
        .single()

      if (staff) {
        const { data } = await supabase
          .from("staff_attendance")
          .select("*")
          .eq("staff_id", staff.id)
          .eq("hotel_id", hotelId)
          .is("clock_out", null)
          .maybeSingle()

        setActiveEntry(data)
      }
    }
    load()
  }, [hotelId])

  const clockIn = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: staff } = await supabase
      .from("hotel_staff")
      .select("id")
      .eq("user_id", user.id)
      .eq("hotel_id", hotelId)
      .single()

    if (staff) {
      const { data } = await supabase
        .from("staff_attendance")
        .insert({ hotel_id: hotelId, staff_id: staff.id, clock_in: new Date().toISOString() })
        .select()
        .single()

      if (data) setActiveEntry(data)
    }
    setLoading(false)
  }

  const clockOut = async () => {
    if (!activeEntry) return
    setLoading(true)
    await supabase
      .from("staff_attendance")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", activeEntry.id)

    setActiveEntry(null)
    setLoading(false)
  }

  if (activeEntry) {
    return (
      <Button variant="secondary" onClick={clockOut} disabled={loading}>
        <LogOut className="w-4 h-4 mr-1" />
        {loading ? "Processing..." : "Clock Out"}
      </Button>
    )
  }

  return (
    <Button onClick={clockIn} disabled={loading}>
      <LogIn className="w-4 h-4 mr-1" />
      {loading ? "Processing..." : "Clock In"}
    </Button>
  )
}
