package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Shop;
import com.example.demo.entity.User;
import com.example.demo.repository.ShopRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopServiceImpl(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
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

    @Override
    public Shop claimShop(Long id, String userEmail) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (shop.isClaimed()) {
            throw new RuntimeException("Shop already claimed");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        shop.setClaimed(true);

        if (user.getRole() != Role.SHOP_OWNER) {
            user.setRole(Role.SHOP_OWNER);
            userRepository.save(user);
        }

        return shopRepository.save(shop);
    }
}
