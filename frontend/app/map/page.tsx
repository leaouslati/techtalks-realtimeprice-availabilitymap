"use client";

import { useEffect, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { getShops } from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";

type Shop = {
  id: number;
  name: string;
  address: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  contact?: string;
  claimed?: boolean;
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CATEGORY_COLORS: Record<string, { bg: string; glyph: string; border: string }> = {
  Electronics: { bg: "#1d4ed8", glyph: "#bfdbfe", border: "#3b82f6" },
  Clothing:    { bg: "#be185d", glyph: "#fce7f3", border: "#ec4899" },
  Pharmacy:    { bg: "#065f46", glyph: "#d1fae5", border: "#10b981" },
  Grocery:     { bg: "#92400e", glyph: "#fef3c7", border: "#f59e0b" },
  Fuel:        { bg: "#3730a3", glyph: "#e0e7ff", border: "#6366f1" },
  default:     { bg: "#1e293b", glyph: "#e2e8f0", border: "#64748b" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: "⚡",
  Clothing: "👗",
  Pharmacy: "💊",
  Grocery: "🛒",
  Fuel: "⛽",
  default: "📍",
};

function MapController({ shop }: { shop: Shop | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && shop?.latitude && shop?.longitude) {
      map.panTo({ lat: shop.latitude, lng: shop.longitude });
      map.setZoom(15);
    }
  }, [map, shop]);
  return null;
}

export default function MapPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [infoWindowShop, setInfoWindowShop] = useState<Shop | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const searchParams = useSearchParams();

useEffect(() => {
  const shopId = searchParams.get("shop");
  if (shopId && shops.length > 0) {
    const shop = shops.find(s => s.id === Number(shopId));
    if (shop) handleSelectShop(shop);
  }
}, [shops, searchParams]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getShops();
        setShops(data as Shop[]);
      } catch {
        setError("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserLocation({ lat: 33.89, lon: 35.5 })
      );
    } else {
      setUserLocation({ lat: 33.89, lon: 35.5 });
    }
  }, []);

  const shopsWithDistance = shops
    .map((shop) => ({
      ...shop,
      distance:
        userLocation && shop.latitude && shop.longitude
          ? getDistance(userLocation.lat, userLocation.lon, shop.latitude, shop.longitude)
          : null,
    }))
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  const selectedShop = shops.find((s) => s.id === selectedId) ?? null;

  const handleSelectShop = useCallback((shop: Shop) => {
    setSelectedId(shop.id);
    setInfoWindowShop(shop);
    const el = document.getElementById(`shop-card-${shop.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div
            className="w-12 h-12 mx-auto rounded-full border-4 border-blue-100 mb-4"
            style={{ borderTopColor: "#2563eb", animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-slate-400 text-sm">Loading map…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        .shop-card {
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .shop-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 4px 16px rgba(37,99,235,0.1);
          transform: translateY(-1px);
        }
        .shop-card.selected {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12), 0 4px 16px rgba(37,99,235,0.15);
        }
        .view-btn {
          background: #eff6ff;
          color: #2563eb;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }
        .view-btn:hover { background: #2563eb; color: white; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
      `}</style>

      <div className="flex flex-col" style={{ height: "100vh", background: "#f1f5f9" }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            zIndex: 10,
          }}
        >
        <span className="text-sm font-semibold text-slate-600">🇱🇧 Lebanon</span>
        
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
            />
            {shops.length} shops active
          </div>
        </div>

        {/* Split view */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Google Map */}
          <div className="flex-1 relative">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat: 33.89, lng: 35.5 }}
                defaultZoom={9}
                mapId="shopmap-lebanon"
                gestureHandling="greedy"
                style={{ width: "100%", height: "100%" }}
              >
                <MapController shop={selectedShop} />

                {/* User dot */}
                {userLocation && (
                  <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lon }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#2563eb",
                        border: "3px solid white",
                        boxShadow: "0 0 0 4px rgba(37,99,235,0.25), 0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    />
                  </AdvancedMarker>
                )}

                {/* Shop markers */}
                {shopsWithDistance
                  .filter((s) => s.latitude && s.longitude)
                  .map((shop) => {
                    const colors = CATEGORY_COLORS[shop.category] ?? CATEGORY_COLORS.default;
                    const isSelected = selectedId === shop.id;
                    return (
                      <AdvancedMarker
                        key={shop.id}
                        position={{ lat: shop.latitude!, lng: shop.longitude! }}
                        onClick={() => handleSelectShop(shop)}
                        zIndex={isSelected ? 100 : 1}
                      >
                        <div
                          style={{
                            transform: isSelected ? "scale(1.25)" : "scale(1)",
                            transition: "transform 0.2s ease",
                            filter: isSelected
                              ? `drop-shadow(0 4px 12px ${colors.border}88)`
                              : "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                          }}
                        >
                          <Pin
                            background={isSelected ? colors.border : colors.bg}
                            glyphColor={colors.glyph}
                            borderColor={colors.border}
                            scale={isSelected ? 1.15 : 1}
                          >
                            <span style={{ fontSize: 13 }}>
                              {CATEGORY_ICONS[shop.category] ?? CATEGORY_ICONS.default}
                            </span>
                          </Pin>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                {/* Info window on selected marker */}
                {infoWindowShop?.latitude && infoWindowShop?.longitude && (
                  <InfoWindow
                    position={{ lat: infoWindowShop.latitude, lng: infoWindowShop.longitude }}
                    onCloseClick={() => { setInfoWindowShop(null); setSelectedId(null); }}
                    pixelOffset={[0, -48]}
                  >
                    <div style={{ minWidth: 180, padding: "4px 2px", fontFamily: "Inter, sans-serif" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 4 }}>
                        {infoWindowShop.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                        {infoWindowShop.address}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 99,
                            background: `${(CATEGORY_COLORS[infoWindowShop.category] ?? CATEGORY_COLORS.default).border}22`,
                            color: (CATEGORY_COLORS[infoWindowShop.category] ?? CATEGORY_COLORS.default).border,
                          }}
                        >
                          {infoWindowShop.category}
                        </span>
                        {infoWindowShop.claimed && (
                          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>✓ Claimed</span>
                        )}
                      </div>
                      <button
                        className="view-btn"
                        onClick={() => router.push(`/products?shop=${infoWindowShop.id}`)}
                      >
                        View Products →
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", background: "#e2e8f0", flexShrink: 0 }} />

          {/* Right — Shop list */}
          <div
            className="overflow-y-auto flex-shrink-0"
            style={{ width: "340px", background: "#f8fafc" }}
          >
            <div
              className="sticky top-0 z-10 px-5 py-4"
              style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
            >
              <div className="font-semibold text-slate-700 text-sm">Nearby Shops</div>
              {userLocation && (
                <div className="text-xs text-blue-500 mt-0.5">
                  📍 Sorted by distance from your location
                </div>
              )}
            </div>

            <div className="p-3 space-y-2">
              {shopsWithDistance.map((shop) => {
                const isSelected = selectedId === shop.id;
                const colors = CATEGORY_COLORS[shop.category] ?? CATEGORY_COLORS.default;

                return (
                  <div
                    id={`shop-card-${shop.id}`}
                    key={shop.id}
                    className={`shop-card p-4 ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectShop(shop)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span style={{ fontSize: 18 }}>
                          {CATEGORY_ICONS[shop.category] ?? CATEGORY_ICONS.default}
                        </span>
                        <span className="font-semibold text-slate-800 truncate" style={{ fontSize: 14 }}>
                          {shop.name}
                        </span>
                      </div>
                      {shop.distance !== null && (
                        <span
                          className="flex-shrink-0 text-xs font-semibold rounded-full px-2 py-0.5"
                          style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11 }}
                        >
                          {shop.distance < 1
                            ? `${(shop.distance * 1000).toFixed(0)} m`
                            : `${shop.distance.toFixed(1)} km`}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-2 truncate">{shop.address}</p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${colors.border}18`, color: colors.border }}
                      >
                        {shop.category}
                      </span>
                      <span className="text-xs text-slate-400">{shop.location}</span>
                      {shop.claimed && (
                        <span className="text-xs text-emerald-500 font-medium">✓ Claimed</span>
                      )}
                    </div>

                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products?shop=${shop.id}`);
                      }}
                    >
                      View Products →
                    </button>
                  </div>
                );
              })}

              {shops.length === 0 && (
                <div className="text-center py-16 text-slate-400 text-sm">No shops found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}