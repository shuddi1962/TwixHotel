"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "#rooms", label: "Rooms" },
  { href: "#dining", label: "Dining" },
  { href: "#facilities", label: "Facilities" },
]

export function SiteHeader({ hotelName }: { hotelName: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      id="top-nav"
      className="fixed top-0 w-full z-50 transition-all duration-300 glass-nav h-20 flex items-center"
      style={{
        borderBottom: scrolled ? "1px solid rgba(33,37,41,0.05)" : "1px solid transparent",
        backgroundColor: scrolled ? "rgba(253,251,247,0.95)" : "transparent",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto">
        <Link href="/" className="font-heading text-[32px] leading-[40px] font-semibold text-primary">
          {hotelName}
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <a href="/" className="text-primary font-bold border-b-2 border-primary pb-1 text-[14px] leading-[20px] tracking-widest font-semibold">Home</a>
          {NAV_LINKS.slice(1).map((l) => (
            <a key={l.href} href={l.href} className="text-on-surface-variant hover:text-primary transition-colors text-[14px] leading-[20px] tracking-widest font-semibold">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button className="hidden md:flex items-center gap-2 text-on-surface-variant text-[14px] leading-[20px] tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[20px]">language</span>
            English
          </button>
          <a href="#rooms" className="bg-warm-bronze text-white px-8 py-3 text-[14px] leading-[20px] tracking-widest font-semibold hover:opacity-90 transition-opacity active:scale-95 duration-200">
            Book Now
          </a>
        </div>
      </div>
    </nav>
  )
}
