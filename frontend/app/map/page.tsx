// frontend/app/map/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Map from '@/components/map'; 
import { getProduct, getSupermarketsByProduct, Product, Supermarket } from '@/services/api';

export default function MapPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location error:', error);
        }
      );
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (!productId) {
      setError('No product selected');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, supermarketsData] = await Promise.all([
          getProduct(productId),
          getSupermarketsByProduct(productId)
        ]);
        setProduct(productData);
        setSupermarkets(supermarketsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  if (!productId) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No product selected</h2>
        <Link href="/products">Go to Products</Link>
      </main>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => setMapsLoaded(true)}
        onError={() => setError('Failed to load Google Maps')}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Link 
          href="/products"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          ← Back to Products
        </Link>

        {error && (
          <div style={{ padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}

        {!loading && product && (
          <>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h1 style={{ margin: '0 0 10px 0' }}>Where to find: {product.name}</h1>
              <p><strong>Price:</strong> ${product.price} | <strong>Brand:</strong> {product.brand}</p>
            </div>

            {supermarkets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff3cd', borderRadius: '8px' }}>
                <h3>No supermarkets found with this product</h3>
              </div>
            ) : (
              <>
                <p style={{ marginBottom: '10px' }}>Found {supermarkets.length} supermarket(s)</p>
                {mapsLoaded && <Map supermarkets={supermarkets} userLocation={userLocation} />}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}