package com.example.demo;

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
        Product phone = new Product("Phone", 800, "Electronics", true);
        Product headphones = new Product("Headphones", 150, "Electronics", true);
        Product jeans = new Product("Jeans", 60, "Clothing", true);
        Product jacket = new Product("Jacket", 120, "Clothing", false);

        laptop.setShop(techStore);
        tshirt.setShop(fashionHub);
        phone.setShop(techStore);
        headphones.setShop(techStore);
        jeans.setShop(fashionHub);
        jacket.setShop(fashionHub);

        productRepository.save(phone);
        productRepository.save(headphones);
        productRepository.save(jeans);
        productRepository.save(jacket);

        productRepository.save(laptop);
        productRepository.save(tshirt);

        System.out.println("Database populated!");
    }
}