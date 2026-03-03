package com.example.demo.controller;

import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShopRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;

    public AnalyticsController(ProductRepository productRepository,
                               ShopRepository shopRepository) {
        this.productRepository = productRepository;
        this.shopRepository = shopRepository;
    }

    // Products per shop
    @GetMapping("/products-per-shop")
    public List<Object[]> getProductsPerShop() {
        return productRepository.countProductsPerShop();
    }

    // Claimed vs unclaimed
    @GetMapping("/claimed-shops")
    public List<Object[]> getClaimedShops() {
        return shopRepository.countClaimedShops();
    }

    // Average price per category
    @GetMapping("/average-price-per-category")
    public List<Object[]> getAveragePricePerCategory() {
        return productRepository.averagePricePerCategory();
    }
}
