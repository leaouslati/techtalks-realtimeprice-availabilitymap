//when backend ready uncomment this bellow

// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api"; // Spring Boot backend

// export const getProducts = async () => {
//   const response = await axios.get(`${API_BASE_URL}/products`);
//   return response.data;
// };

/// fake api call with mock data just for testing
import { mockProducts } from "@/lib/data";

export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500); // simulate network delay
  });
};
