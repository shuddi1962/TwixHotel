"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart, Send, ArrowLeft } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  available: boolean
  image: string | null
  shops: { id: string; name: string } | null
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function OrderPage() {
  const params = useParams<{ hotel_slug: string; room_or_table_id: string }>()
  const [items, setItems] = useState<FoodItem[]>([])
  const [hotelName, setHotelName] = useState("")
  const [hotelId, setHotelId] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [guestName, setGuestName] = useState("")
  const [showCart, setShowCart] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: hotels } = await supabase
        .from("hotels")
        .select("id, name")
        .eq("status", 1)

      const hotel = hotels?.find(
        (h) => h.name?.toLowerCase().replace(/\s+/g, "-") === params.hotel_slug,
      )

      if (hotel) {
        setHotelId(hotel.id)
        setHotelName(hotel.name || "Hotel")

        const { data: food } = await supabase
          .from("food_items")
          .select("*, shops!inner(id, name)")
          .eq("available", true)
          .in(
            "shop_id",
            (
              await supabase.from("shops").select("id").eq("hotel_id", hotel.id).eq("status", 1)
            ).data?.map((s) => s.id) || [],
          )
          .order("category")

        if (food) setItems(food as unknown as FoodItem[])
      }
    }
    load()
  }, [params.hotel_slug])

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        )
      }
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), quantity: 1 }]
    })
  }

  const updateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === itemId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0),
    )
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)

  const submitOrder = async () => {
    if (!guestName.trim() || cart.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/order/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          items: cart.map((c) => ({
            item_id: c.id,
            item_name: c.name,
            quantity: c.quantity,
            unit_price: c.price,
            total: c.price * c.quantity,
            category: "food",
          })),
          guest_name: guestName,
          order_type: "room_service",
          table_room_id: params.room_or_table_id,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setCart([])
        setGuestName("")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">Order Submitted!</h2>
            <p className="text-muted mb-6">Your order is being prepared. Relax and enjoy!</p>
            <Button onClick={() => setSuccess(false)}>Order Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#0B101E]">{hotelName}</h1>
            <p className="text-xs text-gray-500">Room {params.room_or_table_id}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setShowCart(!showCart)} className="relative">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#A96032] text-white text-xs rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Guest Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#0B101E] mb-1">Your Name</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your name for the order"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A96032]/20 focus:border-[#A96032]"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {Object.entries(
            items.reduce<Record<string, FoodItem[]>>((acc, item) => {
              const cat = item.category || "Other"
              if (!acc[cat]) acc[cat] = []
              acc[cat].push(item)
              return acc
            }, {}),
          ).map(([category, categoryItems]) => (
            <div key={category}>
              <h2 className="text-lg font-bold text-[#0B101E] mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#A96032] rounded-full" />
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryItems.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id)
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#0B101E]">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                        )}
                        <p className="text-sm font-bold text-[#A96032] mt-1">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-6 text-center">{inCart.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-[#A96032] text-white flex items-center justify-center hover:opacity-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-full bg-[#A96032] text-white flex items-center justify-center hover:opacity-90 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Menu not available at this time</p>
              <p className="text-sm mt-1">Please check back later</p>
            </div>
          )}
        </div>

        {/* Cart Summary (fixed bottom on mobile) */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-[#0B101E]">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
              <span className="text-xl font-bold text-[#A96032]">${total.toFixed(2)}</span>
            </div>
            {showCart && (
              <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
                {cart.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span>
                      {c.quantity}x {c.name}
                    </span>
                    <span className="font-medium">${(c.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={submitOrder} disabled={!guestName.trim() || submitting} className="w-full">
              {submitting ? "Sending..." : `Place Order — $${total.toFixed(2)}`}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
