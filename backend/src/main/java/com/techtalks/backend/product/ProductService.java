package com.techtalks.backend.product;
import java.util.ArrayList;
import java.util.List;
public class ProductService {
    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "Gasoline", 1.5, "Fuel", "Beirut"));
        products.add(new Product(2L, "Milk", 2.0, "Groceries", "Tripoli"));
        products.add(new Product(3L, "Painkiller", 3.5, "Medicine", "Beirut"));
        products.add(new Product(4L, "sweets", 5.5, "sweets", "jbeil"));
        return products;
    }

    // Filter by category
    public List<Product> getProductsByCategory(String category) {
        List<Product> result = new ArrayList<>();
        for (Product product : getAllProducts()) {
            if (product.getCategory().equalsIgnoreCase(category)) {
                result.add(product);
            }
        }
        return result;
    }

    // Filter by location
    public List<Product> getProductsByLocation(String location) {
        List<Product> result = new ArrayList<>();
        for (Product product : getAllProducts()) {
            if (product.getLocation().equalsIgnoreCase(location)) {
                result.add(product);
            }
        }
        return result;
    }

    // Get product by ID
    public Product getProductById(Long id) {
        for (Product product : getAllProducts()) {
            if (product.getId().equals(id)) {
                return product;
            }
        }
        return null;
    }

}
