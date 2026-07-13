import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

interface Props {
  hotelName: string
  description?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  email?: string | null
  phone?: string | null
}

export function SiteFooter({ hotelName, description }: Props) {
  return (
    <footer style={{ backgroundColor: "var(--vg-surface)", borderTop: "1px solid var(--vg-line)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid md:grid-cols-3 gap-12 pb-12" style={{ borderBottom: "1px solid var(--vg-line)" }}>
          <div className="md:col-span-2">
            <h3 className="font-display text-xl mb-4" style={{ color: "var(--vg-ivory)" }}>
              {hotelName}
            </h3>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--vg-sage)" }}>
              {description || "Premium stays, crafted experiences. Every detail considered."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "var(--vg-sage)" }}>Navigate</h4>
              <ul className="space-y-3 text-sm">
                {[
                  ["Rooms", "#rooms"],
                  ["Dining", "#dining"],
                  ["Facilities", "#facilities"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} style={{ color: "var(--vg-sage)" }} className="hover:text-ivory transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "var(--vg-sage)" }}>Connect</h4>
              <div className="flex items-center gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full border flex items-center justify-center transition-all"
                    style={{ borderColor: "var(--vg-line)", color: "var(--vg-sage)" }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--vg-sage)" }}>
          <p>&copy; {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-ivory transition-colors">Staff Login</Link>
            <a href="#" className="hover:text-ivory transition-colors">Privacy</a>
            <a href="#" className="hover:text-ivory transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
