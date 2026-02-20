package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PriceUpdateResponse;
import com.example.demo.dto.UpdateAvailabilityRequest;
import com.example.demo.dto.UpdatePriceRequest;
import com.example.demo.service.PriceService;

@RestController
@RequestMapping("/api/prices")

public class PriceController {
    private final PriceService priceService;

    public PriceController(PriceService priceService) {
    this.priceService = priceService;
}

@PostMapping("/update")
public ResponseEntity<PriceUpdateResponse> updatePrice(
        @RequestBody UpdatePriceRequest request) {

    return ResponseEntity.ok(priceService.updatePrice(request));
}

@PostMapping("/update-availability")
public ResponseEntity<PriceUpdateResponse> updateAvailability(
        @RequestBody UpdateAvailabilityRequest request) {

    return ResponseEntity.ok(priceService.updateAvailability(request));
}

}
