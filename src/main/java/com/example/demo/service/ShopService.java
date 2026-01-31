
package com.example.demo.service;

import com.example.demo.entity.Shop;
import java.util.List;

public interface ShopService {

    List<Shop> getAllShops();

    List<Shop> getShopsByCategory(String category);

    List<Shop> getShopsByLocation(String location);

    Shop getShopById(Long id);
}

