package com.example.demo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Price;
import com.example.demo.entity.Shop;
import com.example.demo.product.Product;
import com.example.demo.repository.PriceRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShopRepository;

@Component
public class DataLoader implements CommandLineRunner {
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final PriceRepository priceRepository;

    public DataLoader(ShopRepository shopRepository, ProductRepository productRepository, PriceRepository priceRepository) {
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.priceRepository = priceRepository;
    }

    @Override
    public void run(String... args) {

        Shop techStore = new Shop(
                "TechStore",
                "Hamra Street, Beirut",
                "70123456",
                33.8938,
                35.4788,
                false,
                "Beirut",
                "Electronics",
                4.5
        );

        Shop fashionHub = new Shop(
                "FashionHub",
                "Al Mina Street, Tripoli",
                "71111222",
                34.4367,
                35.8497,
                true,
                "Tripoli",
                "Clothing",
                4.0
        );

        shopRepository.save(techStore);
        shopRepository.save(fashionHub);

        Product laptop = new Product("Laptop", "Electronics");
        Product phone = new Product("Phone", "Electronics");
        Product headphones = new Product("Headphones", "Electronics");
        Product tshirt = new Product("T-Shirt", "Clothing");
        Product jeans = new Product("Jeans", "Clothing");
        Product jacket = new Product("Jacket", "Clothing");

        productRepository.save(laptop);
        productRepository.save(phone);
        productRepository.save(headphones);
        productRepository.save(tshirt);
        productRepository.save(jeans);
        productRepository.save(jacket);

        createPrice(laptop, techStore, BigDecimal.valueOf(1200), true);
        createPrice(phone, techStore, BigDecimal.valueOf(800), true);
        createPrice(headphones, techStore, BigDecimal.valueOf(150), true);
        createPrice(tshirt, fashionHub, BigDecimal.valueOf(25), true);
        createPrice(jeans, fashionHub, BigDecimal.valueOf(60), true);
        createPrice(jacket, fashionHub, BigDecimal.valueOf(120), false);

        System.out.println("Database populated!");
    }

    private void createPrice(Product product, Shop shop, BigDecimal amount, boolean available) {
        Price price = new Price();
        price.setProduct(product);
        price.setShop(shop);
        price.setPrice(amount);
        price.setAvailable(available);
        price.setUpdatedAt(LocalDateTime.now());
        priceRepository.save(price);
    }
}
