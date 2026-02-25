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
  title: "GeoCart Lebanon",
  description: "Real-time prices & availability near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">


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
            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>GeoCart</span>
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { href: "/", label: "🏠 Home" },
              { href: "/map", label: "🗺️ Map" },
              { href: "/shops", label: "🏪 Shops" },
              { href: "/products", label: "📦 Products" },
              { href: "/profile", label: "👤 Profile" },
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

        {children}
       {/* Footer */}
<footer style={{
  background: "#1e293b",
  padding: "32px 24px",
  textAlign: "center",
}}>
  <div style={{ 
    fontSize: "20px", 
    fontWeight: 700, 
    color: "white", 
    marginBottom: "8px" 
  }}>
    🇱🇧 GeoCart Lebanon
  </div>
  <p style={{ 
    fontSize: "13px", 
    color: "#94a3b8", 
    margin: "0 0 16px" 
  }}>
    Real-time prices &amp; availability across Lebanon
  </p>
  <div style={{ 
    width: "40px", 
    height: "2px", 
    background: "#2563eb", 
    margin: "0 auto 16px" 
  }} />
  <p style={{ 
    fontSize: "12px", 
    color: "#64748b", 
    margin: 0 
  }}>
    © 2026 GeoCart. All rights reserved.
  </p>
</footer>
      </body>
    </html>
  );
}