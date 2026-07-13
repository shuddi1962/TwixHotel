import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"
import { Reveal } from "@/components/public/reveal"
import { RoomCard } from "@/components/public/room-card"

export const revalidate = 60

const NIGERIAN_DISHES = [
  { name: "Jollof Rice", desc: "Smoky tomato rice with peppers & spices", seed: "jollof-rice" },
  { name: "Egusi Soup", desc: "Melon seed stew with spinach & assorted meat", seed: "egusi-soup" },
  { name: "Suya Skewers", desc: "Spiced grilled beef with peanut-chili crust", seed: "suya-skewers" },
  { name: "Pounded Yam & Ogbono", desc: "Smooth swallow with wild mango seed soup", seed: "pounded-yam" },
  { name: "Moi Moi", desc: "Steamed bean pudding with peppers & eggs", seed: "moi-moi" },
  { name: "Pepper Soup", desc: "Aromatic broth with goat meat & herbs", seed: "pepper-soup" },
  { name: "Fried Rice", desc: "Nigerian party fried rice with vegetables", seed: "fried-rice" },
  { name: "Small Chops", desc: "Assorted appetizers — puff puff, samosa, spring rolls", seed: "small-chops" },
]

const FACILITIES = [
  { title: "Infinity Pool & Wellness", image: "pool-luxury", desc: "Overlooking the city skyline" },
  { title: "Spa & Hammam", image: "spa-treatment", desc: "Traditional and modern therapies" },
  { title: "Executive Lounge", image: "lounge-bar", desc: "With panoramic views" },
]

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
    supabase.from("amenities").select("*").eq("hotel_id", hotel.id).limit(12),
    supabase.from("reviews").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false }).limit(4),
  ])

  const currency = hotel.currency_symbol || "$"
  const heroImage = hotel.cover_image || "https://picsum.photos/seed/luxury-suite-hero/1920/1200"

  return (
    <div className="vg">

      <SiteHeader hotelName={hotel.name} />

      {/* =================== HERO =================== */}
      <section className="hero">
        <div className="hero-bg">
          <Image src={heroImage} alt={hotel.name} fill priority className="object-cover" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 mb-6">
                <span className="w-8 h-px bg-white/30" />
                {hotel.city || "Lagos"}, {hotel.country || "Nigeria"}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="hero-title">
                {hotel.name}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero-sub">
                {hotel.description || "Where understated luxury meets genuine hospitality — every stay becomes a story worth telling."}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap gap-3">
                <a href="#rooms" className="btn-gold">
                  Explore Rooms <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#dining" className="btn-outline">
                  View Dining
                </a>
              </div>
            </Reveal>

            {/* Floating booking bar */}
            <Reveal delay={0.32}>
              <div className="hero-booking mt-10">
                <div className="grid">
                  <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Check-in — Check-out</p>
                    <p className="text-sm text-white">Select dates</p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Adults</p>
                    <p className="text-sm text-white">2</p>
                  </div>
                  <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Children</p>
                    <p className="text-sm text-white">0</p>
                  </div>
                  <a href="#rooms" className="btn-gold justify-center px-6 py-3 rounded-xl w-full">
                    Check Availability
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =================== ABOUT =================== */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="about-grid">
            <Reveal>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/hotel-lobby-luxury/900/1100"
                  alt={hotel.name}
                  width={900}
                  height={1100}
                  className="w-full h-auto"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="section-tag">Welcome</span>
              <h2 className="section-title">A New Standard in Hospitality</h2>
              <p className="section-desc mb-6">
                At {hotel.name}, we redefine what it means to stay. Every corner is considered,
                every detail intentional — from the whispered hum of the city below to the silence
                of a suite designed for deep rest.
              </p>
              <p className="section-desc mb-8">
                Founded with a passion for genuine hospitality, we believe the best stays are
                the ones where you forget you ever left home — and remember the feeling long after.
              </p>
              <a href="#rooms" className="btn-gold">
                Discover More <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =================== ROOMS =================== */}
      <section id="rooms" className="section-padding" style={{ background: "var(--vg-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <span className="section-tag">Rooms &amp; Suites</span>
                <h2 className="section-title max-w-xl">Every room has a point of view</h2>
              </div>
              <p className="section-desc text-sm max-w-sm">
                From intimate standard rooms to sprawling penthouses — each space is designed around light, quiet, and a proper night&apos;s sleep.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* =================== SERVICES =================== */}
      {amenities && amenities.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="section-tag">Amenities</span>
                <h2 className="section-title">Everything you need</h2>
                <p className="section-desc mx-auto">
                  From arrival to departure — every service is designed to make your stay seamless and memorable.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {amenities.map((a, i) => (
                <Reveal key={a.id} delay={(i % 8) * 0.05}>
                  <div className="service-card">
                    <p className="text-3xl mb-3">{["🛎️", "🥂", "🍳", "🍽️", "💆", "🧸", "🏊", "🎱", "🧊", "☕", "👔", "🚙"][i % 12]}</p>
                    <p className="text-sm font-medium text-white/90">{a.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== FACILITIES =================== */}
      <section id="facilities" className="section-padding" style={{ background: "var(--vg-bg-alt)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="section-tag">Facilities</span>
              <h2 className="section-title">Designed for living</h2>
              <p className="section-desc mx-auto">
                More than amenities — spaces that invite you to linger, connect, and recharge.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {FACILITIES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="facility-card">
                  <div className="facility-card__image">
                    <Image src={`https://picsum.photos/seed/${f.image}/700/500`} alt={f.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="facility-card__title">
                    <p className="text-xs text-white/40 tracking-widest uppercase mb-1">{f.desc}</p>
                    {f.title}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =================== DINING — NIGERIAN CUISINE =================== */}
      <section id="dining" className="section-padding">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <span className="section-tag">Our Kitchen</span>
                <h2 className="section-title max-w-xl">Taste of Nigeria</h2>
              </div>
              <p className="section-desc text-sm max-w-sm">
                From the smoky heat of party jollof to the comforting depth of egusi — our chefs
                honour every regional tradition with ingredient-led cooking and a modern hand.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {NIGERIAN_DISHES.map((dish, i) => (
              <Reveal key={dish.name} delay={(i % 8) * 0.06}>
                <div className="food-card">
                  <Image src={`https://picsum.photos/seed/${dish.seed}/600/600`} alt={dish.name} fill sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="food-card__label">
                    <p className="font-display text-base mb-0.5">{dish.name}</p>
                    <p className="text-xs text-white/60">{dish.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TESTIMONIALS =================== */}
      {reviews && reviews.length > 0 && (
        <section className="section-padding" style={{ background: "var(--vg-bg-alt)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="section-tag">Guest Stories</span>
                <h2 className="section-title">What they remember</h2>
                <p className="section-desc mx-auto">
                  Not just reviews — the moments that turn a stay into a memory.
                </p>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {reviews.slice(0, 4).map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <div className="testimonial-card">
                    <div className="stars mb-3">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </div>
                    <p className="text-sm leading-relaxed text-white/80 mb-6">&ldquo;{r.comment}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-sm font-medium text-white/60">
                        {(r.guest_name || "G")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{r.guest_name || "Guest"}</p>
                        <p className="text-xs text-white/40">Valued guest</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== CTA =================== */}
      <section className="cta section-padding">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <span className="section-tag">Plan your stay</span>
            <h2 className="section-title text-center max-w-2xl mx-auto">
              Ready when you are
            </h2>
            <p className="section-desc mx-auto mb-2">
              Check-in {hotel.check_in_time || "14:00"} &middot; Check-out {hotel.check_out_time || "12:00"}
            </p>
            {hotel.address && (
              <p className="flex items-center justify-center gap-2 text-sm mb-10" style={{ color: "var(--vg-sage)" }}>
                <MapPin className="w-4 h-4" style={{ color: "var(--vg-gold)" }} />
                {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
              </p>
            )}
            <a href="#rooms" className="btn-gold text-base px-10 py-4">
              Book Your Stay <ArrowRight className="w-5 h-5" />
            </a>
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
