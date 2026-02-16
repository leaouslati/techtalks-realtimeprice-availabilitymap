"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/api";
import Link from "next/link";  // ← ADD THIS IMPORT

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  location: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Price:</strong> {product.price}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Location:</strong> {product.location}
          </p>
          {/* ADD THIS BUTTON */}
          <Link 
            href={`/map?product=${product.id}`}
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            👀 View on Map
          </Link>
        </div>
      ))}
    </div>
  );
}