"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getShops, getProducts } from "@/services/api";

type Shop = {
  id: number;
  name: string;
  address: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  claimed?: boolean;
  rating?: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  available?: boolean;
  shopId?: number;
  shopName?: string;
  lastUpdated?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: "⚡",
  Clothing: "👗",
  Pharmacy: "💊",
  Grocery: "🛒",
  Fuel: "⛽",
  default: "📍",
};

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#1d4ed8",
  Clothing: "#be185d",
  Pharmacy: "#065f46",
  Grocery: "#92400e",
  Fuel: "#3730a3",
  default: "#1976D2",
};

export default function HomePage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [userCity, setUserCity] = useState("Lebanon");
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([getShops(), getProducts()])
      .then(([s, p]) => {
        setShops(s);
        setProducts(
          p.map((prod: Product) => ({
            ...prod,
            lastUpdated: prod.lastUpdated || new Date().toISOString(),
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLoaded(true));

    // Try to get city from browser geolocation (reverse geocode via nominatim)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Lebanon";
          setUserCity(city);
          setLocationInput(city);
        } catch {}
      });
    }
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (locationInput) params.set("location", locationInput);
    router.push(`/products?${params.toString()}`);
  };

  const featuredShops = shops.slice(0, 4);
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated || 0).getTime() -
        new Date(a.lastUpdated || 0).getTime(),
    )
    .slice(0, 6);

  const stats = [
    { label: "Active Shops", value: shops.length || "—", icon: "🏪" },
    { label: "Products Listed", value: products.length || "—", icon: "📦" },
    {
      label: "Cities Covered",
      value: [...new Set(shops.map((s) => s.location))].length || "—",
      icon: "🏙️",
    },
    { label: "Live Updates", value: "24/7", icon: "⚡" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        /* Hero */
        .hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #0d47a1 0%, #1565C0 40%, #1976D2 70%, #42A5F5 100%);
        }
        .hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
        }
        .hero-grid {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-content {
          position: relative; z-index: 2;
          max-width: 900px; margin: 0 auto;
          padding: 64px 24px;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 99px;
          padding: 6px 16px;
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9);
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
        }
        .hero-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          color: white;
          line-height: 1.1;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .hero-title span {
          background: linear-gradient(135deg, #FFF176, #FFD54F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 1.1rem; color: rgba(255,255,255,0.8);
          margin: 0 0 40px; line-height: 1.6;
        }

        /* Search Bar */
        .search-bar {
          display: flex;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          overflow: hidden;
          max-width: 700px;
          margin: 0 auto;
        }
        .search-input-wrap {
          flex: 1; display: flex; align-items: center;
          padding: 0 20px; gap: 10px;
          border-right: 1px solid #E3F2FD;
        }
        .search-input {
          flex: 1; border: none; outline: none;
          font-size: 15px; color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          padding: 18px 0;
          background: transparent;
        }
        .search-input::placeholder { color: #94a3b8; }
        .location-wrap {
          display: flex; align-items: center;
          padding: 0 16px; gap: 8px;
          min-width: 160px;
        }
        .location-input {
          border: none; outline: none;
          font-size: 14px; color: #475569;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
          width: 120px;
        }
        .location-input::placeholder { color: #94a3b8; }
        .search-btn {
          background: #1976D2;
          color: white; border: none;
          padding: 0 28px;
          font-size: 15px; font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .search-btn:hover { background: #1565C0; }

        /* Stats */
        .stats-bar {
          display: flex; gap: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
          max-width: 700px; margin: 0 auto;
        }
        .stat-item {
          flex: 1; text-align: center;
          padding: 18px 12px;
          border-right: 1px solid #f1f5f9;
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-family: 'Sora', sans-serif;
          font-size: 1.5rem; font-weight: 700;
          color: #1976D2;
        }
        .stat-label { font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 2px; }

        /* Sections */
        .section { padding: 56px 24px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .section-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.6rem; font-weight: 700;
          color: #1e293b; margin: 0 0 4px;
        }
        .section-sub { font-size: 14px; color: #64748b; margin: 0; }
        .see-all {
          font-size: 13px; font-weight: 600; color: #1976D2;
          text-decoration: none; cursor: pointer;
          white-space: nowrap;
        }
        .see-all:hover { text-decoration: underline; }

        /* Map Preview */
        .map-preview-section {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border: 1.5px solid #e2e8f0;
          display: flex;
          min-height: 320px;
        }
        .map-iframe-wrap {
          flex: 1; position: relative; min-height: 320px;
        }
        .map-iframe-wrap iframe {
          width: 100%; height: 100%; border: none; display: block;
        }
        .map-overlay-panel {
          width: 260px; flex-shrink: 0;
          padding: 24px 20px;
          border-left: 1px solid #f1f5f9;
          background: #f8fafc;
          display: flex; flex-direction: column; gap: 12px;
        }
        .map-panel-title {
          font-family: 'Sora', sans-serif;
          font-size: 15px; font-weight: 700; color: #1e293b;
          margin: 0 0 4px;
        }
        .map-shop-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; background: white;
          border-radius: 10px; border: 1px solid #e2e8f0;
          cursor: pointer; transition: all 0.15s;
        }
        .map-shop-item:hover {
          border-color: #93c5fd;
          box-shadow: 0 2px 8px rgba(37,99,235,0.1);
        }
        .map-shop-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .map-shop-name { font-size: 13px; font-weight: 600; color: #1e293b; }
        .map-shop-loc { font-size: 11px; color: #64748b; }
        .map-open-btn {
          margin-top: auto;
          background: #1976D2; color: white;
          border: none; border-radius: 10px;
          padding: 12px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .map-open-btn:hover { background: #1565C0; }

        /* Shop cards */
        .shops-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .shop-card {
          background: white; border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          padding: 20px; cursor: pointer;
          transition: all 0.2s;
        }
        .shop-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 8px 24px rgba(37,99,235,0.12);
          transform: translateY(-2px);
        }
        .shop-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 12px;
        }
        .shop-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .shop-addr { font-size: 12px; color: #64748b; margin-bottom: 10px; }
        .shop-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .shop-tag {
          font-size: 11px; font-weight: 600; padding: 3px 10px;
          border-radius: 99px;
        }
        .shop-view-btn {
          margin-top: 14px; width: 100%;
          background: #E3F2FD; color: #1976D2;
          border: 1.5px solid #90CAF9;
          border-radius: 8px; padding: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .shop-view-btn:hover { background: #1976D2; color: white; border-color: #1976D2; }

        /* Product cards */
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
        .product-card {
          background: white; border-radius: 14px;
          border: 1.5px solid #e2e8f0; padding: 18px;
          cursor: pointer; transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .product-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 6px 20px rgba(37,99,235,0.1);
          transform: translateY(-2px);
        }
        .product-updated-dot {
          position: absolute; top: 12px; right: 12px;
          width: 8px; height: 8px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .product-cat-icon { font-size: 24px; margin-bottom: 10px; }
        .product-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .product-shop { font-size: 11px; color: #94a3b8; margin-bottom: 8px; }
        .product-price { font-size: 1.3rem; font-weight: 700; color: #1976D2; font-family: 'Sora', sans-serif; }
        .product-avail {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; margin-top: 8px;
          padding: 3px 10px; border-radius: 99px;
        }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-banner::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(37,99,235,0.15) 0%, transparent 60%),
            radial-gradient(circle at 70% 50%, rgba(16,185,129,0.1) 0%, transparent 60%);
        }
        .cta-title {
          font-family: 'Sora', sans-serif;
          font-size: 2rem; font-weight: 800; color: white;
          margin: 0 0 12px; position: relative;
        }
        .cta-sub { font-size: 15px; color: #94a3b8; margin: 0 0 28px; position: relative; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; flex-wrap: wrap; }
        .cta-btn-primary {
          background: #1976D2; color: white; border: none;
          border-radius: 10px; padding: 14px 28px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .cta-btn-primary:hover { background: #1565C0; transform: translateY(-1px); }
        .cta-btn-secondary {
          background: rgba(255,255,255,0.08); color: white;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 10px; padding: 14px 28px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .cta-btn-secondary:hover { background: rgba(255,255,255,0.15); }

        @media (max-width: 640px) {
          .search-bar { flex-direction: column; border-radius: 14px; }
          .search-input-wrap { border-right: none; border-bottom: 1px solid #E3F2FD; }
          .location-wrap { border-bottom: 1px solid #E3F2FD; }
          .search-btn { padding: 16px; }
          .map-preview-section { flex-direction: column; }
          .map-overlay-panel { width: 100%; }
          .stats-bar { flex-wrap: wrap; }
          .stat-item { min-width: 50%; border-right: none; border-bottom: 1px solid #f1f5f9; }
        }
      `}</style>

      <div
        className="home-root"
        style={{ background: "#E3F2FD", minHeight: "100vh" }}
      >
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-content" style={{ width: "100%" }}>
            <div className="hero-badge">
              <span>🟢</span> Live prices across Lebanon
            </div>
            <h1 className="hero-title">
              Find the best prices
              <br />
              <span>near you, instantly</span>
            </h1>
            <p className="hero-sub">
              Real-time product availability & pricing from shops across Lebanon
            </p>

            {/* Search Bar */}
            <div className="search-bar">
              <div className="search-input-wrap">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  className="search-input"
                  placeholder="Search products, e.g. Laptop, Rice..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="location-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <input
                  className="location-input"
                  placeholder={userCity}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button className="search-btn" onClick={handleSearch}>
                Search →
              </button>
            </div>

            {/* Stats */}
            <div style={{ marginTop: 32 }}>
              <div className="stats-bar">
                {stats.map((s) => (
                  <div key={s.label} className="stat-item">
                    <div className="stat-val">{s.value}</div>
                    <div className="stat-label">
                      {s.icon} {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MAP PREVIEW ── */}
        <section className="section" style={{ background: "#E3F2FD" }}>
          <div className="section-inner">
            <div className="section-header">
              <div>
                <h2 className="section-title">🗺️ Shops Near You</h2>
                <p className="section-sub">Explore shops on the live map</p>
              </div>
              <span className="see-all" onClick={() => router.push("/map")}>
                Open Full Map →
              </span>
            </div>

            <div className="map-preview-section">
              <div className="map-iframe-wrap">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=35.3,33.7,35.7,34.1&layer=mapnik"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 320,
                    border: "none",
                  }}
                  title="Lebanon Map Preview"
                />
              </div>
              <div className="map-overlay-panel">
                <p className="map-panel-title">Nearby Shops</p>
                {shops.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>Loading...</p>
                ) : (
                  shops.slice(0, 4).map((shop) => {
                    const color =
                      CATEGORY_COLORS[shop.category] || CATEGORY_COLORS.default;
                    return (
                      <div
                        key={shop.id}
                        className="map-shop-item"
                        onClick={() => router.push(`/map?shop=${shop.id}`)}
                      >
                        <div
                          className="map-shop-icon"
                          style={{ background: `${color}18` }}
                        >
                          {CATEGORY_ICONS[shop.category] ||
                            CATEGORY_ICONS.default}
                        </div>
                        <div>
                          <div className="map-shop-name">{shop.name}</div>
                          <div className="map-shop-loc">{shop.location}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <button
                  className="map-open-btn"
                  onClick={() => router.push("/map")}
                >
                  View Full Map →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED SHOPS ── */}
        <section className="section" style={{ background: "white" }}>
          <div className="section-inner">
            <div className="section-header">
              <div>
                <h2 className="section-title">🏪 Featured Shops</h2>
                <p className="section-sub">Top shops available right now</p>
              </div>
              <span className="see-all" onClick={() => router.push("/shops")}>
                See All Shops →
              </span>
            </div>

            <div className="shops-grid">
              {featuredShops.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="shop-card"
                      style={{ minHeight: 160, background: "#f8fafc" }}
                    />
                  ))
                : featuredShops.map((shop) => {
                    const color =
                      CATEGORY_COLORS[shop.category] || CATEGORY_COLORS.default;
                    return (
                      <div
                        key={shop.id}
                        className="shop-card"
                        onClick={() => router.push(`/shops/${shop.id}`)}
                      >
                        <div
                          className="shop-icon-wrap"
                          style={{ background: `${color}18` }}
                        >
                          {CATEGORY_ICONS[shop.category] ||
                            CATEGORY_ICONS.default}
                        </div>
                        <div className="shop-name">{shop.name}</div>
                        <div className="shop-addr">{shop.address}</div>
                        <div className="shop-tags">
                          <span
                            className="shop-tag"
                            style={{ background: `${color}18`, color }}
                          >
                            {shop.category}
                          </span>
                          <span
                            className="shop-tag"
                            style={{ background: "#f1f5f9", color: "#64748b" }}
                          >
                            {shop.location}
                          </span>
                          {shop.claimed && (
                            <span
                              className="shop-tag"
                              style={{
                                background: "#f0fdf4",
                                color: "#16a34a",
                              }}
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <button className="shop-view-btn">
                          View Products →
                        </button>
                      </div>
                    );
                  })}
            </div>
          </div>
        </section>

        {/* ── TRENDING PRODUCTS ── */}
        <section className="section" style={{ background: "#E3F2FD" }}>
          <div className="section-inner">
            <div className="section-header">
              <div>
                <h2 className="section-title">🔥 Recently Updated</h2>
                <p className="section-sub">
                  Products with the latest price changes
                </p>
              </div>
              <span
                className="see-all"
                onClick={() => router.push("/products")}
              >
                See All Products →
              </span>
            </div>

            <div className="products-grid">
              {recentProducts.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="product-card"
                      style={{ minHeight: 160, background: "#f8fafc" }}
                    />
                  ))
                : recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => router.push("/products")}
                    >
                      <div className="product-updated-dot" />
                      <div className="product-cat-icon">
                        {CATEGORY_ICONS[product.category] ||
                          CATEGORY_ICONS.default}
                      </div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-shop">
                        {product.shopName || "Local Shop"}
                      </div>
                      <div className="product-price">
                        ${product.price?.toFixed(2)}
                      </div>
                      <div
                        className="product-avail"
                        style={{
                          background:
                            product.available !== false ? "#f0fdf4" : "#fef2f2",
                          color:
                            product.available !== false ? "#16a34a" : "#ef4444",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background:
                              product.available !== false
                                ? "#16a34a"
                                : "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        {product.available !== false
                          ? "Available"
                          : "Unavailable"}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section" style={{ background: "white" }}>
          <div className="section-inner">
            <div className="cta-banner">
              <h2 className="cta-title">Own a shop in Lebanon?</h2>
              <p className="cta-sub">
                List your shop for free and reach thousands of customers looking
                for your products today.
              </p>
              <div className="cta-btns">
                <button
                  className="cta-btn-primary"
                  onClick={() => router.push("/auth")}
                >
                  Get Started Free →
                </button>
                <button
                  className="cta-btn-secondary"
                  onClick={() => router.push("/map")}
                >
                  Explore the Map
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
