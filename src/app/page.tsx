import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Hotel, ShieldCheck, BarChart3, Globe, Sparkles, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">TwiXHotel</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-dark hover:text-primary">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          Hotel Management SAAS Platform
        </div>
        <h1 className="text-5xl font-bold text-dark mb-6 max-w-3xl mx-auto leading-tight">
          Simplify Your Hotel Business with{" "}
          <span className="text-primary">Innovative Software</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          Experience the future of hotel management. Optimize processes,
          enhance guest satisfaction, and unlock success.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Get Started <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">Sign In</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-dark mb-4">Everything You Need</h2>
          <p className="text-muted max-w-xl mx-auto">
            From bookings to guest services, we provide all the tools to manage your hotel.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Hotel, title: "Room Management", desc: "Easily manage rooms, pricing, availability, and assignments." },
            { icon: BarChart3, title: "Booking Control", desc: "Full control over reservations with real-time availability." },
            { icon: ShieldCheck, title: "Staff Management", desc: "Role-based access for reception, housekeeping, and management." },
            { icon: Globe, title: "Multi-tenant SAAS", desc: "Each hotel gets their own admin dashboard and subdomain." },
            { icon: Sparkles, title: "Payment Integration", desc: "Accept payments via Stripe, PayPal, and more." },
            { icon: BarChart3, title: "Reports & Analytics", desc: "Data-driven insights to optimize your hotel operations." },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="p-3 rounded-lg bg-primary/5 text-primary w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-dark mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} TwiXHotel. All rights reserved.</p>
      </footer>
    </div>
  )
}
