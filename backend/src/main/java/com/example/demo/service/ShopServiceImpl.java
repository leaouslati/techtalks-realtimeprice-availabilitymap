package com.example.demo.service;
import com.example.demo.repository.ShopRepository;
import  com.example.demo.entity.Shop;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {
    private final ShopRepository shopRepository;

    public ShopServiceImpl(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    @Override
    public List<Shop> getShopsByCategory(String category) {
        return shopRepository.findAll()
                .stream()
                .filter(shop -> shop.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    @Override
    public List<Shop> getShopsByLocation(String location) {
        return shopRepository.findAll()
                .stream()
                .filter(shop -> shop.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    @Override
    public Shop getShopById(Long id) {
        return shopRepository.findById(id).orElse(null);
    }
}

