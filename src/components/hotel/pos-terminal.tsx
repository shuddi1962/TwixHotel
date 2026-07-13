"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, ShoppingCart, DollarSign, Search } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  image: string | null
  inventory_item_id: string | null
}

interface CartItem {
  item_id: string
  item_name: string
  category: string
  quantity: number
  unit_price: number
  total: number
}

export function POSTerminal({
  hotelId,
  shopId,
  userId,
  shopName,
}: {
  hotelId: string
  shopId: string
  userId: string
  shopName: string
}) {
  const [items, setItems] = useState<FoodItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [search, setSearch] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("food_items")
        .select("*")
        .eq("shop_id", shopId)
        .eq("available", true)
        .order("category")
      if (data) setItems(data)
    }
    load()
  }, [shopId])

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase()),
  )

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item_id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.item_id === item.id
            ? { ...c, quantity: c.quantity + 1, total: (c.quantity + 1) * c.unit_price }
            : c,
        )
      }
      return [
        ...prev,
        {
          item_id: item.id,
          item_name: item.name,
          category: item.category || "other",
          quantity: 1,
          unit_price: Number(item.price),
          total: Number(item.price),
        },
      ]
    })
  }

  const updateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item_id === itemId
            ? { ...c, quantity: Math.max(0, c.quantity + delta) }
            : c,
        )
        .filter((c) => c.quantity > 0),
    )
    setCart((prev) =>
      prev.map((c) => ({
        ...c,
        total: c.quantity * c.unit_price,
      })),
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item_id !== itemId))
  }

  const total = cart.reduce((sum, c) => sum + c.total, 0)

  const submitSale = async () => {
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/pos/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          shop_id: shopId,
          payment_method: paymentMethod,
          items: cart,
          sold_by: userId,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setCart([])
        setTimeout(() => setSuccess(false), 3000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu items */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              {shopName} — Menu
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                Sale completed successfully!
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all active:scale-95"
                >
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted mt-1">{item.category}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted col-span-full text-center py-8">
                  {search ? "No items match your search" : "No menu items available"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <div className="space-y-4">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">Cart is empty</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cart.map((c) => (
                  <div
                    key={c.item_id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.item_name}</p>
                      <p className="text-xs text-muted">${c.unit_price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <button
                        onClick={() => updateQty(c.item_id, -1)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{c.quantity}</span>
                      <button
                        onClick={() => updateQty(c.item_id, 1)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(c.item_id)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark mb-1 block">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            <Button
              onClick={submitSale}
              disabled={cart.length === 0 || submitting}
              className="w-full"
            >
              {submitting ? "Processing..." : `Complete Sale — $${total.toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
