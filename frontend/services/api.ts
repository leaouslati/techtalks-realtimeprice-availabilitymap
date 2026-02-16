import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return response.data;
};
export const getShops = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/shops`);
  return response.data;
};
