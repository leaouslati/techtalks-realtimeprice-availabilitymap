import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return response.data;
};
export const getShops = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/shops`);
  return response.data;
};

export const getProductsByShop = async (shopId: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/shops/${shopId}/products`);
  return response.data;
};

export const updateProductPrice = async (
  shopId: number,
  productId: number,
  newPrice: number,
  token: string
) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/shops/${shopId}/products/${productId}/price`,
    { newPrice },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateProductAvailability = async (
  shopId: number,
  productId: number,
  available: boolean,
  token: string
) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/shops/${shopId}/products/${productId}/availability`,
    { available },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
