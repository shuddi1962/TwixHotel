import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { RoomRow, ReviewRow } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Mail, Hotel, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function PublicHotelPage({
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
    .limit(6)

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("hotel_id", hotel.id)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="w-6 h-6" />
            <span className="text-lg font-bold">{hotel.name}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#rooms" className="hover:text-primary-light transition-colors">Rooms</a>
            <a href="#reviews" className="hover:text-primary-light transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-primary-light transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">{hotel.name}</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-2">
            {hotel.address && (
              <span className="flex items-center justify-center gap-1"><MapPin className="w-4 h-4" />{hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}</span>
            )}
          </p>
          <p className="text-muted mb-8">Experience comfort and luxury at its finest.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href={`/${subdomain}/booking`}>
              <Button size="lg">Book Now <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {rooms && rooms.length > 0 && (
        <section id="rooms" className="py-16 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark text-center mb-10">Our Rooms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room: RoomRow) => (
              <Card key={room.id}>
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-muted text-sm">
                    Room Image
                  </div>
                  <h3 className="font-semibold text-dark">{room.room_number} — {room.room_type}</h3>
                  <p className="text-sm text-muted mt-1">Floor {room.floor} · Capacity {room.capacity}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">${room.price_per_night}/night</span>
                    <Button size="sm">Book</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {reviews && reviews.length > 0 && (
        <section id="reviews" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-dark text-center mb-10">Guest Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review: ReviewRow) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm text-muted">{review.comment}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-dark text-center mb-10">Contact Us</h2>
        <div className="max-w-md mx-auto space-y-4 text-center">
          {hotel.email && (
            <p className="flex items-center justify-center gap-2 text-muted"><Mail className="w-4 h-4" />{hotel.email}</p>
          )}
          {hotel.phone && (
            <p className="flex items-center justify-center gap-2 text-muted"><Phone className="w-4 h-4" />{hotel.phone}</p>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} {hotel.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}
