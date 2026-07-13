import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { RoomRow } from "@/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Hotel } from "lucide-react"
import Link from "next/link"

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  const supabase = await createAdminClient()

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("subdomain", subdomain)
    .eq("status", 1)
    .single()

  if (!service) notFound()

  const { data: hotel } = await supabase
    .from("hotels")
    .select("*")
    .eq("user_id", service.user_id)
    .single()

  if (!hotel) notFound()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("hotel_id", hotel.id)
    .eq("status", "available")

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${subdomain}`} className="flex items-center gap-2">
            <Hotel className="w-6 h-6" />
            <span className="text-lg font-bold">{hotel.name}</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-dark mb-2">Book a Room</h1>
        <p className="text-muted mb-8">Select a room and fill in your details to complete the booking.</p>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {rooms && rooms.length > 0 ? rooms.map((room: RoomRow) => (
            <Card key={room.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-dark">{room.room_type}</h3>
                    <p className="text-sm text-muted">Room {room.room_number} · Floor {room.floor}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">${room.price_per_night}<span className="text-sm font-normal text-muted">/night</span></span>
                </div>
                <p className="text-sm text-muted mb-3">Capacity: {room.capacity}{room.amenities && room.amenities.length > 0 ? ` · ${room.amenities.join(", ")}` : ""}</p>
                <div className="flex gap-2">
                  <Input placeholder="Check-in" type="date" />
                  <Input placeholder="Check-out" type="date" />
                </div>
              </CardContent>
            </Card>
          )) : (
            <p className="text-muted col-span-2">No rooms available at the moment.</p>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>Guest Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
            </div>
            <Input label="Email" type="email" placeholder="john@example.com" />
            <Input label="Phone" placeholder="+1234567890" />
            <Button className="w-full" size="lg">Complete Booking</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
