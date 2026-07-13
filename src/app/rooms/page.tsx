"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const ROOM_IMAGES: Record<string, string> = {
  "Presidential Suite": "https://lh3.googleusercontent.com/aida/AP1WRLvHJ39w0C1DBkHSySCfuwtrUotLfoZOWW0npyjpOAUp_Aj2kNl3HBUOOoQID1w3SXmZGQMFNLvtYCTtQlyvJ_jQYnNarAbMOxAjmiS8t1HfiV_XkEbmhgiiVVhjjP5_WqCyKNSTWKACt6GtLdywrs9Dc_qRIIQSLS9hdeILrfazG2m9WAkqQLyaQr3FMI9J2dTBp-YKKXRj_GqOIPHOsHh2nbhFuF3QTHbB7mHjllUoLT2jAJO-ERt2vwN2",
  "Executive Suite": "https://lh3.googleusercontent.com/aida/AP1WRLvFIe2WjHi0cZ8CDGVnnpmF7vQZyC4RH-Da6wM8Vh5mZJdNDqKwyC4li1KLPUxO97sH6m84tb3v8cVRnztVR8zvoBYUtD5pwFuNYiFbH3dE-dfyujMROPk9IV9i5rHf1FKx8XQqcyNrtHH11cRA3Ex3aRhuZl-SYTmiJhn7e1PpR3NPC2BCbr6hqWWC9y_pbvsjBeON-FiJNVMRZ-s8XK90PuskoTYRhLoXJtUl2U_TlbTzGLaKT0hZfKU",
  "Honeymoon Suite": "https://lh3.googleusercontent.com/aida/AP1WRLsr6YCIEVqF1Pj5TvfHhXfE1iQiM2W_D1cM4CB7PAlGj-N-9fhC2bu9gF91s4UxmxPeuYQQbIoj5IOqbSP9e6S_W8zQdeuJSta7OSLyZqkDfHxOBdwhgnG5vt77RncQBHSg13_PxyOOG1a7Sz7rqt4wuIQeQvLQCtV4Vq_OtfpY2B89-dG5EsBpHepyGr6WZ4tGIp_zRoBEWicbj2ZY-fLMNdsfUBlR1GQ21WiCznX2KhzxJnNOmXKuPDL1",
  "Family Suite": "https://lh3.googleusercontent.com/aida/AP1WRLs7Oc52in6iQ-zLnRWzV7oA6wDUoPTfdAwPoJdqygmZW6jALonWIURf1xpXxGcqrZE7SA8luqF50eOso80BI12Qin2WNRolhi4kYPl1fQzHkzRo6zvt7BuCzaRU-TgPSqdkH4SbJ7NbBBzbb7ohGzQtcYb7sy9TONCWS5koeorXJR5TvE1rIf2_0PZYzUMYWO69c7ha-ux-JJNGVl9Yi6GoI6weptLINK5rntv9cZslfvCmQQVZwxGfdWw2",
  "Premier Deluxe": "https://lh3.googleusercontent.com/aida/AP1WRLuqyoHXzhQIVmq2COpjCQombK8nfJa34nZVwPoql2I8iZxR5zASxc34y-RB5XgxSjzQFx0jgBTBZkXJh0bwn5pi8uMPWL0oSnZWZ12lHdJ-AEdaPw-A7LctnZM7ZOiuUpnbbJqr5oJyYNC3bhuFqzJDEWTFAxZq-WVaPtCMONOdzaZ5-ZauBzJL4lFa-OIA1PikBNMX7ivMXA9dYYUoYDmpYN0CM8bEAtCYg9uikK9Jly4wq8hnhvUtQSoB",
  "Deluxe Room": "https://lh3.googleusercontent.com/aida/AP1WRLuIDJQzJ6D1z1rrMUOb-hkHPmHjesh8vSf1OFM2_hvwM_V0WXZECyNPNl0r8MdEdwY7hmWj5rFCKx36YUgy7Ri3ErxOWsC1QktbAwMp2v3_LohRovk_vxx5tDrQyaBklpnYcJbQYHANr23jA8Jc-JPBF2HkNgpsE9Os2yHouB_JadaKT1KPh3q5445JTgBKUIPXHBTx_UiEjVKbdLHmGBrrZiG_kuYzLjOd3e2-f8s6A9tj1cBRxMj3SGVL",
}

