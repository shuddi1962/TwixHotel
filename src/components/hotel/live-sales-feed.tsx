"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Beer, Coffee, Utensils, Wine, ShoppingBag } from "lucide-react"

interface SaleItem {
  id: string
  item_name: string
  category: string | null
  quantity: number
  total: number
  sold_by: string | null
  shop_id: string | null
  created_at: string
  shops: { name: string } | null
}

const categoryIcon: Record<string, ReactNode> = {
  drink: <Beer className="w-4 h-4 text-amber-500" />,
  food: <Utensils className="w-4 h-4 text-green-500" />,
  coffee: <Coffee className="w-4 h-4 text-brown-500" />,
  wine: <Wine className="w-4 h-4 text-purple-500" />,
}

export function LiveSalesFeed({ hotelId }: { hotelId: string }) {
  const [sales, setSales] = useState<SaleItem[]>([])
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("pos_transaction_items")
        .select("*, shops!inner(name)")
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false })
        .limit(20)

      if (data) setSales(data as unknown as SaleItem[])
    }
    load()

    const channel = supabase
      .channel("live-sales")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pos_transaction_items",
          filter: `hotel_id=eq.${hotelId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("pos_transaction_items")
            .select("*, shops!inner(name)")
            .eq("id", payload.new.id)
            .single()
          if (data) {
            setSales((prev) => [data as unknown as SaleItem, ...prev].slice(0, 50))
          }
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [hotelId])

  if (sales.length === 0) {
    return <p className="text-sm text-muted text-center py-8">No sales yet today</p>
  }

  return (
    <div className="space-y-1">
      {sales.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-top-1 duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0">{categoryIcon[item.category?.toLowerCase() ?? ""] || <ShoppingBag className="w-4 h-4 text-gray-400" />}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {item.quantity}x {item.item_name}
              </p>
              <p className="text-xs text-muted">
                {item.shops?.name || "Unknown outlet"}
                {item.sold_by ? ` \u2022 ${item.sold_by}` : ""}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-sm font-semibold">${Number(item.total).toFixed(2)}</p>
            <p className="text-xs text-muted">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
