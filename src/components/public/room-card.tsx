import Image from "next/image"
import Link from "next/link"
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
  const image = room.images?.[0] || `https://picsum.photos/seed/room-${room.id}/800/1000`

  return (
    <div className="room-card">
      <div className="room-card__thumb">
        <Image src={image} alt={room.room_type} fill sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="room-card__content">
        <h5 className="room-card__title">
          <Link href={`/room/${room.id}`}>{room.room_type}</Link>
        </h5>
        <div className="flex items-center justify-between">
          <div className="room-card__price">
            {room.currencySymbol}{room.price_per_night.toFixed(0)} <span className="per-night">/ Night</span>
          </div>
          <div className="room-card__ability">
            <Users className="w-3.5 h-3.5 inline-block mr-1" />
            {room.capacity} Adults{room.capacity > 1 ? "" : ""}
          </div>
        </div>
      </div>
    </div>
  )
}
