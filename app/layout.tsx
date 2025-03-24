import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Package2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventory Billing System",
  description: "A complete inventory and billing management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">Inventory Billing System</span>
              </Link>
              <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <Link
                  href="/inventory"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Inventory
                </Link>
                <Link
                  href="/customers"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Customers
                </Link>
                <Link
                  href="/invoices"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Invoices
                </Link>
                <Link
                  href="/billing"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Billing
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}



import './globals.css'