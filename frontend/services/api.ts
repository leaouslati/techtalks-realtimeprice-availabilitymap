// frontend/services/api.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  brand: string;
  description?: string;
}

export interface Supermarket {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  price?: number;
  available?: boolean;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Milk",
    price: 2.99,
    brand: "Dairy Fresh",
    description: "Fresh whole milk"
  },
  {
    id: "2",
    name: "Bread",
    price: 1.99,
    brand: "Bakery Good",
    description: "Whole wheat bread"
  },
  {
    id: "3",
    name: "Eggs",
    price: 3.49,
    brand: "Farm Fresh",
    description: "Grade A large eggs"
  }
];

// Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

// Fetch single product - MAKE SURE THIS IS EXPORTED
export const getProduct = async (id: string): Promise<Product | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      resolve(product || null);
    }, 500);
  });
};

// Fetch supermarkets by product - MAKE SURE THIS IS EXPORTED
export const getSupermarketsByProduct = async (productId: string): Promise<Supermarket[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Lebanese supermarket data with REAL coordinates
      const mockSupermarkets: Supermarket[] = [
        {
          id: "1",
          name: "Spinneys Beirut",
          address: "ABC Achrafieh, Beirut, Lebanon",
          location: { lat: 33.8938, lng: 35.5018 }, // Achrafieh, Beirut
          price: 2.99,
          available: true
        },
        {
          id: "2",
          name: "TSC Jnah",
          address: "Jnah, Beirut, Lebanon",
          location: { lat: 33.8715, lng: 35.4958 }, // Jnah, Beirut
          price: 3.49,
          available: true
        },
        {
          id: "3",
          name: "Monoprix Hamra",
          address: "Hamra Street, Beirut, Lebanon",
          location: { lat: 33.8967, lng: 35.4795 }, // Hamra, Beirut
          price: 2.79,
          available: false
        }
      ];
      resolve(mockSupermarkets);
    }, 500);
  });
};