package com.example.demo.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.product.Product;
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT s.name, COUNT(pr) FROM Price pr JOIN pr.shop s GROUP BY s.name")
    List<Object[]> countProductsPerShop();

    @Query("SELECT p.category, AVG(pr.price) FROM Price pr JOIN pr.product p GROUP BY p.category")
    List<Object[]> averagePricePerCategory();

    @Query("SELECT DISTINCT p FROM Price pr JOIN pr.product p WHERE pr.shop.id = ?1")
    List<Product> findByShopId(Long shopId);

}

