"use client";

import { useEffect, useState } from "react";
import { getShops } from "@/services/api";
import { useRouter } from "next/navigation";

type Shop = {
  id: number;
  name: string;
  address: string;
  contact: string;
  claimed: boolean;
  category: string;
  location: string;
  lastUpdated?: string;
  rating?: number;
};

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedClaimed, setSelectedClaimed] = useState("all");

  const router = useRouter();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await getShops();
        const enriched = data.map((shop: Shop) => ({
          ...shop,
          lastUpdated: shop.lastUpdated || new Date().toISOString(),
           rating: shop.rating || 0,
        }));
        setShops(enriched);
      } catch (err) {
        setError("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const categories = ["all", ...new Set(shops.map((s) => s.category))];
  const locations = ["all", ...new Set(shops.map((s) => s.location))];

  const filteredShops = shops.filter((shop) => {
    if (selectedCategory !== "all" && shop.category !== selectedCategory)
      return false;
    if (selectedLocation !== "all" && shop.location !== selectedLocation)
      return false;
    if (selectedClaimed !== "all") {
      const isClaimed = selectedClaimed === "claimed";
      if (shop.claimed !== isClaimed) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E3F2FD" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto" style={{ border: "4px solid #E3F2FD", borderTopColor: "#1976D2" }}></div>
          <p className="mt-6 text-lg" style={{ color: "#424242" }}>Loading shops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E3F2FD" }}>
        <p className="text-xl font-semibold" style={{ color: "#D32F2F" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#E3F2FD" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#1976D2" }}>Shops</h1>
          <p className="text-lg" style={{ color: "#616161" }}>Your guide to every shop around</p>
        </div>

        {/* Filter Bar */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "#424242" }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: "#BDBDBD", backgroundColor: "white", color: "#212121" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === "all" ? "Select Category" : cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "#424242" }}>Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: "#BDBDBD", backgroundColor: "white", color: "#212121" }}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc === "all" ? "Select Location" : loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "#424242" }}>Claimed Status</label>
              <select
                value={selectedClaimed}
                onChange={(e) => setSelectedClaimed(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none"
                style={{ borderColor: "#BDBDBD", backgroundColor: "white", color: "#212121" }}
              >
                <option value="all">All Statuses</option>
                <option value="claimed">Claimed</option>
                <option value="unclaimed">Unclaimed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-sm font-medium" style={{ color: "#616161" }}>
            Showing {filteredShops.length} of {shops.length} shops
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "2px solid transparent" }}
            >
              <div className="p-6 min-h-[280px] flex flex-col justify-between">
                <div>
                  <h3 className="text-[21px] font-bold mb-3 truncate" style={{ color: "#212121" }}>{shop.name}</h3>
                  <p className="text-sm mb-2" style={{ color: "#757575" }}>{shop.address}</p>
                  <p className="text-sm mb-5" style={{ color: "#757575" }}>📞 {shop.contact}</p>
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: shop.claimed ? "#E8F5E9" : "#FFEBEE", color: shop.claimed ? "#2E7D32" : "#C62828" }}>
                    {shop.claimed ? "Claimed" : "Unclaimed"}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/shops/${shop.id}`)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{ background: "#E3F2FD", color: "#1976D2", border: "1.5px solid #90CAF9" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#1976D2";
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#E3F2FD";
                    (e.currentTarget as HTMLButtonElement).style.color = "#1976D2";
                  }}
                >
                  View Products
                </button>
              </div>

              <div className="px-6 py-4" style={{ backgroundColor: "#F5F5F5", borderTop: "1px solid #E0E0E0" }}>
                <div className="flex justify-between items-center text-xs mb-2">
                  <div style={{ color: "#616161" }}>
                    <span className="font-semibold">Category:</span> <span style={{ color: "#424242" }}>{shop.category}</span>
                  </div>
                  <div style={{ color: "#616161" }}>
                    <span className="font-semibold">Location:</span> <span style={{ color: "#424242" }}>{shop.location}</span>
                  </div>
                </div>
                <div className="text-xs" style={{ color: "#9E9E9E" }}>
                  Updated: {new Date(shop.lastUpdated || "").toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}