package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PriceUpdateResponse;
import com.example.demo.dto.UpdateAvailabilityRequest;
import com.example.demo.dto.UpdatePriceRequest;
import com.example.demo.service.PriceService;

@RestController
@RequestMapping("/api")

public class PriceController {
    private final PriceService priceService;

    public PriceController(PriceService priceService) {
    this.priceService = priceService;
}

@PutMapping("/shops/{shopId}/products/{productId}/price")
public ResponseEntity<PriceUpdateResponse> updatePrice(
        @PathVariable Long shopId,
        @PathVariable Long productId,
        @RequestBody UpdatePriceRequest request) {

    return ResponseEntity.ok(priceService.updatePrice(shopId, productId, request));
}

@PutMapping("/shops/{shopId}/products/{productId}/availability")
public ResponseEntity<PriceUpdateResponse> updateAvailability(
        @PathVariable Long shopId,
        @PathVariable Long productId,
        @RequestBody UpdateAvailabilityRequest request) {

    return ResponseEntity.ok(priceService.updateAvailability(shopId, productId, request));
}

}
