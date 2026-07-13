import Image from "next/image"
import { Users } from "lucide-react"

export interface RoomCardData {
  id: string
  room_number: string
  room_type: string
  description: string | null
  capacity: number
  price_per_night: number
  images: string[] | null
  currencySymbol: string
}

export function RoomCard({ room }: { room: RoomCardData }) {
  const image = room.images?.[0] || `https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80`

  return (
    <div className="room-card">
      <div className="room-card__image">
        <Image src={image} alt={room.room_type} fill sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium" style={{ background: "rgba(255,255,255,0.9)", color: "var(--vg-gold)" }}>
          {room.currencySymbol}{room.price_per_night.toFixed(0)} / night
        </div>
      </div>
      <div className="room-card__body">
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--vg-sage)" }}>Room {room.room_number}</p>
        <h3 className="room-card__name">{room.room_type}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--vg-sage)" }}>
            <Users className="w-3.5 h-3.5" /> Up to {room.capacity} guests
          </span>
          <a
            href="#contact"
            className="btn-gold text-xs px-4 py-2"
          >
            Book
          </a>
        </div>
      </div>
    </div>
  )
}
