package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Shop;
import com.example.demo.product.Product;
import com.example.demo.product.ProductService;
import com.example.demo.service.ShopService;


@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;
    private final ProductService productService;

    public ShopController(ShopService shopService, ProductService productService) {
        this.shopService = shopService;
        this.productService = productService;
    }
    @GetMapping
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }


    @GetMapping("/{id}")
    public Shop getShopById(@PathVariable Long id) {
        return shopService.getShopById(id);
    }
    @GetMapping("/{id}/products")
    public List<Product> getProductsByShop(@PathVariable Long id) {
        return productService.getProductsByShop(id);
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<?> claimShop(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        try {
            Shop claimedShop = shopService.claimShop(id, email);
            return ResponseEntity.ok(claimedShop);
        } catch (RuntimeException ex) {
            String message = ex.getMessage();

            if ("Shop not found".equals(message)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", message));
            }
            if ("Shop already claimed".equals(message)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", message));
            }
            if ("User not found".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Session expired. Please log in again."));
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", message != null ? message : "Failed to claim shop"));
        }
    }
}
