import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kalender Hitung Upah Lembur",
  description: "Aplikasi untuk menghitung upah lembur sesuai undang-undang Indonesia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        {/* Script Umami */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="63a95e6e-fee4-477c-a397-bca481320684"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
