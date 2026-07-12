import Image from "next/image"
import Link from "next/link"
import {
  Wifi, Waves, UtensilsCrossed, Dumbbell, Car, Wine,
  Star, Quote, ArrowDown, CalendarCheck, Users2, MapPin,
} from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"
import { Reveal } from "@/components/public/reveal"
import { RoomCard } from "@/components/public/room-card"

export const revalidate = 60

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  wifi: Wifi, pool: Waves, restaurant: UtensilsCrossed, gym: Dumbbell,
  parking: Car, bar: Wine,
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const { data: hotel } = await supabase
    .from("hotels")
    .select("*")
    .eq("status", 1)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
        <div>
          <h1 className="text-2xl font-semibold text-dark mb-3">No hotel set up yet</h1>
          <p className="text-muted mb-6">Complete setup to launch your public site.</p>
          <Link href="/setup" className="btn-primary btn-lg">Go to setup</Link>
        </div>
      </div>
    )
  }

  const [{ data: rooms }, { data: amenities }, { data: reviews }] = await Promise.all([
    supabase.from("rooms").select("*").eq("hotel_id", hotel.id).order("price_per_night", { ascending: false }).limit(6),
    supabase.from("amenities").select("*").eq("hotel_id", hotel.id).limit(8),
    supabase.from("reviews").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false }).limit(6),
  ])

  const currency = hotel.currency_symbol || "$"
  const heroImage = hotel.cover_image || "https://picsum.photos/seed/hotel-hero/1920/1080"
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="hg">
      <SiteHeader hotelName={hotel.name} phone={hotel.phone} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <Image src={heroImage} alt={hotel.name} fill priority className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(11,31,26,0.55) 0%, rgba(11,31,26,0.35) 40%, rgba(11,31,26,0.95) 100%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-28 pt-40 w-full">
          <Reveal>
            <p className="hg-eyebrow mb-5">
              {hotel.city ? `${hotel.city}, ${hotel.country || ""}` : "Welcome"}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl mb-6" style={{ color: "var(--hg-ivory)" }}>
              {hotel.name}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg max-w-xl mb-12" style={{ color: "var(--hg-sage)" }}>
              {hotel.description || "A considered stay — refined rooms, a bar worth lingering at, and a pool that makes leaving hard."}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div
              className="rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-stretch gap-2 backdrop-blur-md border max-w-3xl"
              style={{ backgroundColor: "rgba(18,51,42,0.7)", borderColor: "var(--hg-line)" }}
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--hg-surface-2)" }}>
                <CalendarCheck className="w-4 h-4 shrink-0" style={{ color: "var(--hg-gold)" }} />
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--hg-sage)" }}>Check in — Check out</p>
                  <p className="text-sm" style={{ color: "var(--hg-ivory)" }}>Select dates</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--hg-surface-2)" }}>
                <Users2 className="w-4 h-4 shrink-0" style={{ color: "var(--hg-gold)" }} />
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--hg-sage)" }}>Guests</p>
                  <p className="text-sm" style={{ color: "var(--hg-ivory)" }}>2 Adults</p>
                </div>
              </div>
              <a href="#rooms" className="hg-btn-gold sm:px-9">Check Availability</a>
            </div>
          </Reveal>
        </div>

        <a href="#rooms" className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-xs" style={{ color: "var(--hg-sage)" }}>
          <span className="rotate-90 origin-center tracking-widest hidden sm:block">SCROLL</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </section>

      {/* ---------------- AMENITIES STRIP ---------------- */}
      {amenities && amenities.length > 0 && (
        <section className="py-16 border-y" style={{ borderColor: "var(--hg-line)", backgroundColor: "var(--hg-bg-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {amenities.slice(0, 8).map((a) => {
                const Icon = AMENITY_ICONS[a.icon?.toLowerCase() || ""] || Star
                return (
                  <Reveal key={a.id}>
                    <div className="flex flex-col items-center text-center gap-3">
                      <Icon className="w-6 h-6" style={{ color: "var(--hg-gold)" }} />
                      <p className="text-sm" style={{ color: "var(--hg-ivory)" }}>{a.name}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- ROOMS ---------------- */}
      <section id="rooms" className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <Reveal>
              <div>
                <p className="hg-eyebrow mb-3">Rooms &amp; Suites</p>
                <h2 className="font-display text-4xl sm:text-5xl max-w-xl" style={{ color: "var(--hg-ivory)" }}>
                  Every room, its own point of view
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-sm" style={{ color: "var(--hg-sage)" }}>
                From standard rooms to the penthouse, each is designed around light, quiet, and a proper night&apos;s sleep.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rooms || []).map((room, i) => (
              <Reveal key={room.id} delay={(i % 3) * 0.08}>
                <RoomCard
                  room={{
                    id: room.id,
                    room_number: room.room_number,
                    room_type: room.room_type,
                    description: room.description,
                    capacity: room.capacity,
                    price_per_night: Number(room.price_per_night),
                    images: room.images,
                    currencySymbol: currency,
                  }}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DINING ---------------- */}
      <section id="dining" className="py-28" style={{ backgroundColor: "var(--hg-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/hotel-bar/1200/900" alt="Bar & dining" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="hg-eyebrow mb-4">Bar &amp; Restaurant</p>
            <h2 className="font-display text-4xl mb-6" style={{ color: "var(--hg-ivory)" }}>
              A bar that earns the detour
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--hg-sage)" }}>
              Order from your table, the pool deck, or straight to your room — the full bar and kitchen menu is
              always one tap away, and it lands on your bill automatically.
            </p>
            <a href="#contact" className="hg-btn-outline">Reserve a table</a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- POOL ---------------- */}
      <section id="pool" className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="https://picsum.photos/seed/hotel-pool/1200/900" alt="Pool" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <p className="hg-eyebrow mb-4">Pool &amp; Wellness</p>
            <h2 className="font-display text-4xl mb-6" style={{ color: "var(--hg-ivory)" }}>
              Slow mornings, longer evenings
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--hg-sage)" }}>
              Open to guests and day-pass visitors alike, with a poolside menu and loungers worth booking ahead for.
            </p>
            <a href="#contact" className="hg-btn-outline">Book a day pass</a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section id="gallery" className="py-28" style={{ backgroundColor: "var(--hg-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="hg-eyebrow mb-3 text-center">Gallery</p>
            <h2 className="font-display text-4xl text-center mb-14" style={{ color: "var(--hg-ivory)" }}>
              A feel for the place
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["lobby", "suite-detail", "rooftop", "spa", "corridor", "terrace", "breakfast", "night-bar"].map((seed, i) => (
              <Reveal key={seed} delay={(i % 4) * 0.06} className={i === 0 || i === 5 ? "row-span-2" : ""}>
                <div className={`relative rounded-xl overflow-hidden ${i === 0 || i === 5 ? "aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={`https://picsum.photos/seed/${seed}/600/800`} alt={seed} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      {reviews && reviews.length > 0 && (
        <section className="py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="flex items-center justify-center gap-2 mb-3">
                {avgRating && (
                  <>
                    <Star className="w-4 h-4 fill-current" style={{ color: "var(--hg-gold)" }} />
                    <span className="text-sm" style={{ color: "var(--hg-ivory)" }}>{avgRating} average, {reviews.length} reviews</span>
                  </>
                )}
              </div>
              <h2 className="font-display text-4xl text-center mb-14" style={{ color: "var(--hg-ivory)" }}>
                What guests remember
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r, i) => (
                <Reveal key={r.id} delay={i * 0.1}>
                  <div className="rounded-2xl p-8 h-full" style={{ backgroundColor: "var(--hg-surface)" }}>
                    <Quote className="w-6 h-6 mb-4" style={{ color: "var(--hg-gold)" }} />
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--hg-ivory)" }}>
                      &ldquo;{r.comment}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: "var(--hg-sage)" }}>{r.guest_name || "Guest"}</span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--hg-gold)" }} />
                        ))}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CONTACT / CTA ---------------- */}
      <section id="contact" className="py-28" style={{ backgroundColor: "var(--hg-bg-alt)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <p className="hg-eyebrow mb-4">Plan your stay</p>
            <h2 className="font-display text-4xl sm:text-5xl mb-6" style={{ color: "var(--hg-ivory)" }}>
              Ready when you are
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--hg-sage)" }}>
              Check-in {hotel.check_in_time || "14:00"} &middot; Check-out {hotel.check_out_time || "12:00"}
            </p>
            {hotel.address && (
              <p className="flex items-center justify-center gap-2 text-sm mb-10" style={{ color: "var(--hg-sage)" }}>
                <MapPin className="w-4 h-4" style={{ color: "var(--hg-gold)" }} />
                {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
              </p>
            )}
            <a href="#rooms" className="hg-btn-gold">Check Availability</a>
          </Reveal>
        </div>
      </section>

      <SiteFooter
        hotelName={hotel.name}
        description={hotel.description}
        address={hotel.address}
        city={hotel.city}
        country={hotel.country}
        email={hotel.email}
        phone={hotel.phone}
      />
    </div>
  )
}
