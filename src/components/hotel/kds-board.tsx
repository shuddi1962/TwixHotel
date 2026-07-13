"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat } from "lucide-react"

interface OrderItem {
  id: string
  transaction_id: string
  item_name: string
  quantity: number
  created_at: string
}

interface Order {
  id: string
  shop_id: string | null
  total: number
  status: string
  order_type: string | null
  table_room_id: string | null
  created_at: string
  shops: { name: string } | null
  items: OrderItem[]
}

export function KDSBoard({ hotelId }: { hotelId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("pos_transactions")
        .select("*, shops!inner(name)")
        .eq("hotel_id", hotelId)
        .in("status", ["pending", "preparing"])
        .order("created_at", { ascending: false })

      if (data) {
        const withItems = await Promise.all(
          data.map(async (o) => {
            const { data: items } = await supabase
              .from("pos_transaction_items")
              .select("id, transaction_id, item_name, quantity, created_at")
              .eq("transaction_id", o.id)
            return { ...o, items: items || [] } as unknown as Order
          }),
        )
        setOrders(withItems)
      }
    }
    load()

    const channel = supabase
      .channel("kds-orders")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "pos_transactions",
        filter: `hotel_id=eq.${hotelId}`,
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [hotelId])

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("pos_transactions").update({ status }).eq("id", orderId)
  }

  const getElapsed = (created: string) => {
    const mins = Math.floor((Date.now() - new Date(created).getTime()) / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">No pending orders</p>
        <p className="text-sm mt-1">Orders will appear here in real time</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className={`border-l-4 ${order.status === "preparing" ? "border-l-amber-500" : "border-l-blue-500"}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {order.order_type === "room_service" ? (
                  <Badge variant="info">Room {order.table_room_id}</Badge>
                ) : order.table_room_id ? (
                  <Badge variant="secondary">Table {order.table_room_id}</Badge>
                ) : (
                  <Badge variant="secondary">{order.shops?.name || "Outlet"}</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock className="w-3 h-3" />
                {getElapsed(order.created_at)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.item_name}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              {order.status === "pending" && (
                <Button size="sm" className="flex-1" onClick={() => updateStatus(order.id, "preparing")}>
                  <ChefHat className="w-4 h-4 mr-1" /> Start Preparing
                </Button>
              )}
              {order.status === "preparing" && (
                <>
                  <Button size="sm" variant="success" className="flex-1" onClick={() => updateStatus(order.id, "ready")}>
                    Mark Ready
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, "pending")}>
                    Send Back
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
