"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProducts } from "@/services/api";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  shopId: number;
  lastUpdated?: string;
}

export default function ShopProductsPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        const shopProducts = allProducts.filter((p: Product) => p.shopId === Number(id));
        setProducts(shopProducts);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E3F2FD" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 mx-auto" style={{ border: "4px solid #E3F2FD", borderTopColor: "#1976D2" }}></div>
          <p className="mt-6 text-lg" style={{ color: "#424242" }}>Loading products...</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3" style={{ color: "#1976D2" }}>Shop Products</h1>
          <p className="text-lg" style={{ color: "#616161" }}>Products available in this shop</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="#BDBDBD" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#424242" }}>No products found</h3>
              <p style={{ color: "#757575" }}>Try another shop</p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 border-2 border-transparent"
                style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)", border: "2px solid transparent" }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 truncate" style={{ color: "#212121" }}>{product.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "#757575" }}>{product.category}</p>
                  <p className="text-3xl font-bold mb-4" style={{ color: "#1976D2" }}>${product.price.toFixed(2)}</p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: product.available ? "#E8F5E9" : "#FFEBEE", color: product.available ? "#2E7D32" : "#C62828" }}>
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: product.available ? "#2E7D32" : "#C62828" }}></span>
                    {product.available ? "Available" : "Unavailable"}
                  </div>
                </div>
                <div className="px-6 py-4" style={{ backgroundColor: "#F5F5F5", borderTop: "1px solid #E0E0E0" }}>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <div style={{ color: "#616161" }}>
                      <span className="font-semibold">Category:</span> <span style={{ color: "#424242" }}>{product.category}</span>
                    </div>
                    <div style={{ color: "#616161" }}>
                      <span className="font-semibold">Price:</span> <span style={{ color: "#424242" }}>${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: "#9E9E9E" }}>
                    Updated: {new Date(product.lastUpdated || "").toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}