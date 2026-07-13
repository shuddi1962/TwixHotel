"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { StatCard } from "@/components/ui/stat-card"
import { DollarSign } from "lucide-react"

export function TodaysSalesCard({ hotelId }: { hotelId: string }) {
  const [total, setTotal] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]

    const load = async () => {
      const { data } = await supabase
        .from("pos_transaction_items")
        .select("total")
        .eq("hotel_id", hotelId)
        .gte("created_at", today)
        .lte("created_at", today + "T23:59:59.999Z")

      if (data) {
        setTotal(data.reduce((sum, r) => sum + Number(r.total), 0))
      }
    }
    load()

    const channel = supabase
      .channel("todays-sales")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pos_transaction_items",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          setTotal((prev) => prev + Number(payload.new.total))
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [hotelId])

  return (
    <StatCard
      title="Today's Sales"
      value={`$${total.toFixed(2)}`}
      icon={<DollarSign className="w-5 h-5" />}
    />
  )
}
