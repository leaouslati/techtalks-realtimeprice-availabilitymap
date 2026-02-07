package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Shop;
import com.example.demo.service.ShopService;

@RestController
@RequestMapping("/api")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/shops")
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }

    @GetMapping("/shops/{id}")
    public Shop getShopById(@PathVariable Long id) {
        return shopService.getShopById(id);
    }
}
