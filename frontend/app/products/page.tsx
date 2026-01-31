"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/api";

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
        setProducts(data as Product[]);
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
        </div>
      ))}
    </div>
  );
}
