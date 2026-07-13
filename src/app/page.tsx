import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"
import { Reveal } from "@/components/public/reveal"
import { RoomCard } from "@/components/public/room-card"

export const revalidate = 60

const SERVICE_ICONS: Record<string, string> = {
  "airport pickup": "🚗",
  "welcome drinks": "🥂",
  "buffet breakfast": "🍳",
  "multi cuisine restaurant": "🍽️",
  "spa & wellness": "💆",
  childcare: "🧸",
  "swimming pool": "🏊",
  "billiard board": "🎱",
  "mini fridge": "🧊",
  "coffee & pastry shop": "☕",
  "laundry & dry cleaning": "👔",
  "car rental": "🚙",
  "conference & events": "📋",
  "24-hour room service": "🛎️",
  "on the rocks (bar)": "🍸",
  "wi-fi internet": "📶",
}

const BLOG_POSTS = [
  {
    title: "Top 5 Luxury Destinations to Visit This Year",
    excerpt: "Explore the most exclusive destinations that redefine luxury travel.",
    date: "March 15, 2026",
    image: "https://picsum.photos/seed/blog1/800/500",
  },
  {
    title: "A Guide to Fine Dining at TwixHotel",
    excerpt: "Discover culinary masterpieces crafted by our world-class chefs.",
    date: "March 10, 2026",
    image: "https://picsum.photos/seed/blog2/800/500",
  },
  {
    title: "Wellness Retreats: Rejuvenate Body and Mind",
    excerpt: "Immerse yourself in our exclusive wellness programs designed for total relaxation.",
    date: "March 5, 2026",
    image: "https://picsum.photos/seed/blog3/800/500",
  },
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
    supabase.from("amenities").select("*").eq("hotel_id", hotel.id).limit(16),
    supabase.from("reviews").select("*").eq("hotel_id", hotel.id).order("created_at", { ascending: false }).limit(6),
  ])

  const currency = hotel.currency_symbol || "$"
  const heroImage = hotel.cover_image || "https://picsum.photos/seed/hotel-hero/1920/1080"
  const aboutImage = "https://picsum.photos/seed/about-hotel/800/600"

  return (
    <div className="vg">
      <SiteHeader hotelName={hotel.name} phone={hotel.phone} email={hotel.email} />

      {/* ============== HERO ============== */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container max-w-7xl mx-auto px-6 lg:px-10 hero-content">
          <Reveal>
            <h1 className="hero-content__title">Discover Comfort and Luxury at {hotel.name}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="hero-content__desc">
              {hotel.description || "Where comfort meets unrivaled elegance, creating an exquisite haven for your ultimate relaxation."}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <a href="#rooms" className="btn--base" style={{ padding: "1rem 2.5rem", borderRadius: "0.375rem", fontSize: "1rem", fontWeight: 500, display: "inline-block" }}>
              Explore Rooms <ArrowRight className="w-4 h-4 inline-block ml-2" />
            </a>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="booking-filter">
              <form className="booking-filter__form">
                <div>
                  <input type="text" className="form-control" placeholder="Check in — Check out" />
                </div>
                <div>
                  <input type="number" className="form-control" placeholder="Adult" min={0} />
                </div>
                <div>
                  <input type="number" className="form-control" placeholder="Child" min={0} />
                </div>
                <div>
                  <button type="submit" className="btn--base w-100" style={{ padding: "0.875rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 500, border: "none", cursor: "pointer", width: "100%" }}>
                    Check Availability
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== ABOUT ============== */}
      <section className="about-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="about-thumb">
                <Image src={aboutImage} alt={hotel.name} width={800} height={600} className="w-full h-auto" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="section-heading" style={{ textAlign: "left" }}>
                <span className="section-heading__subtitle">Welcome to {hotel.name}</span>
                <h3 className="section-heading__title">A Beacon of Exceptional Hospitality</h3>
                <div className="section-heading__desc" style={{ textAlign: "left", marginLeft: 0, maxWidth: "100%" }}>
                  <p className="mb-4">
                    At {hotel.name}, we don&apos;t just offer accommodations; we curate unforgettable experiences for our valued guests. Our story is one of passion, dedication, and a relentless pursuit of excellence in the world of hospitality.
                  </p>
                  <p>
                    <strong>Our Mission:</strong> Our mission is simple yet profound — to be the epitome of hospitality, where every guest feels not just welcomed but truly at home.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============== SERVICES ============== */}
      {amenities && amenities.length > 0 && (
        <section className="services-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="section-heading">
                <span className="section-heading__subtitle">Our Awesome Services</span>
                <h3 className="section-heading__title">From Arrival to Departure</h3>
                <p className="section-heading__desc">Enjoy a flawless stay with our services, which promise a unique and amazing experience at every point.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {amenities.map((a, i) => (
                <Reveal key={a.id} delay={(i % 8) * 0.05}>
                  <div className="service-item">
                    <div className="service-item__icon">
                      <span className="text-2xl">{SERVICE_ICONS[a.name?.toLowerCase() || ""] || "⭐"}</span>
                    </div>
                    <h5 className="service-item__title">{a.name}</h5>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== FACILITIES ============== */}
      <section id="facilities" className="facilities-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="section-heading">
              <span className="section-heading__subtitle">Facilities</span>
              <h3 className="section-heading__title">Explore the Range of Facilities</h3>
              <p className="section-heading__desc">Discover the array of facilities designed to enhance your stay and ensure a memorable experience.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "Airport Shuttle", image: "https://picsum.photos/seed/facility1/600/400" },
              { title: "Meeting and Event Spaces", image: "https://picsum.photos/seed/facility2/600/400" },
              { title: "Spa and Wellness Center", image: "https://picsum.photos/seed/facility3/600/400" },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="facility-item">
                  <div className="facility-item__thumb">
                    <Image src={f.image} alt={f.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <h5 className="facility-item__title">
                    <a href="#facilities">{f.title}</a>
                  </h5>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="text-center mt-12">
              <a href="#facilities" className="btn--base" style={{ padding: "0.875rem 2rem", borderRadius: "0.375rem", fontSize: "0.9375rem", display: "inline-block" }}>
                View All
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== FEATURED ROOMS ============== */}
      <section id="rooms" className="rooms-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="section-heading">
              <span className="section-heading__subtitle">Featured Rooms</span>
              <h3 className="section-heading__title">World Class Luxury Hotel</h3>
              <p className="section-heading__desc">Indulge in luxury — explore our featured rooms for an unforgettable stay.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
          <Reveal>
            <div className="text-center mt-12">
              <a href="#rooms" className="btn--base" style={{ padding: "0.875rem 2rem", borderRadius: "0.375rem", fontSize: "0.9375rem", display: "inline-block" }}>
                View All
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== RESTAURANT ============== */}
      <section className="restaurant-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="section-heading">
              <span className="section-heading__subtitle">Our Restaurant</span>
              <h3 className="section-heading__title">Delicious Food Menu</h3>
              <p className="section-heading__desc">Savor the Flavor: Immerse yourself in a culinary journey at our restaurant.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {["restaurant1", "restaurant2", "restaurant3", "restaurant4"].map((seed, i) => (
              <Reveal key={seed} delay={i * 0.08}>
                <div className="restaurant-item" style={{ aspectRatio: "1/1" }}>
                  <Image src={`https://picsum.photos/seed/${seed}/600/600`} alt="Restaurant" fill sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      {reviews && reviews.length > 0 && (
        <section className="testimonials-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="section-heading">
                <span className="section-heading__subtitle">Guests Speak</span>
                <h3 className="section-heading__title">About Their Unforgettable Experiences</h3>
                <p className="section-heading__desc">Dive into the authentic experiences shared by our cherished guests.</p>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r, i) => (
                <Reveal key={r.id} delay={i * 0.1}>
                  <div className="testimonial-item">
                    <div className="testimonial-item__stars">
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <span key={s}>★</span>
                      ))}
                    </div>
                    <p className="testimonial-item__desc">&ldquo;{r.comment}&rdquo;</p>
                    <div className="testimonial-item__author">
                      <div className="testimonial-item__avatar">
                        <Image src={`https://picsum.photos/seed/guest${r.id}/100/100`} alt={r.guest_name || "Guest"} width={48} height={48} />
                      </div>
                      <div>
                        <p className="testimonial-item__name">{r.guest_name || "Guest"}</p>
                        <span className="testimonial-item__role">Valued Guest</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== BLOG ============== */}
      <section className="blog-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="section-heading">
              <span className="section-heading__subtitle">Latest News</span>
              <h3 className="section-heading__title">Our Recent Articles</h3>
              <p className="section-heading__desc">Stay updated with the latest from our world.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.title} delay={i * 0.1}>
                <div className="blog-card">
                  <div className="blog-card__thumb">
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <div className="blog-card__content">
                    <p className="blog-card__date">{post.date}</p>
                    <h5 className="blog-card__title">
                      <a href="#">{post.title}</a>
                    </h5>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="cta-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal>
            <h2>Ready When You Are</h2>
            <p>Check-in {hotel.check_in_time || "14:00"} &middot; Check-out {hotel.check_out_time || "12:00"}</p>
            {hotel.address && (
              <p className="flex items-center justify-center gap-2 text-sm mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
                <MapPin className="w-4 h-4" /> {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
              </p>
            )}
            <a href="#rooms" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium" style={{ backgroundColor: "white", color: "var(--vg-purple)" }}>
              Book Your Stay <ArrowRight className="w-4 h-4" />
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
