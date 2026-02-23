import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopMap Lebanon",
  description: "Find shops and products near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< Updated upstream
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav style={{
  background: "white",
  borderBottom: "1px solid #e2e8f0",
  padding: "0 24px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
}}>
  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
    <div style={{
      width: "32px", height: "32px", borderRadius: "8px",
      background: "#2563eb", color: "white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: "bold", fontSize: "16px"
    }}>S</div>
    <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>ShopMap</span>
  </Link>

  <div style={{ display: "flex", gap: "8px" }}>
    {[
      { href: "/", label: "🏠 Home" },
      { href: "/map", label: "🗺️ Map" },
      { href: "/shops", label: "🏪 Shops" },
      { href: "/products", label: "📦 Products" },
    ].map(({ href, label }) => (
      <Link key={href} href={href} style={{
        padding: "6px 14px",
        borderRadius: "8px",
        textDecoration: "none",
        color: "#475569",
        fontSize: "14px",
        fontWeight: 500,
      }}>
        {label}
      </Link>
    ))}
  </div>
</nav>
=======
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "#2563eb", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "bold", fontSize: "16px"
            }}>S</div>
            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>ShopMap</span>
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/map", label: "🗺️ Map" },
              { href: "/shops", label: "🏪 Shops" },
              { href: "/products", label: "📦 Products" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#475569",
                fontSize: "14px",
                fontWeight: 500,
              }}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
>>>>>>> Stashed changes
        {children}
      </body>
    </html>
  );
}