package com.example.demo;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Shop;
import com.example.demo.product.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShopRepository;

@Component
public class DataLoader implements CommandLineRunner {
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public DataLoader(ShopRepository shopRepository, ProductRepository productRepository) {
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {

        // Create Shops with real Lebanon coordinates
        Shop techStore = new Shop(
                "TechStore",
                "Hamra Street, Beirut",
                "70123456",
                33.8938,   // latitude  (Hamra, Beirut)
                35.4788,   // longitude
                false,
                "Beirut",
                "Electronics",4.5
        );

        Shop fashionHub = new Shop(
                "FashionHub",
                "Al Mina Street, Tripoli",
                "71111222",
                34.4367,   // latitude  (Tripoli)
                35.8497,   // longitude
                true,
                "Tripoli",
                "Clothing",4.0
        );

        shopRepository.save(techStore);
        shopRepository.save(fashionHub);

        // Create Products
        Product laptop = new Product(
                "Laptop",
                1200,
                "Electronics",
                true
        );

        Product tshirt = new Product(
                "T-Shirt",
                25,
                "Clothing",
                true
        );

        // Link products to shops
        laptop.setShops(List.of(techStore));
        tshirt.setShops(List.of(fashionHub));

        // Set shopId for frontend filtering
        laptop.setShopId(techStore.getId());
        tshirt.setShopId(fashionHub.getId());

        productRepository.save(laptop);
        productRepository.save(tshirt);

        System.out.println("Database populated!");
    }
}