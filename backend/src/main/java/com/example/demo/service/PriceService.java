package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.demo.dto.PriceUpdateResponse;
import com.example.demo.dto.UpdateAvailabilityRequest;
import com.example.demo.dto.UpdatePriceRequest;
import com.example.demo.entity.Price;
import com.example.demo.repository.PriceRepository;

import jakarta.transaction.Transactional;

@Service
public class PriceService {
     private final PriceRepository priceRepository;

     public PriceService(PriceRepository priceRepository) {
    this.priceRepository = priceRepository;
}
    
@Transactional
public PriceUpdateResponse updatePrice(UpdatePriceRequest request) {

    Price price = priceRepository
        .findByProductIdAndShopId(request.getProductID(), request.getShopID())
        .orElseThrow(() -> new RuntimeException("Price not found"));

    if (request.getNewPrice() == 0 || request.getNewPrice() <= 0) {
        throw new RuntimeException("Invalid price");
    }

    Double oldPrice = price.getPrice();

    price.setPrice(request.getNewPrice());
    price.setUpdatedAt(LocalDateTime.now());
    price.setUpdatedBy(request.getUserID());

    priceRepository.save(price);

    return new PriceUpdateResponse(
        "PRICE_UPDATE",
        price.getProduct().getId(),
        price.getShop().getId(),
        oldPrice,
        price.getPrice(),
        price.getUpdatedAt()
    );
}

@Transactional
public PriceUpdateResponse updateAvailability(UpdateAvailabilityRequest request) {

    Price price = priceRepository
        .findByProductIdAndShopId(request.getProductID(), request.getShopID())
        .orElseThrow(() -> new RuntimeException("Price not found"));

    price.setAvailable(request.getAvailable());
    price.setUpdatedAt(LocalDateTime.now());
    price.setUpdatedBy(request.getUserID());

    priceRepository.save(price);

    return new PriceUpdateResponse(
        "AVAILABILITY_UPDATE",
        price.getProduct().getId(),
        price.getShop().getId(),
        price.getPrice(),
        price.getPrice(),
        price.getUpdatedAt()
    );
}
}

