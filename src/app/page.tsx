import Image from "next/image"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/public/site-header"
import { SiteFooter } from "@/components/public/site-footer"
import { Reveal } from "@/components/public/reveal"
import { RoomCard } from "@/components/public/room-card"
import { CookieBanner } from "@/components/public/cookie-banner"

export const dynamic = 'force-dynamic'

const SERVICE_ICONS = [
  "local_taxi", "local_bar", "restaurant", "dinner_dining",
  "spa", "child_care", "pool", "sports_handball",
  "kitchen", "coffee", "local_laundry_service", "car_rental",
  "meeting_room", "room_service", "liquor", "wifi",
]

const FACILITIES_LIST = [
  { icon: "local_taxi", label: "Airport Pickup" },
  { icon: "local_bar", label: "Welcome Drinks" },
  { icon: "restaurant", label: "Buffet Breakfast" },
  { icon: "dinner_dining", label: "Multi Cuisine Restaurant" },
  { icon: "spa", label: "Spa and Wellness" },
  { icon: "child_care", label: "Childcare" },
  { icon: "pool", label: "Swimming Pool" },
  { icon: "sports_handball", label: "Billiard Board" },
  { icon: "kitchen", label: "Mini Fridge" },
  { icon: "coffee", label: "Coffee & Pastry Shop" },
  { icon: "local_laundry_service", label: "Laundry & Dry Cleaning" },
  { icon: "car_rental", label: "Car Rental" },
  { icon: "meeting_room", label: "Conference Facilities" },
  { icon: "room_service", label: "24-Hour Room Service" },
  { icon: "liquor", label: "On the Rocks (Bar)" },
  { icon: "wifi", label: "Wi-Fi Internet" },
]

const DINING_ITEMS = [
  { icon: "set_meal", title: "Seafood Okra with Lobster", desc: "Traditional chunky okra soup elevated with fresh Atlantic lobster tails and pan-seared scallops." },
  { icon: "dinner_dining", title: "Moin-Moin Souffl\u00e9", desc: "A delicate, airy interpretation of steamed bean pudding, served with spiced tomato coulis." },
  { icon: "rice_bowl", title: "Jollof Risotto", desc: "Arborio rice slow-cooked in a spicy jollof reduction, finished with charred plantain dust." },
]

