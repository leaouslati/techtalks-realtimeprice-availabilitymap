"use client";

import { useEffect, useState } from "react";
import {
  getProductsByShop,
  getShops,
  updateProductAvailability,
  updateProductPrice,
} from "@/services/api";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  location: string;
  shopName?: string;
  available?: boolean;
  shopId?: number;
  updatedAt?: string;
  lastUpdated?: string;
  prices?: {
    price?: number | string;
    available?: boolean;
    updatedAt?: string;
  }[];
};

type Shop = {
  id: number;
  name: string;
  location: string;
};

type PriceChange = {
  [key: number]: boolean;
};

type AvailabilityChange = {
  [key: number]: boolean;
};

const normalizePrice = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const extractPrice = (product: Product): number => {
  if (Number.isFinite(Number(product.price))) {
    return normalizePrice(product.price);
  }
  return normalizePrice(product.prices?.[0]?.price);
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [updatingPrice, setUpdatingPrice] = useState<Record<number, boolean>>({});
  const [updatingAvailability, setUpdatingAvailability] = useState<Record<number, boolean>>({});
  const [actionMessage, setActionMessage] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const [priceFlash, setPriceFlash] = useState<PriceChange>({});
  const [availabilityFlash, setAvailabilityFlash] =
    useState<AvailabilityChange>({});

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);

    if (!savedToken) {
      setIsShopOwner(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));
      setIsShopOwner(payload?.role === "SHOP_OWNER");
    } catch {
      setIsShopOwner(false);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shops: Shop[] = await getShops();
        const productsByShop = await Promise.all(
          shops.map(async (shop) => {
            const shopProducts = await getProductsByShop(shop.id);
            return shopProducts.map((product: Product) => ({
              ...product,
              price: extractPrice(product),
              shopId: shop.id,
              shopName: shop.name,
              location: shop.location,
              available:
                product.available !== undefined
                  ? product.available
                  : (product.prices?.[0]?.available ?? true),
              lastUpdated:
                product.updatedAt ||
                product.prices?.[0]?.updatedAt ||
                product.lastUpdated ||
                new Date().toISOString(),
            }));
          })
        );
        const enrichedData = productsByShop.flat();
        setProducts(enrichedData);
        setPriceInputs(
          Object.fromEntries(
            enrichedData.map((product) => [
              product.id,
              String(product.price ?? ""),
            ])
          )
        );
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const shops: Shop[] = await getShops();
        const productsByShop = await Promise.all(
          shops.map(async (shop) => {
            const shopProducts = await getProductsByShop(shop.id);
            return shopProducts.map((product: Product) => ({
              ...product,
              price: extractPrice(product),
              shopId: shop.id,
              shopName: shop.name,
              location: shop.location,
              available:
                product.available !== undefined
                  ? product.available
                  : (product.prices?.[0]?.available ?? true),
              lastUpdated:
                product.updatedAt ||
                product.prices?.[0]?.updatedAt ||
                product.lastUpdated ||
                new Date().toISOString(),
            }));
          })
        );
        const enrichedData = productsByShop.flat();

        enrichedData.forEach((newProduct: Product) => {
          const oldProduct = products.find((p) => p.id === newProduct.id);

          if (oldProduct) {
            if (oldProduct.price !== newProduct.price) {
              setPriceFlash((prev) => ({ ...prev, [newProduct.id]: true }));
              setTimeout(() => {
                setPriceFlash((prev) => ({ ...prev, [newProduct.id]: false }));
              }, 1000);
            }

            if (oldProduct.available !== newProduct.available) {
              setAvailabilityFlash((prev) => ({
                ...prev,
                [newProduct.id]: true,
              }));
              setTimeout(() => {
                setAvailabilityFlash((prev) => ({
                  ...prev,
                  [newProduct.id]: false,
                }));
              }, 500);
            }
          }
        });

        setProducts(enrichedData);
      } catch (err) {
        console.error("Failed to update products", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  const handlePriceUpdate = async (product: Product) => {
    if (!token || !product.shopId) {
      setActionMessage("You must be logged in as shop owner to update prices.");
      return;
    }

    const nextPrice = Number(priceInputs[product.id]);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      setActionMessage("Please enter a valid price greater than 0.");
      return;
    }

    try {
      setUpdatingPrice((prev) => ({ ...prev, [product.id]: true }));
      setActionMessage("");

      await updateProductPrice(product.shopId, product.id, nextPrice, token);

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, price: nextPrice, lastUpdated: new Date().toISOString() }
            : item
        )
      );

      setPriceFlash((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setPriceFlash((prev) => ({ ...prev, [product.id]: false }));
      }, 1000);

      setActionMessage("Price updated successfully.");
    } catch {
      setActionMessage("Failed to update price.");
    } finally {
      setUpdatingPrice((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAvailabilityUpdate = async (product: Product) => {
    if (!token || !product.shopId) {
      setActionMessage("You must be logged in as shop owner to update availability.");
      return;
    }

    const nextAvailability = !product.available;

    try {
      setUpdatingAvailability((prev) => ({ ...prev, [product.id]: true }));
      setActionMessage("");

      await updateProductAvailability(
        product.shopId,
        product.id,
        nextAvailability,
        token
      );

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                available: nextAvailability,
                lastUpdated: new Date().toISOString(),
              }
            : item
        )
      );

      setAvailabilityFlash((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAvailabilityFlash((prev) => ({ ...prev, [product.id]: false }));
      }, 500);

      setActionMessage("Availability updated successfully.");
    } catch {
      setActionMessage("Failed to update availability.");
    } finally {
      setUpdatingAvailability((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
const locations = ["all", ...Array.from(new Set(products.map((p) => p.location).filter(Boolean)))];

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== "all" && product.category !== selectedCategory)
        return false;
      if (selectedLocation !== "all" && product.location !== selectedLocation)
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "updated") {
        return (
          new Date(b.lastUpdated || 0).getTime() -
          new Date(a.lastUpdated || 0).getTime()
        );
      }
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E3F2FD" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 mx-auto"
            style={{
              border: "4px solid #E3F2FD",
              borderTopColor: "#1976D2",
            }}
          ></div>
          <p className="mt-6 text-lg" style={{ color: "#424242" }}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E3F2FD" }}
      >
        <div className="text-center">
          <p
            className="text-xl font-semibold mb-6"
            style={{ color: "#D32F2F" }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: "#1976D2",
              color: "white",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "#E3F2FD" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#1976D2" }}>
            Products
          </h1>
          <p className="text-lg" style={{ color: "#616161" }}>
            Live prices. Instant availability
          </p>
          {isShopOwner && (
            <p className="text-sm mt-2" style={{ color: "#1976D2" }}>
              Shop owner mode: you can update prices and availability.
            </p>
          )}
          {actionMessage && (
            <p className="text-sm mt-2" style={{ color: "#424242" }}>
              {actionMessage}
            </p>
          )}
        </div>

        {/* Filter Bar */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "#424242" }}
              >
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "#BDBDBD",
                  color: "#212121",
                  backgroundColor: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1976D2")}
                onBlur={(e) => (e.target.style.borderColor = "#BDBDBD")}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "#424242" }}
              >
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "#BDBDBD",
                  color: "#212121",
                  backgroundColor: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1976D2")}
                onBlur={(e) => (e.target.style.borderColor = "#BDBDBD")}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: "#424242" }}
              >
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "#BDBDBD",
                  color: "#212121",
                  backgroundColor: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1976D2")}
                onBlur={(e) => (e.target.style.borderColor = "#BDBDBD")}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low → High)</option>
                <option value="price-high">Price (High → Low)</option>
                <option value="updated">Last Updated (Newest)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div
            className="mt-6 text-sm font-medium"
            style={{ color: "#616161" }}
          >
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 border-2 border-transparent"
            style={{
              backgroundColor: "white",
              boxShadow: priceFlash[product.id]
                ? "0 4px 20px rgba(25, 118, 210, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.08)",
              transform: priceFlash[product.id]
                ? "translateY(-2px)"
                : "translateY(0)",
              border: priceFlash[product.id]
                ? "2px solid #1976D2"
                : "2px solid transparent",
            }}
          >
            {/* Recently Updated Indicator */}
            {priceFlash[product.id] && (
              <div
                className="h-1 w-full"
                style={{ backgroundColor: "#FFA726" }}
              ></div>
            )}
            {/* Product Content */}
            <div className="p-6">
              <h3
                className="text-xl font-bold mb-2 truncate"
                style={{ color: "#212121" }}
              >
                {product.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: "#757575" }}>
                {product.shopName}
              </p>
              {/* Price with Animation */}
              <div
                className="mb-4 py-2 rounded-lg transition-all duration-500"
                style={{
                  backgroundColor: priceFlash[product.id]
                    ? "#FFF3E0"
                    : "transparent",
                  transform: priceFlash[product.id]
                    ? "scale(1.05)"
                    : "scale(1)",
                }}
              >
                <p
                  className="text-3xl font-bold"
                  style={{ color: "#1976D2" }}
                >
                  ${normalizePrice(product.price).toFixed(2)}
                </p>
              </div>
              {/* Availability Badge */}
              <div
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                  backgroundColor: product.available ? "#E8F5E9" : "#FFEBEE",
                  color: product.available ? "#2E7D32" : "#C62828",
                  transform: availabilityFlash[product.id]
                    ? "scale(1.1)"
                    : "scale(1)",
                  boxShadow: availabilityFlash[product.id]
                    ? "0 0 0 4px rgba(25, 118, 210, 0.2)"
                    : "none",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full mr-2"
                  style={{
                    backgroundColor: product.available
                      ? "#2E7D32"
                      : "#C62828",
                  }}
                ></span>
                {product.available ? "Available" : "Unavailable"}
              </div>
              <button
                onClick={() => router.push(`/map?shop=${product.shopId}`)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: "#E3F2FD",
                  color: "#1976D2",
                  border: "1.5px solid #90CAF9",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#1976D2";
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#E3F2FD";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1976D2";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                View on Map
              </button>

              {isShopOwner && product.shopId && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceInputs[product.id] ?? ""}
                      onChange={(e) =>
                        setPriceInputs((prev) => ({
                          ...prev,
                          [product.id]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                      style={{ borderColor: "#BDBDBD", color: "#212121" }}
                    />
                    <button
                      onClick={() => handlePriceUpdate(product)}
                      disabled={!!updatingPrice[product.id]}
                      className="px-3 py-2 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: "#1976D2", color: "white" }}
                    >
                      {updatingPrice[product.id] ? "Saving..." : "Save"}
                    </button>
                  </div>
                  <button
                    onClick={() => handleAvailabilityUpdate(product)}
                    disabled={!!updatingAvailability[product.id]}
                    className="w-full px-3 py-2 rounded-lg text-sm font-semibold"
                    style={{
                      backgroundColor: "#E3F2FD",
                      color: "#1976D2",
                      border: "1.5px solid #90CAF9",
                    }}
                  >
                    {updatingAvailability[product.id]
                      ? "Saving..."
                      : product.available
                      ? "Mark Unavailable"
                      : "Mark Available"}
                  </button>
                </div>
              )}
            </div>

            {/* Product Footer */}
            <div
              className="px-6 py-4"
              style={{
                backgroundColor: "#F5F5F5",
                borderTop: "1px solid #E0E0E0",
              }}
            >
              <div className="flex justify-between items-center text-xs mb-2">
                <div style={{ color: "#616161" }}>
                  <span className="font-semibold">Category:</span>{" "}
                  <span style={{ color: "#424242" }}>{product.category}</span>
                </div>
                <div style={{ color: "#616161" }}>
                  <span className="font-semibold">Location:</span>{" "}
                  <span style={{ color: "#424242" }}>{product.location}</span>
                </div>
              </div>
              <div className="text-xs" style={{ color: "#9E9E9E" }}>
                Updated:{" "}
                {new Date(product.lastUpdated || "").toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#212121" }}>
            No products found
          </h3>
          <p style={{ color: "#757575" }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
      </div>
    </div>
  );
}
