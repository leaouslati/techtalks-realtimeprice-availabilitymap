package com.example.demo.service;


import  com.example.demo.entity.Shop;
import java.util.List;

public interface ShopService {

    Shop createShop(Shop shop);

    List<Shop> getAllShops();
}
