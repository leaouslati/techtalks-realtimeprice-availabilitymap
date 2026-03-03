package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PriceUpdateResponse;
import com.example.demo.dto.UpdateAvailabilityRequest;
import com.example.demo.dto.UpdatePriceRequest;
import com.example.demo.entity.Price;
import com.example.demo.event.PriceUpdatedEvent;
import com.example.demo.repository.PriceRepository;

import jakarta.transaction.Transactional;

@Service
public class PriceService {
     private final PriceRepository priceRepository;
     private final ApplicationEventPublisher eventPublisher;

     public PriceService(PriceRepository priceRepository, ApplicationEventPublisher eventPublisher) {

        this.priceRepository = priceRepository;
        this.eventPublisher = eventPublisher;
}
    
@Transactional
public PriceUpdateResponse updatePrice(
        Long shopId,
        Long productId,
        UpdatePriceRequest request){

    Price price = priceRepository
        .findByProduct_IdAndShop_Id(productId, shopId)
        .orElseThrow(() -> new RuntimeException("Price not found"));

   BigDecimal oldPrice = price.getPrice();
   BigDecimal newPrice = request.getNewPrice();

   if (newPrice.compareTo(BigDecimal.ZERO) <= 0) {
    throw new IllegalArgumentException("Price must be greater than zero");
}

    if(oldPrice.compareTo(newPrice) != 0 ){

    price.setPrice(newPrice);
    price.setUpdatedAt(LocalDateTime.now());
    price.setUpdatedBy(1L);//replace with authenticated user ID 
    eventPublisher.publishEvent(
        new PriceUpdatedEvent(
            productId,
            shopId,
            oldPrice,
            newPrice,
            price.getUpdatedAt()
        )
    );
    }

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
public PriceUpdateResponse updateAvailability(
        Long shopId,
        Long productId,
        UpdateAvailabilityRequest request){

    Price price = priceRepository
        .findByProduct_IdAndShop_Id(productId, shopId)
        .orElseThrow(() -> new RuntimeException("Price not found"));

    price.setAvailable(request.getAvailable());
    price.setUpdatedAt(LocalDateTime.now());
    price.setUpdatedBy(1L);//replace with authenticated user ID

    priceRepository.save(price);

    return new PriceUpdateResponse(
    "AVAILABILITY_UPDATE",
    price.getProduct().getId(),
    price.getShop().getId(),
    null,
    null,
    price.getUpdatedAt()
);
}


}

