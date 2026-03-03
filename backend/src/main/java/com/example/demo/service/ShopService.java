
package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Shop;

public interface ShopService {

    List<Shop> getAllShops();

    List<Shop> getShopsByCategory(String category);

    List<Shop> getShopsByLocation(String location);

    Shop getShopById(Long id);

    Shop claimShop(Long id, String userEmail);
}

