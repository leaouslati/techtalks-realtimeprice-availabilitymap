"use client";

import { useParams } from "next/navigation";

export default function ShopDetailsPage() {
  const params = useParams(); // gets { id: '1', '2', ... }
  const shopId = params.id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Products for Shop ID: {shopId}
      </h1>
      <p className="text-gray-600">
        This is where the products of the shop will be displayed.
      </p>
    </div>
  );
}