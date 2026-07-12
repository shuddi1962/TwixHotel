import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hg-display",
})

export const metadata: Metadata = {
  title: "Grand Luxury Hotel",
  description: "A refined stay — rooms, bar, pool, and everything in between.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${displayFont.variable}`}>{children}</body>
    </html>
  )
}
