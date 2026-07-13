"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Mail, Phone } from "lucide-react"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "#rooms", label: "Rooms & Suites" },
  { href: "#gallery", label: "Gallery" },
  { href: "#facilities", label: "Facilities" },
  { href: "#contact", label: "Contact" },
]

export function SiteHeader({ hotelName, phone, email }: { hotelName: string; phone?: string | null; email?: string | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block border-b" style={{ backgroundColor: "var(--vg-dark)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Mail className="w-3 h-3" /> {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Phone className="w-3 h-3" /> {phone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <span><span style={{ color: "rgba(255,255,255,0.4)" }}>My Account</span><br />Log in</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "white",
          borderBottom: "1px solid var(--vg-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-[4.5rem] flex items-center justify-between">
          <Link href="/" className="font-heading text-2xl lg:text-3xl tracking-wide" style={{ color: "var(--vg-dark)", fontWeight: 700 }}>
            {hotelName}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--vg-body)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="#rooms" className="btn--base" style={{ padding: "0.75rem 1.5rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 500 }}>
              Contact
            </a>
          </div>

          <button
            className="lg:hidden p-2"
            style={{ color: "var(--vg-dark)" }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t"
              style={{ borderColor: "var(--vg-border)", backgroundColor: "white" }}
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium"
                    style={{ color: "var(--vg-body)" }}
                  >
                    {l.label}
                  </a>
                ))}
                <Link href="/login" className="btn--base-two w-full text-center" style={{ padding: "0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
