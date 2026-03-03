package com.example.demo.repository;
import com.example.demo.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface ShopRepository extends JpaRepository<Shop, Long> {
    @Query("SELECT s.claimed, COUNT(s) FROM Shop s GROUP BY s.claimed")
    List<Object[]> countClaimedShops();
    @Query("SELECT p.category, AVG(pr.price) FROM Price pr JOIN pr.product p GROUP BY p.category")
    List<Object[]> averagePricePerCategory();
}
