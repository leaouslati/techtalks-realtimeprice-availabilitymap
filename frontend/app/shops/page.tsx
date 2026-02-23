"use client";
import { useEffect, useState } from "react";
import { getShops } from "@/services/api";

type Shop = {
    id: number;
    name: string;
    address: string;
    category: string;
    location: string;
};

export default function ShopsPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await getShops();
                setShops(data as Shop[]);
            } catch (err) {
                setError("Failed to load shops");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    if (loading) return <p>Loading shops...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div style={{ padding: "20px" }}>
            <h1>Shops</h1>
            {shops.map((shop) => (
                <div
                    key={shop.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                        width: "300px",
                        maxWidth: "100%",

                    }}
                >
                    <p><strong>Name:</strong> {shop.name}</p>
                    <p><strong>Address:</strong> {shop.address}</p>
                    <p><strong>Category:</strong> {shop.category}</p>
                    <p><strong>Location:</strong> {shop.location}</p>
                </div>
            ))}
        </div>
    );
}