import Image from "next/image"
import { Users, ArrowUpRight } from "lucide-react"

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
  const image = room.images?.[0] || `https://picsum.photos/seed/room-${room.id}/800/1000`

  return (
    <div className="group relative rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--hg-surface)" }}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={room.room_type}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(11,31,26,0) 40%, rgba(11,31,26,0.92) 100%)" }}
        />
        <div className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm" style={{ background: "rgba(11,31,26,0.55)", color: "var(--hg-gold-light)" }}>
          {room.currencySymbol}{room.price_per_night.toFixed(0)} / night
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="hg-eyebrow mb-1">Room {room.room_number}</p>
          <h3 className="font-display text-2xl mb-2" style={{ color: "var(--hg-ivory)" }}>
            {room.room_type}
          </h3>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--hg-sage)" }}>
              <Users className="w-3.5 h-3.5" /> {room.capacity} guests
            </span>
            <a
              href="#contact"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
              style={{ background: "var(--hg-gold)", color: "#16211B" }}
              aria-label={`Book ${room.room_type}`}
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
