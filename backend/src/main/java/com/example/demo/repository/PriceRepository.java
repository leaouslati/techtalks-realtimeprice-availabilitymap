
package com.example.demo.repository;

import com.example.demo.entity.Price;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PriceRepository extends JpaRepository<Price, Long> {

    Optional<Price> findByProductIdAndShopId(Long productId, Long shopId);

}
