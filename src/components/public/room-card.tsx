import Image from "next/image"

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

const ROOM_IMAGES: Record<string, string> = {
  "Presidential Suite": "https://lh3.googleusercontent.com/aida/AP1WRLvHJ39w0C1DBkHSySCfuwtrUotLfoZOWW0npyjpOAUp_Aj2kNl3HBUOOoQID1w3SXmZGQMFNLvtYCTtQlyvJ_jQYnNarAbMOxAjmiS8t1HfiV_XkEbmhgiiVVhjjP5_WqCyKNSTWKACt6GtLdywrs9Dc_qRIIQSLS9hdeILrfazG2m9WAkqQLyaQr3FMI9J2dTBp-YKKXRj_GqOIPHOsHh2nbhFuF3QTHbB7mHjllUoLT2jAJO-ERt2vwN2",
  "Executive Suite": "https://lh3.googleusercontent.com/aida/AP1WRLvFIe2WjHi0cZ8CDGVnnpmF7vQZyC4RH-Da6wM8Vh5mZJdNDqKwyC4li1KLPUxO97sH6m84tb3v8cVRnztVR8zvoBYUtD5pwFuNYiFbH3dE-dfyujMROPk9IV9i5rHf1FKx8XQqcyNrtHH11cRA3Ex3aRhuZl-SYTmiJhn7e1PpR3NPC2BCbr6hqWWC9y_pbvsjBeON-FiJNVMRZ-s8XK90PuskoTYRhLoXJtUl2U_TlbTzGLaKT0hZfKU",
  "Honeymoon Suite": "https://lh3.googleusercontent.com/aida/AP1WRLsr6YCIEVqF1Pj5TvfHhXfE1iQiM2W_D1cM4CB7PAlGj-N-9fhC2bu9gF91s4UxmxPeuYQQbIoj5IOqbSP9e6S_W8zQdeuJSta7OSLyZqkDfHxOBdwhgnG5vt77RncQBHSg13_PxyOOG1a7Sz7rqt4wuIQeQvLQCtV4Vq_OtfpY2B89-dG5EsBpHepyGr6WZ4tGIp_zRoBEWicbj2ZY-fLMNdsfUBlR1GQ21WiCznX2KhzxJnNOmXKuPDL1",
}

export function RoomCard({ room }: { room: RoomCardData }) {
  const image = room.images?.[0] || ROOM_IMAGES[room.room_type] || "https://lh3.googleusercontent.com/aida/AP1WRLvHJ39w0C1DBkHSySCfuwtrUotLfoZOWW0npyjpOAUp_Aj2kNl3HBUOOoQID1w3SXmZGQMFNLvtYCTtQlyvJ_jQYnNarAbMOxAjmiS8t1HfiV_XkEbmhgiiVVhjjP5_WqCyKNSTWKACt6GtLdywrs9Dc_qRIIQSLS9hdeILrfazG2m9WAkqQLyaQr3FMI9J2dTBp-YKKXRj_GqOIPHOsHh2nbhFuF3QTHbB7mHjllUoLT2jAJO-ERt2vwN2"

  return (
    <div className="room-card">
      <div className="room-card__image">
        <Image src={image} alt={room.room_type} fill sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute top-4 right-4 bg-warm-bronze text-white px-4 py-1 text-[10px] tracking-widest font-semibold uppercase">Featured</div>
      </div>
      <div className="room-card__body">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-heading text-[24px] leading-[32px] text-deep-navy">{room.room_type}</h3>
          <div className="text-right">
            <span className="block text-[20px] leading-[28px] font-semibold text-primary">{room.currencySymbol}{room.price_per_night.toFixed(2)}</span>
            <span className="text-on-surface-variant text-[10px] uppercase">Per Night</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{room.description || "Experience unparalleled comfort and style in our carefully appointed accommodations."}</p>
        <div className="flex items-center gap-4 text-[12px] text-outline pt-6 border-t border-charcoal/5 mb-6 flex-wrap">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">wifi</span> Free Wifi</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">tv</span> HD TV</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">ac_unit</span> AC</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">kitchen</span> Freeze</span>
        </div>
        <button className="w-full border border-warm-bronze text-warm-bronze py-3 text-[14px] leading-[20px] tracking-widest font-semibold uppercase hover:bg-warm-bronze hover:text-white transition-all">
          View Details
        </button>
      </div>
    </div>
  )
}
