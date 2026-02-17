package com.example.demo;
import com.example.demo.entity.Shop;
import com.example.demo.product.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShopRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
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

        // Create Shops
        Shop techStore = new Shop(
                "TechStore",
                "Hamra Street",
                "70123456",
                0.0,
                0.0,
                false,
                "Beirut",
                "Electronics"
        );

        Shop fashionHub = new Shop(
                "FashionHub",
                "Main Road",
                "71111222",
                0.0,
                0.0,
                true,
                "Tripoli",
                "Clothing"
        );

        shopRepository.save(techStore);
        shopRepository.save(fashionHub);

        // Create Products
        Product laptop = new Product(
                "Laptop",
                1200,
                "Electronics",
                true,
                techStore
        );

        Product tshirt = new Product(
                "T-Shirt",
                25,
                "Clothing",
                true,
                fashionHub
        );

        productRepository.save(laptop);
        productRepository.save(tshirt);

        System.out.println("Database populated!");
    }
}

