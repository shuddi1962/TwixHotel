"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, ArrowRight } from "lucide-react"
import { useState, type FormEvent } from "react"

interface Props {
  hotelName: string
  description?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  email?: string | null
  phone?: string | null
}

export function SiteFooter({ hotelName, description, address, city, country, email, phone }: Props) {
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="border-t" style={{ borderColor: "var(--vg-border)", backgroundColor: "var(--vg-dark)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <h3 className="font-heading text-2xl mb-4" style={{ color: "white" }}>
              {hotelName}
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              {description || "A refined stay, considered in every detail — from the room to the rooftop bar."}
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.45)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["Rooms & Suites", "#rooms"],
                ["Gallery", "#gallery"],
                ["Facilities", "#facilities"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} style={{ color: "rgba(255,255,255,0.55)" }} className="hover:opacity-80">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Contact Info</h4>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              {address && (
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--vg-gold)" }} />
                  <span>{address}{city ? `, ${city}` : ""}{country ? `, ${country}` : ""}</span>
                </li>
              )}
              {phone && (
                <li className="flex gap-3 items-center">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--vg-gold)" }} />
                  <a href={`tel:${phone}`}>{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex gap-3 items-center">
                  <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--vg-gold)" }} />
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>Newsletter</h4>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
              Subscribe for exclusive offers and updates.
            </p>
            {subscribed ? (
              <p className="text-sm" style={{ color: "var(--vg-gold-light)" }}>You&apos;re subscribed!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-sm bg-transparent border outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: "white" }}
                />
                <button
                  type="submit"
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--vg-purple)", color: "white" }}
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <p>&copy; {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:opacity-80">Staff Login</Link>
            <a href="#" className="hover:opacity-80">Privacy Policy</a>
            <a href="#" className="hover:opacity-80">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