const HERO_IMG = "https://lh3.googleusercontent.com/aida/AP1WRLvlGZvUt82wKd2R1A6LYoa61qYjzh_RRInZbXEpUeUQWxwh_b_BBFBBqyKRQmgDkZO49p1d5nqiY4QLQLi3U3KGULzflmZsTuwrLutKvsggas-Uw6OS2cvgcfn-KVpgGiwKSfF6Aw1CFssWI_TIxV7fDQa5czCmO_TBTe53EBcn_8Qs9av2gFoLNQuyo4QGEuQlG0rirFdKQ1YBclIMWr9uPOtOHMakjeB65VuoO4PxBJzO_jdiQuLzTonb"
const STORY_IMG = "https://lh3.googleusercontent.com/aida/AP1WRLs7Oc52in6iQ-zLnRWzV7oA6wDUoPTfdAwPoJdqygmZW6jALonWIURf1xpXxGcqrZE7SA8luqF50eOso80BI12Qin2WNRolhi4kYPl1fQzHkzRo6zvt7BuCzaRU-TgPSqdkH4SbJ7NbBBzbb7ohGzQtcYb7sy9TONCWS5koeorXJR5TvE1rIf2_0PZYzUMYWO69c7ha-ux-JJNGVl9Yi6GoI6weptLINK5rntv9cZslfvCmQQVZwxGfdWw2"
const STORY_IMG2 = "https://lh3.googleusercontent.com/aida/AP1WRLsr6YCIEVqF1Pj5TvfHhXfE1iQiM2W_D1cM4CB7PAlGj-N-9fhC2bu9gF91s4UxmxPeuYQQbIoj5IOqbSP9e6S_W8zQdeuJSta7OSLyZqkDfHxOBdwhgnG5vt77RncQBHSg13_PxyOOG1a7Sz7rqt4wuIQeQvLQCtV4Vq_OtfpY2B89-dG5EsBpHepyGr6WZ4tGIp_zRoBEWicbj2ZY-fLMNdsfUBlR1GQ21WiCznX2KhzxJnNOmXKuPDL1"
const DINING_IMG = "https://lh3.googleusercontent.com/aida/AP1WRLvOm7K_T0YXtEtNhJWs_Ibnb6Elz_bTM56Uh4l0VZfG6LklnLQN3QZXMM368X3Ai0UeReExbwVDgZf4snGOanUugVMBCVHd7PZaGrAD60VuVo5t11CkA7ZF6tLkfQCGPBPVRwyCxShGhrnorYgYLelHeMp1Z7F0decHxYC2f7crKzElXHkue08nfQsr5HTSwV6B-zcWhnVWgRoyvumZy0V9KzWMLRlubHneLmm5q3gXU5z0NWWmWrLl_5M"
const TESTIMONIAL_IMG = "https://lh3.googleusercontent.com/aida/AP1WRLuwoFTwcOoOUDQdB5iuG0GPHdvV3hT7QE4UmX82Isbw53VkS-4N-osIiXrUiQ3q08DT5soHFfgezhtcfpjZksVOxRwL9D4NaG-XjhDDeWvT8g_4Nc9ra4BNOGmyGRxtZ3URLYs7Ne2a-md-FpDnu2vRMMaIOcZIrM-md4aXJOsdAcEwmrgFTVmpKBXP2q93e8hrnEY0Xwg0xr3_QwBQVrk-87IPls3cSpJ7VBPrPfqPpXt2mp4cOXWdnks_"

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
          <h1 className="text-2xl font-semibold mb-3" style={{ color: "var(--color-on-surface)" }}>No hotel set up yet</h1>
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
  const heroImage = hotel.cover_image || HERO_IMG

  return (
    <div className="vg overflow-x-hidden">

      <SiteHeader hotelName={hotel.name} />

      {/* =================== HERO =================== */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage} alt={hotel.name} fill priority className="object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 w-full px-5 md:px-6 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 flex flex-col justify-center text-white animate-fade-in">
            <h1 className="font-heading text-[40px] md:text-[64px] leading-[1.1] md:leading-[72px] tracking-[-0.01em] md:tracking-[-0.02em] font-semibold mb-6">
              Discover Comfort <br />and <span className="italic text-warm-bronze">Luxury</span> at {hotel.name}
            </h1>
            <p className="text-[18px] leading-[30px] max-w-xl opacity-90">
              {hotel.description || "Where heritage meets unrivaled elegance, creating an exquisite haven for your ultimate relaxation in the heart of the city."}
            </p>
          </div>
          <div className="md:col-span-5 flex items-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-soft-cream/95 p-8 w-full shadow-2xl backdrop-blur-md">
              <h3 className="text-[20px] leading-[28px] font-semibold text-deep-navy mb-6">Book Your Room</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b border-charcoal/10 pb-2">
                    <label className="block text-[10px] text-outline uppercase tracking-widest mb-1 font-semibold">Check In</label>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                      <span className="text-[16px] leading-[26px] text-on-surface">30 Dec 2024</span>
                    </div>
                  </div>
                  <div className="border-b border-charcoal/10 pb-2">
                    <label className="block text-[10px] text-outline uppercase tracking-widest mb-1 font-semibold">Check Out</label>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                      <span className="text-[16px] leading-[26px] text-on-surface">02 Jan 2025</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b border-charcoal/10 pb-2">
                    <label className="block text-[10px] text-outline uppercase tracking-widest mb-1 font-semibold">Adult</label>
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] leading-[26px] text-on-surface">2</span>
                      <span className="material-symbols-outlined text-primary text-sm">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="border-b border-charcoal/10 pb-2">
                    <label className="block text-[10px] text-outline uppercase tracking-widest mb-1 font-semibold">Child</label>
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] leading-[26px] text-on-surface">0</span>
                      <span className="material-symbols-outlined text-primary text-sm">keyboard_arrow_down</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-warm-bronze text-white py-4 text-[14px] leading-[20px] tracking-widest font-semibold uppercase mt-4 hover:bg-primary transition-all">Check Availability</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== OUR STORY =================== */}
      <section className="py-[120px] max-w-[1280px] mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Image src={STORY_IMG} alt="Hotel detail" width={400} height={500} className="w-full aspect-[4/5] object-cover" />
                <Image src={STORY_IMG} alt="Hotel detail" width={400} height={400} className="w-full aspect-square object-cover" />
              </div>
              <div className="pt-12">
                <Image src={STORY_IMG2} alt="Hotel detail" width={400} height={500} className="w-full aspect-[4/5] object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-warm-bronze w-32 h-32 hidden lg:block" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">Welcome to {hotel.name}</span>
          <h2 className="font-heading text-[48px] leading-[56px] font-medium text-deep-navy mb-8">A Beacon of Exceptional Hospitality</h2>
          <p className="text-[18px] leading-[30px] text-on-surface-variant mb-10">
            At {hotel.name}, we don&apos;t just offer accommodations; we curate unforgettable experiences. Our story is one of passion, dedication, and a relentless pursuit of excellence in the world of hospitality, merging international standards with Nigerian warmth.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-[20px] leading-[28px] font-semibold flex items-center gap-2">
                <span className="w-8 h-px bg-warm-bronze" />
                Our Mission
              </h4>
              <p className="text-on-surface-variant text-sm">To be the epitome of hospitality, where every guest feels truly at home through comfort and meticulous care.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[20px] leading-[28px] font-semibold flex items-center gap-2">
                <span className="w-8 h-px bg-warm-bronze" />
                Schedule
              </h4>
              <div className="flex flex-col gap-2 text-on-surface-variant text-sm">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">login</span> Check In: {hotel.check_in_time || "02:00 PM"}</span>
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">logout</span> Check Out: {hotel.check_out_time || "12:00 PM"}</span>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <a href="#" className="inline-flex items-center gap-3 text-primary text-[14px] leading-[20px] tracking-widest font-semibold uppercase border-b border-primary pb-1 hover:gap-5 transition-all">Read Our Story</a>
          </div>
        </Reveal>
      </section>

      {/* =================== SERVICES =================== */}
      {(amenities && amenities.length > 0) ? (
        <section className="py-[120px] bg-soft-cream">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <div className="text-center mb-16">
              <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">OUR AWESOME SERVICES</span>
              <h2 className="font-heading text-[48px] leading-[56px] font-medium text-deep-navy mb-6">From Arrival to Departure</h2>
              <div className="w-16 h-px bg-warm-bronze mx-auto mb-8" />
              <p className="text-[16px] leading-[26px] text-on-surface-variant max-w-2xl mx-auto">Indulge in a seamless stay with {hotel.name}&apos;s bespoke services, ensuring a personalized and unforgettable experience at every turn.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.slice(0, 16).map((a, i) => (
                <Reveal key={a.id} delay={(i % 8) * 0.05}>
                  <div className="service-card">
                    <span className="material-symbols-outlined text-warm-bronze text-3xl mb-4">{SERVICE_ICONS[i % SERVICE_ICONS.length]}</span>
                    <h4 className="text-[16px] leading-[28px] font-semibold text-deep-navy">{a.name}</h4>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-[120px] bg-soft-cream">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <div className="text-center mb-16">
              <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">OUR AWESOME SERVICES</span>
              <h2 className="font-heading text-[48px] leading-[56px] font-medium text-deep-navy mb-6">From Arrival to Departure</h2>
              <div className="w-16 h-px bg-warm-bronze mx-auto mb-8" />
              <p className="text-[16px] leading-[26px] text-on-surface-variant max-w-2xl mx-auto">Indulge in a seamless stay with bespoke services ensuring a personalized experience at every turn.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {FACILITIES_LIST.map((f, i) => (
                <Reveal key={f.label} delay={(i % 8) * 0.05}>
                  <div className="service-card">
                    <span className="material-symbols-outlined text-warm-bronze text-3xl mb-4">{f.icon}</span>
                    <h4 className="text-[16px] leading-[28px] font-semibold text-deep-navy">{f.label}</h4>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================== ROOMS =================== */}
      <section className="py-[120px] bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <div className="text-center mb-16">
            <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">Rooms &amp; Suites</span>
            <h2 className="font-heading text-[48px] leading-[56px] font-medium text-deep-navy">A Symphony of Comfort and Style</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="mt-16 text-center">
            <Link className="inline-flex items-center gap-3 bg-deep-navy text-white px-12 py-5 text-[14px] leading-[20px] tracking-widest font-semibold uppercase hover:bg-charcoal transition-all" href="/rooms">
              Explore All Suites
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =================== DINING =================== */}
      <section className="py-[120px] bg-soft-cream">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div>
              <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">Fine Dining</span>
              <h2 className="font-heading text-[48px] leading-[56px] font-medium text-deep-navy mb-8">Glocal Nigerian Delicacies</h2>
              <p className="text-[18px] leading-[30px] text-on-surface-variant mb-10">
                Experience the intersection of global culinary standards and authentic Nigerian flavors. Our chefs reinterpret traditional recipes with contemporary luxury.
              </p>
              <div className="space-y-8">
                {DINING_ITEMS.map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center shrink-0 text-warm-bronze group-hover:bg-warm-bronze group-hover:text-white transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[20px] leading-[28px] font-semibold mb-1">{item.title}</h4>
                      <p className="text-on-surface-variant text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="aspect-square relative">
              <Image src={DINING_IMG} alt="Dining" width={600} height={600} className="w-full h-full object-cover rounded-full border-[20px] border-surface-container shadow-2xl" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-warm-bronze/5 rounded-full blur-3xl -z-10" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* =================== FACILITIES =================== */}
      <section className="py-[120px] bg-deep-navy text-soft-cream">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="text-[14px] leading-[20px] tracking-[0.25em] uppercase text-warm-bronze font-semibold mb-4 block">World Class Facilities</span>
                <h2 className="font-heading text-[48px] leading-[56px] font-medium">Our Awesome Services</h2>
              </div>
              <a className="text-warm-bronze text-[14px] leading-[20px] tracking-widest font-semibold uppercase flex items-center gap-2 hover:opacity-80 transition-all" href="#">
                View All Facilities
                <span className="material-symbols-outlined text-sm">north_east</span>
              </a>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-12">
            {FACILITIES_LIST.map((f, i) => (
              <Reveal key={f.label} delay={(i % 8) * 0.05}>
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-warm-bronze text-2xl">{f.icon}</span>
                  <span className="text-[18px] leading-[28px] font-semibold">{f.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TESTIMONIAL =================== */}
      {reviews && reviews.length > 0 && (
        <section className="py-[120px] overflow-hidden bg-white">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Reveal>
                <span className="material-symbols-outlined text-warm-bronze text-6xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <blockquote className="font-heading text-[32px] leading-[40px] text-deep-navy mb-10 italic">
                  &ldquo;{reviews[0].comment}&rdquo;
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
                    <Image src={TESTIMONIAL_IMG} alt={reviews[0].guest_name || "Guest"} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                  <cite className="not-italic text-[20px] leading-[28px] font-semibold text-deep-navy">{reviews[0].guest_name || "Valued Guest"}</cite>
                  <span className="text-on-surface-variant text-[10px] tracking-widest font-semibold uppercase mt-1">Valued Guest</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* =================== NEWSLETTER =================== */}
      <section className="bg-warm-bronze py-20">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6 text-center text-white">
          <h2 className="font-heading text-[32px] leading-[40px] font-medium mb-4">Stay Updated with {hotel.name}</h2>
          <p className="max-w-2xl mx-auto mb-10 opacity-80 text-[16px] leading-[26px]">Subscribe to our newsletter and be the first to know about exclusive offers, new amenities, and cultural events.</p>
          <form className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">
            <input className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:ring-1 focus:ring-white focus:border-white h-14 px-6 text-sm" placeholder="Enter your email address" type="email" />
            <button className="bg-deep-navy text-white px-10 h-14 text-[14px] leading-[20px] tracking-widest font-semibold uppercase hover:bg-charcoal transition-all">Subscribe</button>
          </form>
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

      <CookieBanner />
    </div>
  )
}
