"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "#rooms", label: "Rooms" },
  { href: "#dining", label: "Dining" },
  { href: "#facilities", label: "Facilities" },
]

export function SiteHeader({ hotelName }: { hotelName: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isTransparent = !scrolled

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: mounted
          ? isTransparent
            ? "transparent"
            : "rgba(10,10,10,0.92)"
          : "transparent",
        borderBottom: mounted && !isTransparent ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide transition-opacity"
          style={{ color: mounted && isTransparent ? "white" : "var(--vg-ivory)", opacity: mounted ? 1 : 0 }}
        >
          {hotelName}
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-wide transition-colors"
              style={{
                color: mounted && isTransparent ? "rgba(255,255,255,0.7)" : "var(--vg-sage)",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href="#rooms" className="btn-gold text-xs px-5 py-2.5">
            Book Now
          </a>
        </div>

        <button
          className="lg:hidden p-2"
          style={{ color: mounted && isTransparent ? "white" : "var(--vg-ivory)", opacity: mounted ? 1 : 0 }}
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
            className="lg:hidden overflow-hidden"
            style={{ backgroundColor: "var(--vg-bg)", borderTop: "1px solid var(--vg-line)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base"
                  style={{ color: "var(--vg-ivory)" }}
                >
                  {l.label}
                </a>
              ))}
              <a href="#rooms" onClick={() => setOpen(false)} className="btn-gold w-full justify-center">
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
