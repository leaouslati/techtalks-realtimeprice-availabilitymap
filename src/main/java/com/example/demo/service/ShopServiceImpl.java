package com.example.demo.service;


import  com.example.demo.entity.Shop;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {

    private final List<Shop> shops = List.of(
        new Shop( "Tech Store","","Beirut",  "Electronics"),
        new Shop( "Fashion Hub","" , "Tripoli","Clothing" ),
        new Shop( "Book World","", "Beirut", "Books" )
    );

    @Override
    public List<Shop> getAllShops() {
        return shops;
    }

    @Override
    public List<Shop> getShopsByCategory(String category) {
        return shops.stream()
                .filter(shop -> shop.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    @Override
    public List<Shop> getShopsByLocation(String location) {
        return shops.stream()
                .filter(shop -> shop.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    @Override
    public Shop getShopById(Long id) {
        return shops.stream()
                .filter(shop -> shop.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}

