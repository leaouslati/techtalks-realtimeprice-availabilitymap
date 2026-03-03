package com.example.demo.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class PriceUpdatedListener {

    @EventListener
    public void handlePriceUpdated(PriceUpdatedEvent event) {

        System.out.println("PRICE CHANGE DETECTED:");
        System.out.println("Product: " + event.getProductId());
        System.out.println("Shop: " + event.getShopId());
        System.out.println("Old Price: " + event.getOldPrice());
        System.out.println("New Price: " + event.getNewPrice());
    }
}
