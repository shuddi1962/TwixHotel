"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"

const LINKS = [
  { href: "#rooms", label: "Rooms & Suites" },
  { href: "#dining", label: "Bar & Dining" },
  { href: "#pool", label: "Pool & Wellness" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
]

export function SiteHeader({ hotelName, phone }: { hotelName: string; phone?: string | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md border-b" : "border-b border-transparent"
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(11,31,26,0.85)" : "transparent",
        borderColor: "var(--hg-line)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide" style={{ color: "var(--hg-ivory)" }}>
          {hotelName}
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide transition-colors"
              style={{ color: "var(--hg-sage)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--hg-sage)" }}
            >
              <Phone className="w-4 h-4" />
              {phone}
            </a>
          )}
          <a href="#rooms" className="hg-btn-gold">
            Book Now
          </a>
        </div>

        <button
          className="lg:hidden p-2"
          style={{ color: "var(--hg-ivory)" }}
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
            style={{ borderColor: "var(--hg-line)", backgroundColor: "var(--hg-bg-alt)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base"
                  style={{ color: "var(--hg-ivory)" }}
                >
                  {l.label}
                </a>
              ))}
              <a href="#rooms" onClick={() => setOpen(false)} className="hg-btn-gold w-full">
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
