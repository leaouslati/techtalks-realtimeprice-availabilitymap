package com.example.demo.service;


import  com.example.demo.entity.Shop;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {

    private List<Shop> shops = new ArrayList<>();

    @Override
    public Shop createShop(Shop shop) {
        shops.add(shop);
        return shop;
    }

    @Override
    public List<Shop> getAllShops() {
        return shops;
    }
}