interface Room {
  id: string
  room_number: string
  room_type: string
  description: string | null
  capacity: number
  price_per_night: number
  images: string[] | null
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [hotelName, setHotelName] = useState("TwixHotel")
  const [currency, setCurrency] = useState("$")
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: hotel } = await supabase
        .from("hotels")
        .select("*")
        .eq("status", 1)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (hotel) {
        setHotelName(hotel.name)
        setCurrency(hotel.currency_symbol || "$")
      }

      const { data: roomsData } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", hotel?.id || "")
        .order("price_per_night", { ascending: false })

      if (roomsData) {
        setRooms(roomsData)
        const initial: Record<string, number> = {}
        roomsData.forEach((r) => { initial[r.id] = 1 })
        setQuantities(initial)
      }
    }
    load()
  }, [])

  const getImage = (room: Room) =>
    room.images?.[0] || ROOM_IMAGES[room.room_type] || ROOM_IMAGES["Presidential Suite"]

  const badges: Record<string, string> = {
    "Presidential Suite": "Exclusive",
    "Honeymoon Suite": "Romantic",
  }

  return (
    <div className="bg-soft-cream text-on-surface min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-soft-cream/85 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center h-20 px-5 md:px-6 max-w-[1280px] mx-auto">
          <Link href="/" className="font-heading text-[32px] leading-[40px] text-primary tracking-tight">{hotelName}</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/rooms" className="text-primary font-bold border-b-2 border-primary pb-1 text-[14px] leading-[20px] tracking-widest font-semibold">Rooms</Link>
            <Link href="/#dining" className="text-on-surface-variant hover:text-primary transition-colors text-[14px] leading-[20px] tracking-widest font-semibold">Dining</Link>
            <Link href="/#facilities" className="text-on-surface-variant hover:text-primary transition-colors text-[14px] leading-[20px] tracking-widest font-semibold">Facilities</Link>
          </div>
          <Link href="/rooms" className="bg-primary-container text-on-primary text-[14px] leading-[20px] tracking-widest font-semibold px-6 py-3 hover:opacity-80 transition-opacity">Book Now</Link>
        </div>
      </nav>

      <main className="pt-20">
        {/* Search summary */}
        <section className="bg-surface-container-low border-b border-outline-variant/20 py-6 sticky top-20 z-40">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">Check-In</span>
                <span className="font-semibold text-on-surface">13 Jul 2024</span>
              </div>
              <div className="h-8 w-px bg-outline-variant/30 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">Check-Out</span>
                <span className="font-semibold text-on-surface">14 Jul 2024</span>
              </div>
              <div className="h-8 w-px bg-outline-variant/30 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">Guests</span>
                <span className="font-semibold text-on-surface">2 Adults, 0 Children</span>
              </div>
            </div>
            <button className="w-full md:w-auto bg-warm-bronze text-white text-[14px] leading-[20px] tracking-widest font-semibold px-8 py-3 hover:shadow-lg transition-all active:scale-95">
              Modify Search
            </button>
          </div>
        </section>

        {/* Main content */}
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar filters */}
            <aside className="w-full lg:w-72 flex flex-col gap-4">
              <div className="sticky top-44 bg-surface-container-low p-6 border border-outline-variant/10">
                <div className="mb-6">
                  <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">Filters</h3>
                  <p className="text-[16px] leading-[26px] text-on-surface-variant opacity-70">Refine your stay</p>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-warm-bronze">payments</span>
                    <span className="font-semibold text-warm-bronze uppercase text-[12px] tracking-widest">Price Range</span>
                  </div>
                  <input className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-warm-bronze" max="1000" min="200" step="50" type="range" />
                  <div className="flex justify-between mt-3 text-[16px] leading-[26px] text-on-surface-variant">
                    <span>$200</span>
                    <span className="text-warm-bronze font-bold">$1000</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-warm-bronze">pool</span>
                    <span className="font-semibold text-warm-bronze uppercase text-[12px] tracking-widest">Amenities</span>
                  </div>
                  <div className="space-y-3">
                    {["Free Wi-Fi", "HD TV", "AC", "Washing Machine"].map((a) => (
                      <label key={a} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 border-outline rounded text-warm-bronze focus:ring-warm-bronze" />
                        <span className="text-[16px] leading-[26px] text-on-surface-variant group-hover:text-warm-bronze transition-colors">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Room Type */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-warm-bronze">bed</span>
                    <span className="font-semibold text-warm-bronze uppercase text-[12px] tracking-widest">Room Type</span>
                  </div>
                  <div className="space-y-3">
                    {["Presidential", "Executive", "Deluxe"].map((t) => (
                      <label key={t} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 border-outline rounded text-warm-bronze focus:ring-warm-bronze" />
                        <span className="text-[16px] leading-[26px] text-on-surface-variant group-hover:text-warm-bronze transition-colors">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-deep-navy text-soft-cream py-4 text-[14px] leading-[20px] tracking-widest font-semibold hover:bg-warm-bronze transition-colors duration-300">
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Results */}
            <section className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-[32px] leading-[40px] text-on-surface">{rooms.length} Rooms Found</h2>
                <div className="flex items-center gap-2 text-on-surface-variant text-[14px] leading-[20px] tracking-widest font-semibold">
                  <span>Sort by:</span>
                  <select className="bg-transparent border-none focus:ring-0 font-bold text-primary cursor-pointer">
                    <option>Price (High to Low)</option>
                    <option>Price (Low to High)</option>
                    <option>Popularity</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white overflow-hidden border border-outline-variant/10 group flex flex-col md:flex-row h-full md:h-72 hover:shadow-md transition-shadow">
                    <div className="md:w-[40%] relative overflow-hidden h-64 md:h-full">
                      <Image src={getImage(room)} alt={room.room_type} width={600} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {badges[room.room_type] && (
                        <div className="absolute top-4 left-4 bg-warm-bronze text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1">{badges[room.room_type]}</div>
                      )}
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-heading text-[24px] leading-[32px] text-on-surface">{room.room_type}</h3>
                          <div className="text-right">
                            <span className="text-primary font-bold text-[20px] leading-[28px]">{currency}{room.price_per_night.toFixed(2)}</span>
                            <span className="text-on-surface-variant text-[12px] block">{currency === "$" ? "USD" : currency} / Night</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="bg-tertiary/10 text-tertiary text-[12px] font-bold px-2 py-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Available
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{room.description || "Experience unparalleled comfort in our carefully appointed accommodations."}</p>
                        <div className="flex flex-wrap gap-4 text-on-surface-variant">
                          <span className="flex items-center gap-1 text-[13px]"><span className="material-symbols-outlined text-[18px]">wifi</span> Free Wi-Fi</span>
                          <span className="flex items-center gap-1 text-[13px]"><span className="material-symbols-outlined text-[18px]">tv</span> Smart TV</span>
                          <span className="flex items-center gap-1 text-[13px]"><span className="material-symbols-outlined text-[18px]">ac_unit</span> AC</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mt-4">
                        <div className="flex items-center border border-outline-variant overflow-hidden">
                          <button className="px-3 py-2 hover:bg-surface-variant transition-colors"
                            onClick={() => setQuantities((q) => ({ ...q, [room.id]: Math.max(1, (q[room.id] || 1) - 1) }))}>
                            &minus;
                          </button>
                          <input className="w-10 text-center border-none focus:ring-0 text-sm bg-transparent" type="text" value={quantities[room.id] || 1} readOnly />
                          <button className="px-3 py-2 hover:bg-surface-variant transition-colors"
                            onClick={() => setQuantities((q) => ({ ...q, [room.id]: (q[room.id] || 1) + 1 }))}>
                            +
                          </button>
                        </div>
                        <button className="bg-warm-bronze text-white text-[14px] leading-[20px] tracking-widest font-semibold px-10 py-3 hover:bg-primary transition-colors">
                          Add Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-warm-bronze hover:text-white transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-warm-bronze text-white font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-warm-bronze hover:text-white transition-colors">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-warm-bronze hover:text-white transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-deep-navy text-soft-cream border-t-4 border-warm-bronze">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-[80px] grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-6">
            <h3 className="font-heading text-[32px] leading-[40px] font-medium text-primary">{hotelName}</h3>
            <p className="text-soft-cream/60 text-sm leading-relaxed">Experience the pinnacle of West African luxury, where tradition meets contemporary elegance in the heart of the city.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[20px]">public</span></a>
              <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[20px]">alternate_email</span></a>
              <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[20px]">share</span></a>
            </div>
          </div>
          <div>
            <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Contact Info</h5>
            <ul className="space-y-4 text-soft-cream/60 text-sm">
              <li className="flex items-start gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">location_on</span> Lagos, Nigeria</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">phone</span> +234 (0) 123 456 789</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">mail</span> concierge@twixhotel.com</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Quick Links</h5>
            <ul className="space-y-4 text-soft-cream/60 text-sm">
              <li><Link className="hover:text-warm-bronze transition-colors" href="/rooms">Our Suites</Link></li>
              <li><Link className="hover:text-warm-bronze transition-colors" href="/#dining">Dining Experiences</Link></li>
              <li><Link className="hover:text-warm-bronze transition-colors" href="/#facilities">Spa & Wellness</Link></li>
              <li><a className="hover:text-warm-bronze transition-colors" href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Legal</h5>
            <ul className="space-y-4 text-soft-cream/60 text-sm">
              <li><a className="hover:text-warm-bronze transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-warm-bronze transition-colors" href="#">Terms & Conditions</a></li>
              <li><a className="hover:text-warm-bronze transition-colors" href="#">Cancellation Policy</a></li>
              <li><Link className="hover:text-warm-bronze transition-colors" href="/login">Staff Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-soft-cream/40 text-[10px] uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Lagos</span>
            <span>Abuja</span>
            <span>Port Harcourt</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
