package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.ShopService;
import com.example.demo.product.Product;
import com.example.demo.service.*;
import com.example.demo.entity.Shop;
import com.example.demo.service.ShopService;

import com.example.demo.product.ProductService;
import java.util.List;


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
}
