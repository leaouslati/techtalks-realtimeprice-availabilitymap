package com.techtalks.backend.product;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final List<Product> products = List.of(
        new Product(1L, "Gasoline", 1.5, "Fuel", "Beirut"),
        new Product(2L, "Milk", 2.0, "Groceries", "Tripoli"),
        new Product(3L, "Painkiller", 3.5, "Medicine", "Beirut"),
        new Product(4L, "Sweets", 5.5, "Sweets", "Jbeil")
    );

    public List<Product> getAllProducts() {
        return products;
    }

    public List<Product> getProductsByCategory(String category) {
        return products.stream()
                .filter(product -> product.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    public List<Product> getProductsByLocation(String location) {
        return products.stream()
                .filter(product -> product.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    public Product getProductById(Long id) {
        return products.stream()
                .filter(product -> product.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
