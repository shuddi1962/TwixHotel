import type { Metadata } from "next"
import { Plus_Jakarta_Sans, EB_Garamond } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] })
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "TwixHotel - Glocal Luxury in Every Detail",
  description: "Where heritage meets unrivaled elegance, creating an exquisite haven for your ultimate relaxation in the heart of the city.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
      </head>
      <body className={`${jakarta.className} ${garamond.variable}`}>{children}</body>
    </html>
  )
}
