import Link from "next/link"

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
  return (
    <footer className="bg-deep-navy text-soft-cream border-t-4 border-warm-bronze">
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-[80px] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-6">
          <h3 className="font-heading text-[32px] leading-[40px] font-medium text-primary">{hotelName}</h3>
          <p className="text-soft-cream/60 text-sm leading-relaxed">{description || "Glocal Luxury in Every Detail. Merging international excellence with the warmth of Nigerian heritage for an unmatched hospitality experience."}</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[16px]">facebook</span></a>
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[16px]">alternate_email</span></a>
            <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-warm-bronze hover:border-warm-bronze transition-all" href="#"><span className="material-symbols-outlined text-[16px]">photo_camera</span></a>
          </div>
        </div>
        <div>
          <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Contact Info</h5>
          <ul className="space-y-4 text-soft-cream/60 text-sm">
            {address && (
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-warm-bronze text-[18px]">location_on</span>
                {address}{city ? `, ${city}` : ""}{country ? `, ${country}` : ""}
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-warm-bronze text-[18px]">phone</span>
                {phone}
              </li>
            )}
            {email && (
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-warm-bronze text-[18px]">mail</span>
                {email}
              </li>
            )}
            {!address && !phone && !email && (
              <>
                <li className="flex items-start gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">location_on</span> 15205 North Kierland Blvd, Lagos</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">phone</span> +234 (0) 123 456 789</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-warm-bronze text-[18px]">mail</span> concierge@twixhotel.com</li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Quick Links</h5>
          <ul className="space-y-4 text-soft-cream/60 text-sm">
            <li><Link className="hover:text-warm-bronze transition-colors" href="/rooms">Rooms &amp; Suites</Link></li>
            <li><a className="hover:text-warm-bronze transition-colors" href="#dining">Dining Experiences</a></li>
            <li><a className="hover:text-warm-bronze transition-colors" href="#facilities">Spa &amp; Wellness</a></li>
            <li><a className="hover:text-warm-bronze transition-colors" href="#">Our Heritage</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[20px] leading-[28px] font-semibold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-px after:bg-warm-bronze">Legal</h5>
          <ul className="space-y-4 text-soft-cream/60 text-sm">
            <li><a className="hover:text-warm-bronze transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-warm-bronze transition-colors" href="#">Terms &amp; Conditions</a></li>
            <li><a className="hover:text-warm-bronze transition-colors" href="#">Cancellation Policy</a></li>
            <li><Link className="hover:text-warm-bronze transition-colors" href="/login">Staff Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-soft-cream/40 text-[10px] uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
        <div className="flex gap-8">
          <span>Crafted with Heritage</span>
          <span>{city || "Lagos"}, {country || "Nigeria"}</span>
        </div>
      </div>
    </footer>
  )
}
