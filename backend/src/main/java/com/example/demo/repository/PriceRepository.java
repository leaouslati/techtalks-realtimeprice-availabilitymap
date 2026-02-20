
package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Price;

public interface PriceRepository extends JpaRepository<Price, Long> {

    Optional<Price> findByProduct_IdAndShop_Id(Long productId, Long shopId);

}
