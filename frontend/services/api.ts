
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};
export const getShops=async()=>{
  const response = await axios.get(`${API_BASE_URL}/shops`);
  return response.data;
};
