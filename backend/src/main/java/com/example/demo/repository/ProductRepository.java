package com.example.demo.repository;
import java.util.List;
import com.example.demo.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p.shop.name, COUNT(p) FROM Product p GROUP BY p.shop.name")
    List<Object[]> countProductsPerShop();

    @Query("SELECT p.category, AVG(p.price) FROM Product p GROUP BY p.category")
    List<Object[]> averagePricePerCategory();

    List<Product> findByShopId(Long shopId);

}

